import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

const AR00_BASE = "https://api.ar00.space";

function response(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

async function ar00(path: string) {
  const key = Deno.env.get("AR00_API_KEY");

  if (!key) {
    throw new Error("AR00_API_KEY is not configured");
  }

  const res = await fetch(`${AR00_BASE}${path}`, {
    headers: {
      "Ocp-Apim-Subscription-Key": key,
      "Accept": "application/json",
    },
  });

  if (!res.ok) {
    const errorText = await res.text();

    throw new Error(
      `AR00 API returned ${res.status}: ${errorText.slice(0, 500)}`
    );
  }

  return await res.json();
}

function getNumber(
  body: Record<string, unknown>,
  url: URL,
  name: string,
  fallback: number,
) {
  const bodyValue = Number(body[name]);
  if (Number.isFinite(bodyValue)) return bodyValue;

  const queryValue = Number(url.searchParams.get(name));
  if (Number.isFinite(queryValue)) return queryValue;

  return fallback;
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
        // Empty or invalid JSON body.
      }
    }

    const now = new Date();

    const year = getNumber(
      body,
      url,
      "year",
      now.getUTCFullYear(),
    );

    const month = getNumber(
      body,
      url,
      "month",
      now.getUTCMonth() + 1,
    );

    const day = getNumber(
      body,
      url,
      "day",
      now.getUTCDate(),
    );

    const hour = getNumber(
      body,
      url,
      "hour",
      now.getUTCHours() +
        now.getUTCMinutes() / 60 +
        now.getUTCSeconds() / 3600,
    );

    const lat = getNumber(body, url, "lat", 26.2389);
    const lon = getNumber(body, url, "lon", 73.0243);
    const elevation = getNumber(body, url, "elevation", 0);

    const type =
      (typeof body.type === "string" ? body.type : null) ||
      url.searchParams.get("type") ||
      "overview";

    if (type === "lunar-phase") {
      const data = await ar00(
        `/ar00/api/lunar/phase?year=${year}&month=${month}&day=${day}`
      );

      return response({
        success: true,
        source: "AR00.space",
        type,
        data,
        fetchedAt: new Date().toISOString(),
      });
    }

    if (type === "lunar-position") {
      const data = await ar00(
        `/ar00/api/lunar/position?year=${year}&month=${month}&day=${day}&hour=${hour}`
      );

      return response({
        success: true,
        source: "AR00.space",
        type,
        data,
        fetchedAt: new Date().toISOString(),
      });
    }

    if (type === "solar-position") {
      const data = await ar00(
        `/ar00/api/solar/position?year=${year}&month=${month}&day=${day}&hour=${hour}`
      );

      return response({
        success: true,
        source: "AR00.space",
        type,
        data,
        fetchedAt: new Date().toISOString(),
      });
    }

    if (type === "sunrise-sunset") {
      const data = await ar00(
        `/ar00/api/solar/sunrise-sunset?year=${year}&month=${month}&day=${day}&lat=${lat}&lon=${lon}&elevation=${elevation}`
      );

      return response({
        success: true,
        source: "AR00.space",
        type,
        data,
        fetchedAt: new Date().toISOString(),
      });
    }

    if (type === "planets") {
      const data = await ar00(
        `/ar00/api/planets/all?year=${year}&month=${month}&day=${day}&hour=${hour}`
      );

      return response({
        success: true,
        source: "AR00.space",
        type,
        data,
        fetchedAt: new Date().toISOString(),
      });
    }

    if (type === "constellations") {
      const data = await ar00(
        `/ar00/api/deepsky/constellations`
      );

      return response({
        success: true,
        source: "AR00.space",
        type,
        data,
        fetchedAt: new Date().toISOString(),
      });
    }

    if (type === "meteor-showers") {
      const data = await ar00(
        `/ar00/api/phenomena/meteor-showers/active?year=${year}&month=${month}&day=${day}`
      );

      return response({
        success: true,
        source: "AR00.space",
        type,
        data,
        fetchedAt: new Date().toISOString(),
      });
    }

    if (type === "tonight") {
      const data = await ar00(
        `/ar00/api/planner/tonight?year=${year}&month=${month}&day=${day}&lat=${lat}&lon=${lon}&elevation=${elevation}`
      );

      return response({
        success: true,
        source: "AR00.space",
        type,
        data,
        fetchedAt: new Date().toISOString(),
      });
    }

    return response(
      {
        success: false,
        error: "Unknown AR00 data type",
        availableTypes: [
          "lunar-phase",
          "lunar-position",
          "solar-position",
          "sunrise-sunset",
          "planets",
          "constellations",
          "meteor-showers",
          "tonight",
        ],
      },
      400,
    );
  } catch (error) {
    console.error("VYOM AR00 ERROR:", error);

    return response(
      {
        success: false,
        source: "AR00.space",
        error:
          error instanceof Error
            ? error.message
            : "AR00 request failed",
      },
      500,
    );
  }
});
