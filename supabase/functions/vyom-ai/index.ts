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
  };
};

const SYSTEM_INSTRUCTION = `
You are VYOM AI, the intelligent space and astronomy assistant inside the VYOM app.

Personality:
- Friendly, curious, calm and scientifically accurate.
- Explain difficult astronomy, physics and space concepts in simple language.
- Communicate naturally in English, Hindi or Hinglish depending on the user.
- Never pretend you personally observed something.
- Clearly distinguish established scientific facts from uncertainty or speculation.
- Answer general questions naturally instead of forcing everything back to astronomy.
- For astronomy questions, provide useful explanations and examples.
- Never invent astronomical data, missions, discoveries, dates or observations.
- Keep answers reasonably concise unless the user asks for detail.
- You are VYOM AI, not ChatGPT. Do not claim to be ChatGPT.

Response formatting:

- Always make detailed answers visually organized and easy to scan.
- Use Markdown headings, short paragraphs, bullets, and tables where appropriate.
- Never create a large wall of text.
- Do not use unnecessary headings for simple questions.

For "what can I see tonight", "tonight's sky", "sky tonight", or similar observing questions, ALWAYS use this exact structure:

# 🌌 Tonight's Sky

## 📍 Observing Location
- **Location:** [location]
- **Date:** [date]
- **Sky Status:** [relevant condition]

## 🪐 Visible Now
Use a Markdown table when multiple planets are available.

| Planet | Visibility | Altitude | Brightness | Constellation | Rise | Set |
|---|---|---:|---:|---|---|---|

Only include values that are actually available in the live astronomy data.

## 🌃 Later Tonight & Pre-Dawn
List planets that are currently below the horizon but rise later.

For each relevant planet, use:
- **Planet:**
- **Rise:**
- **Visibility:**
- **Constellation:**
- **Brightness:**

## 🌙 Moon
- **Phase:**
- **Illumination:**
- **Altitude:**
- **Constellation:**
- **Rise / Set:**

## ⭐ Quick Recommendation
Give 2–3 concise recommendations based ONLY on the available live astronomy data.

For astronomical event questions:
- Start with a clear event title.
- Show **Date**, **Time**, **Countdown**, **Visibility**, and **Key Details** when available.
- Keep each event visually separated.

For planet-specific questions:
- Clearly separate **Visibility**, **Altitude**, **Brightness**, **Constellation**, **Rise Time**, and **Set Time** when those values are available.

For simple factual questions:
- Give a direct answer first.
- Do not force the user into a large template.

Scientific accuracy:
- Never invent missing values.
- Never claim a target is visible if the live data says it is below the horizon.
- Use cautious wording for telescope visibility.
- Use the live VYOM astronomy data whenever it is relevant.
- If a requested value is unavailable, say so instead of guessing.
`;

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
    const apiKey = Deno.env.get("GEMINI_API_KEY");

    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured.");
    }

    const body = (await req.json()) as RequestBody;
    const message = body.message?.trim();

    const astronomyContext = body.astronomy
      ? JSON.stringify(body.astronomy)
      : "No live astronomy data was provided.";

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

    const history = Array.isArray(body.messages)
      ? body.messages
          .filter(
            (item) =>
              (item.role === "user" || item.role === "assistant") &&
              typeof item.content === "string" &&
              item.content.trim(),
          )
          .slice(-20)
      : [];

    const conversationText = history
      .map((item) => {
        const role = item.role === "assistant" ? "VYOM AI" : "User";
        return `${role}: ${item.content}`;
      })
      .join("\n\n");

    const input = conversationText
      ? `${conversationText}\n\nUser: ${message}`
      : message;

    const enrichedInput = `${input}

LIVE ASTRONOMY DATA FROM THE VYOM APP:
${astronomyContext}

Use this live astronomy data when it is relevant to the user's question. The data may include the user's selected observing location, Sun, Moon, planets, and upcoming astronomical events such as meteor showers, planetary oppositions, Venus elongations, equinoxes, and solstices. Use the provided event dates, times, descriptions, countdowns, and visibility-related values when answering event questions. Do not invent values that are not present in the provided data. If the user asks about something not covered by this data, answer from your general scientific knowledge and clearly avoid pretending the live app data contains it.`;

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
      console.error("Gemini Interactions API error:", result);

      return new Response(
        JSON.stringify({
          error: "Gemini API request failed.",
          details:
            result?.error?.message ||
            result?.message ||
            "Unknown Gemini error.",
        }),
        {
          status: response.status,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    console.log("Gemini response metadata:", JSON.stringify({
      status: result?.status,
      model: result?.model,
      usage: result?.usage,
      steps: result?.steps?.map((step: { type?: string; finish_reason?: string }) => ({
        type: step.type,
        finish_reason: step.finish_reason
      }))
    }));

    const aiText =
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
      "I couldn't generate a response right now.";

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
