import fs from "fs";
import path from "path";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { Document } from "langchain/document";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

export async function buildVectorStore() {
  const filePath = path.resolve("data/policy.txt");
  const text = fs.readFileSync(filePath, "utf-8");

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 50,
  });
  const docs = await splitter.splitDocuments([
    new Document({ pageContent: text }),
  ]);

  const embeddings = new GoogleGenerativeAIEmbeddings();
  const store = await FaissStore.fromDocuments(docs, embeddings);
  await store.save("faiss_index");

  return store;
}
