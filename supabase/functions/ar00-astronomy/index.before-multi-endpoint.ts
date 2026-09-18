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

    const type =
      (typeof body.type === "string" ? body.type : null) ||
      url.searchParams.get("type") ||
      "lunar-phase";

    if (type === "lunar-phase") {
      const year =
        Number(body.year || url.searchParams.get("year")) ||
        new Date().getUTCFullYear();

      const month =
        Number(body.month || url.searchParams.get("month")) ||
        new Date().getUTCMonth() + 1;

      const day =
        Number(body.day || url.searchParams.get("day")) ||
        new Date().getUTCDate();

      const data = await ar00(
        `/ar00/api/lunar/phase?year=${year}&month=${month}&day=${day}`
      );

      return response({
        success: true,
        source: "AR00.space",
        type: "lunar-phase",
        data,
        fetchedAt: new Date().toISOString(),
      });
    }

    return response(
      {
        success: false,
        error: "Unknown AR00 data type",
        availableTypes: ["lunar-phase"],
      },
      400
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
      500
    );
  }
});
