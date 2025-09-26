import "dotenv/config";
import fs from "fs";
import path from "path";
import { GoogleGenerativeAI } from "@google/generative-ai";

async function build() {
  const filePath = path.join(process.cwd(), "data", "policy.txt");

  if (!fs.existsSync(filePath)) {
    throw new Error(`File tidak ditemukan: ${filePath}`);
  }

  const fileContent = fs.readFileSync(filePath, "utf-8");

  // init Gemini client
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-embedding-001" });

  // generate embedding
  const result = await model.embedContent(fileContent);
  const embedding: number[] = result.embedding.values;

  console.log("📐 Embedding length:", embedding.length);

  // simpan embedding ke JSON (persistent)
  const outputDir = path.join(process.cwd(), "data", "faiss_index");
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const outputFile = path.join(outputDir, "embedding.json");
  fs.writeFileSync(
    outputFile,
    JSON.stringify({ content: fileContent, vector: embedding }),
  );

  console.log("✅ Embedding saved to:", outputFile);
}

build().catch(console.error);
