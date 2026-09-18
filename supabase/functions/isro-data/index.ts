import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

const PRADAN_BASE = "https://pradan.issdc.gov.in";

const MISSION_DATA = {
  "chandrayaan-3": {
    name: "Chandrayaan-3",
    category: "Lunar Exploration",
    description:
      "India's lunar landing mission focused on demonstrating safe landing and rover operations on the Moon.",
    officialPortal: `${PRADAN_BASE}/ch3/`,
    source: "ISRO / ISSDC / PRADAN",
  },
  "chandrayaan-2": {
    name: "Chandrayaan-2",
    category: "Lunar Science",
    description:
      "India's lunar mission carrying an orbiter and scientific instruments for studying the Moon.",
    officialPortal: `${PRADAN_BASE}/ch2/`,
    source: "ISRO / ISSDC / PRADAN",
  },
  "aditya-l1": {
    name: "Aditya-L1",
    category: "Solar Science",
    description:
      "India's space-based solar observatory studying the Sun from the Sun–Earth L1 region.",
    officialPortal: `${PRADAN_BASE}/al1/`,
    source: "ISRO / ISSDC / PRADAN",
  },
  "astrosat": {
    name: "AstroSat",
    category: "Space Astronomy",
    description:
      "India's multi-wavelength astronomy observatory for studying celestial sources.",
    officialPortal: `${PRADAN_BASE}/astrosat/`,
    source: "ISRO / ISSDC / PRADAN",
  },
  "xposat": {
    name: "XPoSat",
    category: "X-Ray Astronomy",
    description:
      "India's X-ray polarimetry mission for studying high-energy astronomical sources.",
    officialPortal: `${PRADAN_BASE}/xposat/`,
    source: "ISRO / ISSDC / PRADAN",
  },
};

function response(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);

    let body: Record<string, unknown> = {};

    if (req.method !== "GET") {
      try {
        const parsed = await req.json();

        if (parsed && typeof parsed === "object") {
          body = parsed as Record<string, unknown>;
        }
      } catch {
        // Empty body.
      }
    }

    const type =
      (typeof body.type === "string" ? body.type : null) ||
      url.searchParams.get("type") ||
      "missions";

    if (type === "missions") {
      return response({
        success: true,
        source: "ISRO / ISSDC / PRADAN",
        type,
        data: Object.values(MISSION_DATA),
        fetchedAt: new Date().toISOString(),
      });
    }

    if (type === "mission") {
      const mission =
        (typeof body.mission === "string" ? body.mission : null) ||
        url.searchParams.get("mission");

      if (!mission || !(mission in MISSION_DATA)) {
        return response(
          {
            success: false,
            source: "ISRO / ISSDC / PRADAN",
            error: "Unknown ISRO mission.",
            availableMissions: Object.keys(MISSION_DATA),
          },
          400,
        );
      }

      return response({
        success: true,
        source: "ISRO / ISSDC / PRADAN",
        type,
        data: MISSION_DATA[mission as keyof typeof MISSION_DATA],
        fetchedAt: new Date().toISOString(),
      });
    }

    if (type === "sources") {
      return response({
        success: true,
        source: "ISRO",
        type,
        data: {
          scienceData: "https://www.isro.gov.in/Sciencedata.html",
          pradan: "https://pradan.issdc.gov.in/",
          bhoonidhi: "https://bhoonidhi.nrsc.gov.in/",
          bhoonidhiApi:
            "https://bhoonidhi.nrsc.gov.in/bhoonidhi-api/",
        },
        fetchedAt: new Date().toISOString(),
      });
    }

    return response(
      {
        success: false,
        source: "ISRO",
        error: "Unknown ISRO data type.",
        availableTypes: ["missions", "mission", "sources"],
      },
      400,
    );
  } catch (error) {
    return response(
      {
        success: false,
        source: "ISRO",
        error:
          error instanceof Error
            ? error.message
            : "ISRO request failed.",
      },
      500,
    );
  }
});
