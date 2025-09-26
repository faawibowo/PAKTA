import os
import faiss
from langchain.text_splitter import CharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain.vectorstores import FAISS

def build_index():
    # Baca policy.txt
    with open("data/policy.txt", "r", encoding="utf-8") as f:
        text = f.read()

    # Split jadi chunk
    splitter = CharacterTextSplitter(
        separator="\n\n",
        chunk_size=500,
        chunk_overlap=50
    )
    docs = splitter.create_documents([text])

    # Embeddings pakai Gemini
    embeddings = GoogleGenerativeAIEmbeddings(
        model="models/embedding-001",
        google_api_key=os.environ["GEMINI_API_KEY"]
    )

    # Buat FAISS index
    vectorstore = FAISS.from_documents(docs, embeddings)

    # Simpan ke disk
    vectorstore.save_local("faiss_index")
    print("✅ FAISS index saved to ./faiss_index")

if __name__ == "__main__":
    build_index()
