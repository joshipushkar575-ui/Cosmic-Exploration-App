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
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();

    const target = String(body.target ?? "599");
    const lat = Number(body.lat ?? 26.9124);
    const lon = Number(body.lon ?? 75.7873);
    const elevation = Number(body.elevation ?? 0);

    const now = new Date();
    const start = now.toISOString().replace(".000Z", "Z");

    const stopDate = new Date(now.getTime() + 60 * 1000);
    const stop = stopDate.toISOString().replace(".000Z", "Z");

    const params = new URLSearchParams({
      format: "json",
      COMMAND: `'${target}'`,
      OBJ_DATA: "NO",
      MAKE_EPHEM: "YES",
      EPHEM_TYPE: "OBSERVER",
      CENTER: "coord",
      COORD_TYPE: "GEODETIC",
      SITE_COORD: `'${lon},${lat},${elevation / 1000}'`,
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
      Horizons requested quantities:

      4  = RA / DEC
      9  = observer range
      20 = observer range-rate
      23 = solar elongation
      24 = Sun-Target-Observer angle
      29 = constellation
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
          latitude: lat,
          longitude: lon,
          elevation,
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
