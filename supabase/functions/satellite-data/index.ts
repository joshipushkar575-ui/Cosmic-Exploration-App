const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const ISS_URL =
  "https://api.wheretheiss.at/v1/satellites/25544";

const TLE_URL =
  "https://api.wheretheiss.at/v1/satellites/25544/tles";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const [issResponse, tleResponse] = await Promise.all([
      fetch(ISS_URL, {
        headers: {
          Accept: "application/json",
          "User-Agent": "VYOM-Astronomy-App/1.0",
        },
      }),
      fetch(TLE_URL, {
        headers: {
          Accept: "application/json",
          "User-Agent": "VYOM-Astronomy-App/1.0",
        },
      }),
    ]);

    const issText = await issResponse.text();
    const tleText = await tleResponse.text();

    if (!issResponse.ok) {
      throw new Error(
        `ISS API HTTP ${issResponse.status}: ${issText.slice(0, 300)}`
      );
    }

    if (!tleResponse.ok) {
      throw new Error(
        `TLE API HTTP ${tleResponse.status}: ${tleText.slice(0, 300)}`
      );
    }

    const data = JSON.parse(issText);
    const tle = JSON.parse(tleText);

    return new Response(
      JSON.stringify({
        success: true,
        source: "Where The ISS At? + live TLE",
        satellite: [
          {
            OBJECT_NAME: "ISS (ZARYA)",
            OBJECT_ID: "1998-067A",
            NORAD_CAT_ID: 25544,
            latitude: data.latitude,
            longitude: data.longitude,
            altitude: data.altitude,
            velocity: data.velocity,
            visibility: data.visibility,
            timestamp: data.timestamp,

            tle: {
              name: tle.header || "ISS (ZARYA)",
              line1: tle.line1,
              line2: tle.line2,
              epoch: tle.tle_timestamp,
            },
          },
        ],
        fetchedAt: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=5",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "ISS data request failed.",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
