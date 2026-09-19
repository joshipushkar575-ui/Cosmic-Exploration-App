import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const TARGET_NAMES: Record<string, string> = {
  "199": "Mercury",
  "299": "Venus",
  "399": "Earth",
  "499": "Mars",
  "599": "Jupiter",
  "699": "Saturn",
  "799": "Uranus",
  "899": "Neptune",
  "301": "Moon",
  "10": "Sun",

  // Spacecraft supported by NASA/JPL Horizons
  "-170": "James Webb Space Telescope",
  "-48": "Hubble Space Telescope",
  "-82": "Cassini",
};

const SPACECRAFT_TARGETS = new Set(["-170", "-48", "-82"]);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();

    const target = String(body.target ?? "599");
    const isSpacecraft = SPACECRAFT_TARGETS.has(target);
    const vectorRequest = Boolean(body.vector) && !isSpacecraft;

    if (!TARGET_NAMES[target]) {
      return new Response(
        JSON.stringify({
          success: false,
          source: "NASA/JPL Horizons",
          target,
          error: "Unsupported target.",
        }),
        {
          status: 200,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    const now = new Date();
    const start = now.toISOString().replace(".000Z", "Z");
    const stopDate = new Date(now.getTime() + 60 * 1000);
    const stop = stopDate.toISOString().replace(".000Z", "Z");

    /*
     * Spacecraft:
     * Request real Cartesian state vectors relative to Earth.
     *
     * Vectors are the correct JPL Horizons output for a 3D
     * spacecraft visualizer because they provide x/y/z and velocity.
     *
     * Planets:
     * Keep the existing observer ephemeris behaviour unchanged.
     */

    const params = isSpacecraft
      ? new URLSearchParams({
          format: "json",
          COMMAND: `'${target}'`,
          OBJ_DATA: "NO",
          MAKE_EPHEM: "YES",
          EPHEM_TYPE: "VECTORS",
          CENTER: "500@399",
          START_TIME: `'${start}'`,
          STOP_TIME: `'${stop}'`,
          STEP_SIZE: "'1 m'",
          OUT_UNITS: "KM-S",
          VEC_TABLE: "2",
          VEC_CORR: "NONE",
          REF_SYSTEM: "ICRF",
          CSV_FORMAT: "YES",
        })
      : vectorRequest
        ? new URLSearchParams({
            format: "json",
            COMMAND: `'${target}'`,
            OBJ_DATA: "NO",
            MAKE_EPHEM: "YES",
            EPHEM_TYPE: "VECTORS",
            CENTER: "500@10",
            START_TIME: `'${start}'`,
            STOP_TIME: `'${stop}'`,
            STEP_SIZE: "'1 m'",
            OUT_UNITS: "KM-S",
            VEC_TABLE: "2",
            VEC_CORR: "NONE",
            REF_SYSTEM: "ICRF",
            CSV_FORMAT: "YES",
          })
        : new URLSearchParams({
            format: "json",
            COMMAND: `'${target}'`,
            OBJ_DATA: "NO",
            MAKE_EPHEM: "YES",
            EPHEM_TYPE: "OBSERVER",
            CENTER: "coord",
            COORD_TYPE: "GEODETIC",
            SITE_COORD: "'75.7873,26.9124,0'",
            START_TIME: `'${start}'`,
            STOP_TIME: `'${stop}'`,
            STEP_SIZE: "'1 m'",
            QUANTITIES: "'4,9,20,23,24,29'",
            ANG_FORMAT: "DEG",
            APPARENT: "AIRLESS",
            CSV_FORMAT: "YES",
          });

    const response = await fetch(
      `https://ssd.jpl.nasa.gov/api/horizons.api?${params.toString()}`,
    );

    const rawText = await response.text();

    if (!response.ok) {
      return new Response(
        JSON.stringify({
          success: false,
          source: "NASA/JPL Horizons",
          status: response.status,
          error: rawText,
        }),
        {
          status: 200,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    let horizons: any;

    try {
      horizons = JSON.parse(rawText);
    } catch {
      return new Response(
        JSON.stringify({
          success: false,
          source: "NASA/JPL Horizons",
          error: "Invalid JSON returned by JPL Horizons.",
        }),
        {
          status: 200,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    if (horizons.error) {
      return new Response(
        JSON.stringify({
          success: false,
          source: "NASA/JPL Horizons",
          target,
          targetName: TARGET_NAMES[target],
          error: horizons.error,
        }),
        {
          status: 200,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    const resultText = String(horizons.result ?? "");

    const soeIndex = resultText.indexOf("$$SOE");
    const eoeIndex = resultText.indexOf("$$EOE");

    if (soeIndex === -1 || eoeIndex === -1) {
      return new Response(
        JSON.stringify({
          success: false,
          source: "NASA/JPL Horizons",
          target,
          targetName: TARGET_NAMES[target],
          error: "JPL ephemeris data block was not found.",
        }),
        {
          status: 200,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    const dataBlock = resultText
      .slice(soeIndex + 5, eoeIndex)
      .trim();

    const firstRow = dataBlock
      .split("\n")
      .map((line) => line.trim())
      .find((line) => line.length > 0);

    if (!firstRow) {
      return new Response(
        JSON.stringify({
          success: false,
          source: "NASA/JPL Horizons",
          target,
          targetName: TARGET_NAMES[target],
          error: "JPL returned an empty ephemeris row.",
        }),
        {
          status: 200,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    const columns = firstRow
      .split(",")
      .map((value) => value.trim());

    /*
     * Spacecraft vector response:
     *
     * VEC_TABLE=2 returns:
     * time, x, y, z, vx, vy, vz
     *
     * Units:
     * km and km/s
     */

    if (isSpacecraft) {
      /*
       * Horizons CSV vector rows can contain additional fields around
       * the epoch depending on the selected table settings.
       * Locate the numeric XYZ + velocity sequence instead of assuming
       * fixed CSV indexes.
       */

      const numericValues = columns
        .map((value) => Number.parseFloat(value))
        .filter((value) => Number.isFinite(value));

      const position = {
        x: numericValues[1],
        y: numericValues[2],
        z: numericValues[3],
        vx: numericValues[4],
        vy: numericValues[5],
        vz: numericValues[6],
        epoch: columns[0] ?? null,
        units: "km / km/s",
      };

      const hasValidPosition = [
        position.x,
        position.y,
        position.z,
      ].every(Number.isFinite);

      if (!hasValidPosition) {
        return new Response(
          JSON.stringify({
            success: false,
            source: "NASA/JPL Horizons",
            target,
            targetName: TARGET_NAMES[target],
            error: "JPL returned unavailable spacecraft position data.",
          }),
          {
            status: 200,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
            },
          },
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          source: "NASA/JPL Horizons",
          target,
          targetName: TARGET_NAMES[target],
          spacecraft: true,
          position,
          fetchedAt: new Date().toISOString(),
        }),
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    /*
     * Heliocentric planet vector data.
     *
     * CENTER=500@10 means the origin is the center of the Sun.
     * Horizons VEC_TABLE=2 returns position and velocity.
     */
    if (vectorRequest) {
      const numericValues = columns
        .map((value) => Number.parseFloat(value))
        .filter((value) => Number.isFinite(value));

      const position = {
        x: numericValues[1],
        y: numericValues[2],
        z: numericValues[3],
        vx: numericValues[4],
        vy: numericValues[5],
        vz: numericValues[6],
        epoch: columns[0] ?? null,
        units: "km / km/s",
        reference: "ICRF",
        center: "Sun",
      };

      const hasValidPosition = [
        position.x,
        position.y,
        position.z,
      ].every(Number.isFinite);

      if (!hasValidPosition) {
        return new Response(
          JSON.stringify({
            success: false,
            source: "NASA/JPL Horizons",
            target,
            targetName: TARGET_NAMES[target],
            error: "JPL returned unavailable planetary vector data.",
          }),
          {
            status: 200,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
            },
          },
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          source: "NASA/JPL Horizons",
          target,
          targetName: TARGET_NAMES[target],
          vector: true,
          position,
          fetchedAt: new Date().toISOString(),
        }),
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    /*
     * Existing planet / Sun / Moon observer data.
     */

    const ephemeris = {
      timestamp: columns[0] ?? null,
      azimuth: Number.parseFloat(columns[3]),
      altitude: Number.parseFloat(columns[4]),
      apparentMagnitude: Number.parseFloat(columns[5]),
      surfaceBrightness: Number.parseFloat(columns[6]),
      distanceAU: Number.parseFloat(columns[7]),
      rangeRateKmS: Number.parseFloat(columns[8]),
      solarElongation: Number.parseFloat(columns[9]),
      sunTargetObserverAngle: Number.parseFloat(columns[11]),
      constellation: columns[12] ?? null,
    };

    return new Response(
      JSON.stringify({
        success: true,
        source: "NASA/JPL Horizons",
        target,
        targetName: TARGET_NAMES[target] ?? target,
        observer: {
          latitude: 26.9124,
          longitude: 75.7873,
          elevation: 0,
        },
        ephemeris,
        fetchedAt: new Date().toISOString(),
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        source: "NASA/JPL Horizons",
        error:
          error instanceof Error
            ? error.message
            : "JPL Horizons request failed.",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      },
    );
  }
});
