"use client";

import { useState } from "react";

export default function AnalyzePage() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal menganalisis teks");
      }

      setResult(data.analysis);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">
        Analisis Kesesuaian Teks dengan Policy
      </h1>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Masukkan teks yang ingin dianalisis..."
        className="w-full p-3 border rounded-lg mb-4"
        rows={6}
      />

      <button
        onClick={handleAnalyze}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
      >
        {loading ? "Menganalisis..." : "Analisis"}
      </button>

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-6 p-4 border rounded-lg bg-gray-50 whitespace-pre-line">
          <h2 className="text-lg font-semibold mb-2">Hasil Analisis:</h2>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
}
