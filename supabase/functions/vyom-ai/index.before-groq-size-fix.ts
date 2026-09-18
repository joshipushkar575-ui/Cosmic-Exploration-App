import "@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type RequestBody = {
  message?: string;
  messages?: ChatMessage[];
  astronomy?: {
    location?: unknown;
    lastUpdated?: unknown;
    sun?: unknown;
    moon?: unknown;
    planets?: unknown;
    events?: unknown;
    ar00?: {
      lunarPhase?: unknown;
    };
    nasa?: {
      apod?: unknown;
      nearEarthObjects?: unknown;
      spaceWeather?: {
        solarFlares?: unknown;
        cmes?: unknown;
        geomagneticStorms?: unknown;
      };
    };
  };
};

const GROQ_SYSTEM_INSTRUCTION = `
You are VYOM AI, a scientific astronomy assistant.

Rules:
- Be accurate, concise and helpful.
- Use supplied live astronomy data when relevant.
- Never invent unavailable astronomical values.
- If data is unavailable, clearly say it is unavailable.
- For general science questions, answer from established scientific knowledge.
- Explain astronomy in simple language when useful.
- Do not claim calculations or observations that were not provided.
`;

const SYSTEM_INSTRUCTION = `Scientific reliability rules:

- Treat LIVE ASTRONOMY DATA FROM THE VYOM APP as the authoritative source for current observing conditions.
- Never invent or assume a rise time, set time, altitude, magnitude, constellation, distance, phase, opposition date, or visibility status.
- If a value is not present in the live data, explicitly say that the value is unavailable rather than guessing.
- Do not convert "near opposition" into "exactly at opposition."
- Do not claim Earth, Sun, or a planet is "exactly between" two objects unless the provided data explicitly establishes that geometry.
- Do not claim an astronomical object is "fully illuminated" unless the provided data explicitly supports that statement.
- Do not claim an object is "the best" or "absolute best" observing target unless the live data provides a clear basis.
- When explaining visibility, distinguish position relative to Sun, position above horizon, brightness, angular size, and local observing conditions.
- Do not treat brightness alone as proof that an object is easy to observe.
- For telescope observations, use cautious language and never guarantee visibility through every telescope.
- Use supplied VYOM event information whenever available.
- If live data conflicts with a generated assumption, always follow live data.
- Preserve scientific meaning when explaining astronomy in Hinglish.
- Never invent astronomical data, missions, discoveries, dates or observations.
- Never pretend you personally observed something.
- Clearly distinguish established scientific facts from uncertainty or speculation.
- Answer general questions naturally instead of forcing everything back to astronomy.
- You are VYOM AI, not ChatGPT.

Personality:
- Friendly, curious, calm and scientifically accurate.
- Explain difficult astronomy, physics and space concepts simply.
- Communicate naturally in English, Hindi or Hinglish depending on the user.
- Keep answers reasonably concise unless the user asks for detail.

Response formatting:
- Use Markdown headings, short paragraphs, bullets and tables where appropriate.
- Never create a large wall of text.

For "what can I see tonight", "tonight's sky", "sky tonight", or similar observing questions, use:

# 🌌 Tonight's Sky

## 📍 Observing Location
- **Location:** [location]
- **Date:** [date]
- **Sky Status:** [relevant condition]

## 🪐 Visible Now

Use a Markdown table when multiple planets are available.

| Planet | Visibility | Altitude | Brightness | Constellation | Rise | Set |
|---|---|---:|---:|---|---|---|

Only include values actually available in live astronomy data.

## 🌃 Later Tonight & Pre-Dawn

List planets currently below the horizon that rise later, when that information is available.

## 🌙 Moon

- **Phase:**
- **Illumination:**
- **Altitude:**
- **Constellation:**
- **Rise / Set:**

## ⭐ Quick Recommendation

Give 2–3 concise recommendations based ONLY on available live astronomy data.

For astronomical event questions:
- Start with a clear event title.
- Show Date, Time, Countdown, Visibility and Key Details when available.

For planet-specific questions:
- Clearly separate Visibility, Altitude, Brightness, Constellation, Rise Time and Set Time when available.

For simple factual questions:
- Give a direct answer first.
- Do not force the user into a large template.`;

