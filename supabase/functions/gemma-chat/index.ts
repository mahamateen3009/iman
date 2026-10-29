import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface HadithContext {
  collection: string;
  hadithNumber: number;
  text: string;
  sourceLabel: string;
  sourceUrl: string;
}

interface GemmaRequest {
  message: string;
  history: { role: "user" | "assistant"; content: string }[];
  emotions: string[];
  hadiths: HadithContext[];
  profile: {
    name: string;
    ageGroup: string | null;
    gender: string | null;
  };
}

function buildSystemPrompt(req: GemmaRequest): string {
  const hadithSection = req.hadiths.length > 0
    ? req.hadiths.map((h, i) =>
        `[Hadith ${i + 1}] Collection: ${h.collection}, Number: ${h.hadithNumber}\nText: ${h.text}\nSource: ${h.sourceLabel} (${h.sourceUrl})`
      ).join("\n\n")
    : "No specific hadiths were retrieved for this message.";

  const emotionSection = req.emotions.length > 0
    ? `Detected emotional state: ${req.emotions.join(", ")}`
    : "No specific emotion detected.";

  const ageGuidance = req.profile.ageGroup === "child"
    ? "The user is a child (under 13). Use very simple words, short sentences, and a warm, encouraging tone like a caring teacher."
    : req.profile.ageGroup === "teen"
    ? "The user is a teenager (13-17). Use relatable, supportive language without being patronizing."
    : "The user is an adult. Use a thoughtful, empathetic, and reflective tone.";

  return `You are "Iman," an Islamic AI wellbeing companion. Your role is to offer emotional support and spiritual guidance grounded strictly in authentic Islamic sources.

CRITICAL RULES:
1. You may ONLY reference the hadiths provided below. These come exclusively from Sunnah.com and Islam 360. NEVER fabricate, invent, or attribute any hadith, Quran verse, or Islamic ruling that was not provided to you.
2. If no hadiths were provided, focus on general emotional support and empathy without quoting religious texts.
3. NEVER issue fatwas (religious rulings). If the user asks for a ruling, gently advise consulting a qualified scholar.
4. Always be warm, empathetic, and non-judgmental.
5. Keep your reflection concise (2-4 sentences). It should acknowledge the user's feelings and connect them to the Islamic guidance naturally.
6. Provide 2-3 practical, actionable steps that are realistic and grounded in Islamic practice.

${ageGuidance}

${emotionSection}

RETRIEVED HADITHS (from Sunnah.com and Islam 360 only):
${hadithSection}

Respond in JSON format only:
{"reflection": "your empathetic reflection here", "steps": ["step 1", "step 2", "step 3"]}

The reflection should weave in the hadith naturally if one was provided. The steps should be practical and specific. Do NOT include any text outside the JSON.`;
}

interface GeminiContent {
  role: string;
  parts: { text: string }[];
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    const token = authHeader.replace(/^Bearer\s+/i, "");
    if (!token) {
      return new Response(JSON.stringify({ error: "Missing auth token." }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const googleApiKey = Deno.env.get("GOOGLE_AI_API_KEY") ?? "";

    if (!googleApiKey) {
      return new Response(JSON.stringify({ error: "AI service not configured.", fallback: true }), {
        status: 503,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify the caller's JWT
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });
    const { data: userData, error: userError } = await userClient.auth.getUser();
    if (userError || !userData?.user) {
      return new Response(JSON.stringify({ error: "Invalid or expired session." }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body: GemmaRequest = await req.json();
    if (!body.message || typeof body.message !== "string") {
      return new Response(JSON.stringify({ error: "Missing message." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const systemPrompt = buildSystemPrompt(body);

    // Build Gemini-format contents (system instruction goes separately)
    const contents: GeminiContent[] = [];

    // Add recent history (last 6 messages for context)
    const recentHistory = body.history.slice(-6);
    for (const msg of recentHistory) {
      contents.push({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      });
    }

    contents.push({ role: "user", parts: [{ text: body.message }] });

    const modelName = "gemma-4-26b-a4b-it";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${googleApiKey}`;

    const apiResponse = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: systemPrompt }],
        },
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
          topP: 0.9,
          responseMimeType: "application/json",
        },
      }),
    });

    if (!apiResponse.ok) {
      const errText = await apiResponse.text();
      console.error("Google AI error:", apiResponse.status, errText);
      return new Response(JSON.stringify({ error: "AI service error.", fallback: true }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiData = await apiResponse.json();
    const rawContent: string = apiData?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    // Parse the JSON response from Gemma 4
    let reflection = "";
    let steps: string[] = [];

    try {
      const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
      const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(rawContent);
      reflection = typeof parsed.reflection === "string" ? parsed.reflection : "";
      steps = Array.isArray(parsed.steps) ? parsed.steps.filter((s: unknown) => typeof s === "string") : [];
    } catch {
      reflection = rawContent.trim();
      steps = [];
    }

    if (!reflection || reflection.length < 10) {
      return new Response(JSON.stringify({ error: "Empty AI response.", fallback: true }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ reflection, steps }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected error.";
    console.error("gemma-chat error:", message);
    return new Response(JSON.stringify({ error: message, fallback: true }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
