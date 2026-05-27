import { NextResponse } from "next/server";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const DEFAULT_MODEL = "llama-3.1-8b-instant";

type GroqLookup = {
  drinkName?: string;
  caffeineMg?: number;
  servingSize?: string;
  confidence?: "low" | "medium" | "high";
  notes?: string;
};

function parseLookup(content: string): GroqLookup | null {
  try {
    return JSON.parse(content) as GroqLookup;
  } catch {
    const match = content.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]) as GroqLookup;
    } catch {
      return null;
    }
  }
}

export async function POST(request: Request) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "GROQ_API_KEY is not configured." }, { status: 500 });
  }

  const body = (await request.json().catch(() => null)) as { drink?: unknown } | null;
  const drink = typeof body?.drink === "string" ? body.drink.trim() : "";
  if (drink.length < 2) {
    return NextResponse.json({ error: "Enter a drink name to look up." }, { status: 400 });
  }
  if (drink.length > 120) {
    return NextResponse.json({ error: "Drink name is too long." }, { status: 400 });
  }

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.GROQ_MODEL ?? DEFAULT_MODEL,
      temperature: 0.1,
      max_tokens: 300,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You estimate caffeine content for drinks. Return only JSON with keys drinkName, caffeineMg, servingSize, confidence, notes. caffeineMg must be a single rounded integer estimate for one typical serving. servingSize must include both fl oz and ml when possible, for example '12 fl oz (355 ml)'. confidence must be low, medium, or high. Keep notes under 160 characters. If uncertain, make a conservative estimate and say why in notes.",
        },
        {
          role: "user",
          content: `Estimate caffeine for this drink: ${drink}`,
        },
      ],
    }),
  });

  if (!response.ok) {
    return NextResponse.json({ error: "The AI lookup is unavailable right now." }, { status: response.status });
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  const lookup = typeof content === "string" ? parseLookup(content) : null;
  const caffeineMg = Number(lookup?.caffeineMg);

  if (!lookup || !Number.isFinite(caffeineMg)) {
    return NextResponse.json({ error: "The AI response could not be read." }, { status: 502 });
  }

  return NextResponse.json({
    drinkName: lookup.drinkName || drink,
    caffeineMg: Math.max(0, Math.round(caffeineMg)),
    servingSize: lookup.servingSize || "typical serving",
    confidence: lookup.confidence || "medium",
    notes: lookup.notes || "AI estimate. Check product labels where available.",
  });
}
