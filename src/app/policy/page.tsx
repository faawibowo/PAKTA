"use client";

import { useState } from "react";

export default function PolicyPage() {
  // Upload Policy
  const [name, setName] = useState("");
  const [policyText, setPolicyText] = useState("");
  const [uploading, setUploading] = useState(false);
  const [policyResult, setPolicyResult] = useState<any>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Check Text
  const [inputText, setInputText] = useState("");
  const [checking, setChecking] = useState(false);
  const [checkResult, setCheckResult] = useState<any>(null);
  const [checkError, setCheckError] = useState<string | null>(null);

  // Upload handler
  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    setUploading(true);
    setUploadError(null);
    setPolicyResult(null);

    try {
      const res = await fetch("/api/policy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, text: policyText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setPolicyResult(data);
    } catch (err: any) {
      setUploadError(err.message);
    } finally {
      setUploading(false);
    }
  }

  // Check handler
  async function handleCheck(e: React.FormEvent) {
    e.preventDefault();
    setChecking(true);
    setCheckError(null);
    setCheckResult(null);

    try {
      const res = await fetch("/api/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Check failed");
      setCheckResult(data);
    } catch (err: any) {
      setCheckError(err.message);
    } finally {
      setChecking(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-10">
      {/* Upload Policy Section */}
      <section>
        <h1 className="text-2xl font-bold mb-4">Upload Policy Document</h1>
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Policy Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded p-2"
              placeholder="e.g. Company Security Policy"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Policy Text</label>
            <textarea
              value={policyText}
              onChange={(e) => setPolicyText(e.target.value)}
              className="w-full border rounded p-2 h-48"
              placeholder="Paste policy text here..."
            />
          </div>
          <button
            type="submit"
            disabled={uploading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {uploading ? "Uploading..." : "Upload Policy"}
          </button>
        </form>

        {uploadError && (
          <div className="mt-4 p-2 bg-red-100 text-red-700 rounded">
            {uploadError}
          </div>
        )}

        {policyResult && (
          <div className="mt-6 p-4 bg-green-100 rounded">
            <h2 className="font-bold">Policy Uploaded</h2>
            <pre className="whitespace-pre-wrap text-sm mt-2">
              {JSON.stringify(policyResult, null, 2)}
            </pre>
          </div>
        )}
      </section>

      {/* Check Text Section */}
      <section>
        <h1 className="text-2xl font-bold mb-4">Check Text Against Policy</h1>
        <form onSubmit={handleCheck} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Input Text</label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full border rounded p-2 h-32"
              placeholder="Enter text to check against uploaded policy..."
            />
          </div>
          <button
            type="submit"
            disabled={checking}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:bg-gray-400"
          >
            {checking ? "Checking..." : "Check Compliance"}
          </button>
        </form>

        {checkError && (
          <div className="mt-4 p-2 bg-red-100 text-red-700 rounded">
            {checkError}
          </div>
        )}

        {checkResult && (
          <div className="mt-6 p-4 bg-gray-100 rounded">
            <h2 className="font-bold mb-2">Analysis Result</h2>
            <div className="text-sm">
              <p>
                <span className="font-medium">Verdict:</span>{" "}
                {checkResult.judgement.verdict}
              </p>
              <p>
                <span className="font-medium">Rationale:</span>{" "}
                {checkResult.judgement.rationale}
              </p>
              <p>
                <span className="font-medium">Confidence:</span>{" "}
                {checkResult.judgement.confidence}%
              </p>
            </div>
            <pre className="whitespace-pre-wrap text-xs mt-3 p-2 bg-white rounded">
              {JSON.stringify(checkResult, null, 2)}
            </pre>
          </div>
        )}
      </section>
    </div>
  );
}
