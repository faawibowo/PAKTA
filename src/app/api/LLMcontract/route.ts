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

    const systemPrompt = `
You are an expert contract drafting assistant. You help generate professional, comprehensive, and legally sound contracts.

Your task is to enhance and expand contract templates based on the provided information. 

Guidelines:
1. Always maintain professional legal language
2. Include all provided details accurately
3. Add relevant legal clauses based on the contract type
4. Ensure proper contract structure and formatting
5. Add warnings or notes for important legal considerations
6. Use HTML formatting with proper paragraph tags
7. Be comprehensive but clear and readable
8. Include standard legal protections and clauses

Return ONLY the HTML contract content without any additional explanation or text outside the contract.
`;

    const response = await llm.invoke([
      { role: "system", content: systemPrompt },
      { role: "user", content: message },
    ]);

    // Extract content as string
    let textOutput: string;
    if (typeof response.content === "string") {
      textOutput = response.content;
    } else if (Array.isArray(response.content)) {
      textOutput = response.content.map((m: any) => m.text || "").join("\n");
    } else {
      textOutput = "";
    }

    // Clean up the response - remove any markdown formatting if present
    textOutput = textOutput
      .replace(/```html\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    // Check if the response looks like HTML, if not, wrap it in paragraphs
    if (!textOutput.includes('<p>') && !textOutput.includes('<div>')) {
      textOutput = textOutput.split('\n').map(line => 
        line.trim() ? `<p>${line.trim()}</p>` : ''
      ).join('\n');
    }

    return NextResponse.json({ 
      content: textOutput,
      success: true 
    });

  } catch (err: any) {
    console.error('Contract generation error:', err);
    return NextResponse.json({ 
      error: err.message || 'Failed to generate contract',
      success: false 
    }, { status: 500 });
  }
}
