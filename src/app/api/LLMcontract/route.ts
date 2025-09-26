// src/app/api/contract/route.ts
import { NextRequest, NextResponse } from "next/server";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message } = body;

    if (!message) {
      return NextResponse.json(
        { error: "message is required" },
        { status: 400 },
      );
    }

    const llm = new ChatGoogleGenerativeAI({
      model: "gemini-2.5-pro",
      apiKey: process.env.GEMINI_API_KEY,
    });

    const prompt = `
You are a contract generator.
Take the following text and produce a legally formatted contract.
Return EXACTLY in JSON format with keys:
{
  "title": "string",
  "parties": ["string"],
  "content": "string",
  "effective_date": "YYYY-MM-DD"
}
Do NOT add any extra text outside JSON.

Text:
${message}
`;

    const response = await llm.invoke([
      { role: "system", content: "You are a strict JSON contract generator." },
      { role: "user", content: prompt },
    ]);

    // Ambil konten sebagai string
    let textOutput: string;
    if (typeof response.content === "string") {
      textOutput = response.content;
    } else if (Array.isArray(response.content)) {
      textOutput = response.content.map((m: any) => m.text || "").join("\n");
    } else {
      textOutput = "";
    }

    // Parse JSON
    let parsed;
    try {
      parsed = JSON.parse(textOutput);
    } catch (err) {
      return NextResponse.json(
        { error: "Failed to parse JSON from Gemini output", raw: textOutput },
        { status: 500 },
      );
    }

    return NextResponse.json(parsed);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