function buildEnrichedInput(
  message: string,
  history: ChatMessage[],
  astronomyContext: string,
) {
  const conversationText = history
    .map((item) => {
      const role = item.role === "assistant" ? "VYOM AI" : "User";
      return `${role}: ${item.content}`;
    })
    .join("\n\n");

  const input = conversationText
    ? `${conversationText}\n\nUser: ${message}`
    : message;

  return `${input}

LIVE ASTRONOMY DATA FROM THE VYOM APP:

${astronomyContext}

Use this live astronomy data whenever relevant.

For AR00.space data, use supplied lunar phase calculations when relevant.
Treat supplied AR00 values as astronomy-specialized calculation data.
Do not invent AR00 values that are not supplied.

The data may include:
- selected observing location
- Sun and Moon data
- planet positions and observing information
- upcoming astronomical events
- AR00.space astronomy calculations
- NASA APOD
- NASA Near-Earth Object data
- NASA DONKI solar flares
- NASA DONKI CMEs
- NASA DONKI geomagnetic storms

For NASA data, treat the supplied VYOM app data as the current NASA context available to you.

When the user asks about an asteroid, use supplied NEO data when available.
When the user asks about solar activity, use supplied DONKI data when available.
When the user asks about today's NASA picture, use supplied APOD data when available.

Do not invent values that are not present in the provided data.

If a requested value is unavailable in the supplied NASA or astronomy data, explicitly say that it is unavailable rather than guessing.

If the user asks about something not covered by this data, answer from general scientific knowledge without pretending the live app data contains it.`;
}

function extractGroqText(result: any): string {
  return (
    result?.choices?.[0]?.message?.content?.trim() ||
    result?.choices?.[0]?.text?.trim() ||
    ""
  );
}

function extractGeminiText(result: any): string {
  return (
    result?.steps
      ?.filter((step: { type?: string }) => step.type === "model_output")
      ?.flatMap(
        (step: {
          content?: Array<{ type?: string; text?: string }>;
        }) => step.content || [],
      )
      ?.filter((part: { type?: string }) => part.type === "text")
      ?.map((part: { text?: string }) => part.text || "")
      ?.join("")
      ?.trim() ||
    result?.output_text?.trim() ||
    ""
  );
}

async function callGroq(
  apiKey: string,
  enrichedInput: string,
): Promise<{ ok: boolean; text?: string; status?: number; error?: string }> {
  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        messages: [
          {
            role: "system",
            content: GROQ_SYSTEM_INSTRUCTION,
          },
          {
            role: "user",
            content: enrichedInput,
          },
        ],
        max_tokens: 1200,
        temperature: 0.7,
      }),
    },
  );

  const result = await response.json();

  if (!response.ok) {
    console.error("Groq API error:", result);

    return {
      ok: false,
      status: response.status,
      error:
        result?.error?.message ||
        "Groq API request failed.",
    };
  }

  const text = extractGroqText(result);

  if (!text) {
    return {
      ok: false,
      status: 502,
      error: "Groq returned an empty response.",
    };
  }

  return {
    ok: true,
    text,
    status: response.status,
  };
}

