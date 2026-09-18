import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

const NASA_BASE = "https://api.nasa.gov";

function response(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

async function nasa(path: string) {
  const key = Deno.env.get("NASA_API_KEY");

  if (!key) {
    throw new Error("NASA_API_KEY is not configured");
  }

  const separator = path.includes("?") ? "&" : "?";

  const res = await fetch(
    `${NASA_BASE}${path}${separator}api_key=${encodeURIComponent(key)}`
  );

  if (!res.ok) {
    const errorText = await res.text();

    throw new Error(
      `NASA API returned ${res.status}: ${errorText.slice(0, 500)}`
    );
  }

  return await res.json();
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  try {
    const url = new URL(req.url);

    const url = new URL(req.url);

    let body: Record<string, unknown> = {};

    if (req.method !== "GET") {
      try {
        const parsed = await req.json();

        if (parsed && typeof parsed === "object") {
          body = parsed as Record<string, unknown>;
        }
      } catch {
        // Empty or invalid JSON body; fall back to query parameters.
      }
    }

    const type =
      (typeof body.type === "string" ? body.type : null) ||
      url.searchParams.get("type") ||
      "apod";

    // ---------------------------------------------------------
    // NASA APOD
    // ---------------------------------------------------------

    if (type === "apod") {
      const data = await nasa("/planetary/apod?thumbs=true");

      return response({
        success: true,
        source: "NASA",
        type: "apod",
        data,
        fetchedAt: new Date().toISOString(),
      });
    }

    // ---------------------------------------------------------
    // NASA NEAR EARTH OBJECTS
    // ---------------------------------------------------------

    if (type === "neo") {
      const now = new Date();

      const startDate = now.toISOString().slice(0, 10);

      const future = new Date(now);
      future.setUTCDate(future.getUTCDate() + 3);

      const endDate = future.toISOString().slice(0, 10);

      const data = await nasa(
        `/neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate}`
      );

      return response({
        success: true,
        source: "NASA",
        type: "neo",
        data,
        fetchedAt: new Date().toISOString(),
      });
    }

    // ---------------------------------------------------------
    // NASA DONKI — SOLAR FLARES
    // ---------------------------------------------------------

    if (type === "solar-flares") {
      const now = new Date();

      const startDate = now.toISOString().slice(0, 10);

      const past = new Date(now);
      past.setUTCDate(past.getUTCDate() - 7);

      const endDate = now.toISOString().slice(0, 10);

      const data = await nasa(
        `/DONKI/FLR?startDate=${past.toISOString().slice(0, 10)}&endDate=${endDate}`
      );

      return response({
        success: true,
        source: "NASA DONKI",
        type: "solar-flares",
        data,
        fetchedAt: new Date().toISOString(),
      });
    }

    // ---------------------------------------------------------
    // NASA DONKI — CORONAL MASS EJECTIONS
    // ---------------------------------------------------------

    if (type === "cme") {
      const now = new Date();

      const past = new Date(now);
      past.setUTCDate(past.getUTCDate() - 7);

      const data = await nasa(
        `/DONKI/CME?startDate=${past.toISOString().slice(0, 10)}&endDate=${now.toISOString().slice(0, 10)}`
      );

      return response({
        success: true,
        source: "NASA DONKI",
        type: "cme",
        data,
        fetchedAt: new Date().toISOString(),
      });
    }

    // ---------------------------------------------------------
    // NASA DONKI — GEOMAGNETIC STORMS
    // ---------------------------------------------------------

    if (type === "storms") {
      const now = new Date();

      const past = new Date(now);
      past.setUTCDate(past.getUTCDate() - 7);

      const data = await nasa(
        `/DONKI/GST?startDate=${past.toISOString().slice(0, 10)}&endDate=${now.toISOString().slice(0, 10)}`
      );

      return response({
        success: true,
        source: "NASA DONKI",
        type: "storms",
        data,
        fetchedAt: new Date().toISOString(),
      });
    }

    // ---------------------------------------------------------
    // UNKNOWN TYPE
    // ---------------------------------------------------------

    return response(
      {
        success: false,
        error: "Unknown NASA data type",
        availableTypes: [
          "apod",
          "neo",
          "solar-flares",
          "cme",
          "storms",
        ],
      },
      400
    );
  } catch (error) {
    console.error("VYOM NASA DATA ERROR:", error);

    return response(
      {
        success: false,
        source: "NASA",
        error:
          error instanceof Error
            ? error.message
            : "NASA request failed",
      },
      500
    );
  }
});
