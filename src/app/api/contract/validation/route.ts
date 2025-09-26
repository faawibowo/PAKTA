// src/app/api/contract/analyze/route.ts
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";

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

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
Analyze the following contract text and extract:

1. Mandatory Elements (mark Present or Missing)
2. Identified Risks (High, Medium, Low with description and section)
3. Recommendations to improve the contract

Contract Text:
${message}
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            mandatoryElements: {
              type: Type.OBJECT,
              properties: {
                companyName: { type: Type.STRING },
                contractType: { type: Type.STRING },
                contractValue: { type: Type.STRING },
                terminationClause: { type: Type.STRING },
              },
              propertyOrdering: [
                "companyName",
                "contractType",
                "contractValue",
                "terminationClause",
              ],
            },
            identifiedRisks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  severity: { type: Type.STRING },
                  description: { type: Type.STRING },
                  section: { type: Type.STRING },
                },
                propertyOrdering: ["severity", "description", "section"],
              },
            },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          propertyOrdering: [
            "mandatoryElements",
            "identifiedRisks",
            "recommendations",
          ],
        },
      },
    });

    // Ambil text dari response
    let jsonOutput = response.text;

    // Parse JSON
    let parsed;
    if (jsonOutput) {
      try {
        parsed = JSON.parse(jsonOutput);
      } catch (err) {
        return NextResponse.json(
          { error: "Failed to parse JSON from Gemini output", raw: jsonOutput },
          { status: 500 },
        );
      }
    }

    return NextResponse.json(parsed);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
