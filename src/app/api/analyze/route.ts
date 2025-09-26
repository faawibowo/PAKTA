import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { text } = body;
    if (!text)
      return new Response(JSON.stringify({ error: "Teks kosong" }), {
        status: 400,
      });

    // embeddings Gemini
    const embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GEMINI_API_KEY!,
      model: "gemini-embedding-001",
    });

    // load index FAISS yang sudah ada
    const vectorStore = await FaissStore.load(
      "data/faiss_index", // path folder hasil build-index
      embeddings,
    );

    // cari top-3 dokumen paling relevan
    const results = await vectorStore.similaritySearch(text, 3);

    return new Response(
      JSON.stringify({
        analysis: results.map((r) => r.pageContent),
      }),
      { status: 200 },
    );
  } catch (err: any) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
