// src/app/api/rag/route.ts
import { NextRequest, NextResponse } from "next/server";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import {
  ChatGoogleGenerativeAI,
  GoogleGenerativeAIEmbeddings,
} from "@langchain/google-genai";
import { Document } from "langchain/document";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { question } = body;

  if (!question)
    return NextResponse.json(
      { error: "Question is required" },
      { status: 400 },
    );

  const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GEMINI_API_KEY,
  });
  const store = new MemoryVectorStore(embeddings);

  // --- Baca semua file dari folder 'policies' ---
  const policiesDir = path.join(process.cwd(), "policies");
  const files = fs.readdirSync(policiesDir);

  const docs: Document[] = files.map((file) => {
    const content = fs.readFileSync(path.join(policiesDir, file), "utf-8");
    return new Document({ pageContent: content, metadata: { fileName: file } });
  });

  // Tambahkan dokumen ke vector store
  await store.addDocuments(docs);

  // Cari dokumen yang relevan
  const relevantDocs = await store.similaritySearch(question, 3);
  const context = relevantDocs.map((d) => d.pageContent).join("\n");

  // Inisialisasi Gemini model
  const llm = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-pro",
    apiKey: process.env.GEMINI_API_KEY,
  });

  // Kirim pesan ke LLM
  const response = await llm.invoke([
    { role: "system", content: "You are a helpful assistant." },
    {
      role: "user",
      content: `Based on the following info:\n${context}\nAnswer the question: ${question}`,
    },
  ]);

  return NextResponse.json({ answer: response.content });
}
