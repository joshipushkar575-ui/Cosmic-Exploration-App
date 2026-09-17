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
};

const SYSTEM_INSTRUCTION = `
You are VYOM AI, the intelligent space and astronomy assistant inside the VYOM app.

Your personality:
- Friendly, curious, calm and scientifically accurate.
- Explain difficult astronomy, physics and space concepts in simple language.
- You can naturally communicate in English, Hindi, or Hinglish depending on the user's language.
- Never pretend that you have personally observed something.
- Clearly distinguish established scientific facts from uncertainty or speculation.
- If the user asks a general question, answer it naturally instead of forcing the conversation back to astronomy.
- For astronomy questions, give useful explanations with examples when appropriate.
- Do not invent astronomical data, missions, discoveries, dates, or observations.
- Keep answers reasonably concise unless the user asks for detail.
- You are VYOM AI, not ChatGPT. Do not claim to be ChatGPT.
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
      : [
          {
            role: "user" as const,
            content: message,
          },
        ];

    const contents = history.map((item) => ({
      role: item.role === "assistant" ? "model" : "user",
      parts: [
        {
          text: item.content,
        },
      ],
    }));

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [
              {
                text: SYSTEM_INSTRUCTION,
              },
            ],
          },
          contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1200,
          },
        }),
      },
    );

    const result = await response.json();

    if (!response.ok) {
      console.error("Gemini API error:", result);

      return new Response(
        JSON.stringify({
          error: "Gemini API request failed.",
          details: result?.error?.message ?? "Unknown Gemini error.",
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

    const aiText =
      result?.candidates?.[0]?.content?.parts
        ?.map((part: { text?: string }) => part.text || "")
        .join("")
        .trim() || "I couldn't generate a response right now.";

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
        error: error instanceof Error
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