async function callGemini(
  apiKey: string,
  enrichedInput: string,
): Promise<{ ok: boolean; text?: string; status?: number; error?: string }> {
  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/interactions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        model: "gemini-3.6-flash",
        input: enrichedInput,
        system_instruction: SYSTEM_INSTRUCTION,
        generation_config: {
          max_output_tokens: 2500,
          temperature: 0.7,
        },
      }),
    },
  );

  const result = await response.json();

  if (!response.ok) {
    console.error("Gemini API error:", result);

    return {
      ok: false,
      status: response.status,
      error:
        result?.error?.message ||
        result?.message ||
        "Gemini API request failed.",
    };
  }

  const text = extractGeminiText(result);

  if (!text) {
    return {
      ok: false,
      status: 502,
      error: "Gemini returned an empty response.",
    };
  }

  return {
    ok: true,
    text,
    status: response.status,
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({
        error: "Only POST requests are allowed.",
      }),
      {
        status: 405,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      },
    );
  }

  try {
    const body = (await req.json()) as RequestBody;
    const message = body.message?.trim();

    const groqKey = Deno.env.get("GROQ_API_KEY")?.trim();
    const geminiKey = Deno.env.get("GEMINI_API_KEY")?.trim();

    let aiText = "";
    let provider = "";

    if (!groqKey && !geminiKey) {
      console.error("AI provider keys are not configured.");
    }

    if (!message) {
      return new Response(
        JSON.stringify({
          error: "Please provide a message.",
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    const astronomyContext = body.astronomy
      ? JSON.stringify(body.astronomy)
      : "No live astronomy data was provided.";

    // Keep the LLM payload intentionally small.
    // Live/direct astronomy routes already handle detailed data separately.
    const astronomy = body.astronomy;

    const compactAstronomy = {
      location: astronomy?.location
        ? {
            latitude: astronomy.location.latitude,
            longitude: astronomy.location.longitude,
          }
        : null,

      sun: astronomy?.sun
        ? {
            altitude: astronomy.sun.altitude,
            azimuth: astronomy.sun.azimuth,
            visibility: astronomy.sun.visibility,
          }
        : null,

      moon: astronomy?.moon
        ? {
            phase: astronomy.moon.phase,
            illumination: astronomy.moon.illumination,
            altitude: astronomy.moon.altitude,
            azimuth: astronomy.moon.azimuth,
          }
        : null,

      planets: Array.isArray(astronomy?.planets)
        ? astronomy.planets.map((p: any) => ({
            name: p.name,
            altitude: p.altitude,
            azimuth: p.azimuth,
            visibility: p.visibility,
            distanceFromEarth: p.distanceFromEarth,
            magnitude: p.magnitude,
            constellation: p.constellation,
          }))
        : [],

      ar00: astronomy?.ar00?.lunarPhase
        ? {
            phaseName: astronomy.ar00.lunarPhase.phaseName,
            illuminatedFraction:
              astronomy.ar00.lunarPhase.illuminatedFraction,
            phaseAngle: astronomy.ar00.lunarPhase.phaseAngle,
            ageDays: astronomy.ar00.lunarPhase.ageDays,
          }
        : null,

      nasa: astronomy?.nasa
        ? {
            apodTitle: astronomy.nasa.apod?.title ?? null,
            spaceWeather: astronomy.nasa.spaceWeather ?? null,
          }
        : null,
    };

    const enrichedInput = `
USER:
${message}

LIVE DATA:
${JSON.stringify(compactAstronomy)}

Use live data when relevant. Do not invent unavailable values.
For general scientific questions, answer from established scientific knowledge.
If live data is unavailable, say so clearly.
`;

    // Primary: Groq


    if (groqKey) {
      const groqResult = await callGroq(groqKey, enrichedInput);

      if (groqResult.ok && groqResult.text) {
        aiText = groqResult.text;
        provider = "groq";
      } else {
        console.error(
          "GROQ_FAILURE:",
          JSON.stringify({
            status: groqResult.status ?? "unknown",
            error: groqResult.error ?? "unknown",
          }),
        );
      }
    }

    // Fallback: Gemini
    // Do not retry Gemini 429s because quota exhaustion will not
    // be fixed by immediate retries.
    if (!aiText && geminiKey) {
      const geminiResult = await callGemini(geminiKey, enrichedInput);

      if (geminiResult.ok && geminiResult.text) {
        aiText = geminiResult.text;
        provider = "gemini";
      } else {
        console.warn(
          `Gemini failed (${geminiResult.status ?? "unknown"}):`,
          geminiResult.error,
        );
      }
    }

    if (!aiText) {
      return new Response(
        JSON.stringify({
          error: "AI providers are temporarily unavailable.",
          message:
            "🌌 VYOM AI is temporarily unavailable. Please try again shortly.",
        }),
        {
          status: 503,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    console.log(
      JSON.stringify({
        provider,
        messageLength: message.length,
      }),
    );

    return new Response(
      JSON.stringify({
        success: true,
        message: aiText,
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    console.error("VYOM AI error:", error);

    return new Response(
      JSON.stringify({
        error:
          error instanceof Error
            ? error.message
            : "Unexpected server error.",
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
