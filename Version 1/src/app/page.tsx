"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import the 3D viewer to avoid SSR issues
const ModelViewer = dynamic(() => import("./ModelViewer"), { ssr: false });

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [modelUrl, setModelUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    setResult(null);
    setError(null);
    setModelUrl(selectedFile ? URL.createObjectURL(selectedFile) : null);
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("http://localhost:8000/analyze-3d", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to analyze file");
      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-4 text-indigo-700 text-center">3D File Analyzer</h1>
        <p className="mb-6 text-gray-600 text-center">Upload your 3D file (.obj, .stl) and get instant analysis results.</p>
        <input type="file" accept=".obj,.stl" onChange={handleFileChange} className="mb-4 w-full" />
        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "Analyze File"}
        </button>
        {error && <div className="mt-4 text-red-500 text-center">{error}</div>}
        {result && (
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-2 text-indigo-700">Results</h2>
            <div className="bg-indigo-50 rounded-lg p-4 mb-4">
              <p><strong>Filename:</strong> {result.filename}</p>
              <p><strong>Size:</strong> {result.size_bytes} bytes</p>
              <p><strong>Volume:</strong> {result.analysis.volume ?? "N/A"}</p>
              <p><strong>Surface Area:</strong> {result.analysis.surface_area ?? "N/A"}</p>
              <p><strong>Geometry:</strong> {result.analysis.geometry}</p>
            </div>
            {result && (
              <div className="mt-6">
                <h2 className="text-xl font-bold mb-2 text-indigo-700">Results</h2>
                <div className="bg-indigo-50 rounded-lg p-4 mb-4">
                  <table className="min-w-full text-sm text-left border border-indigo-200 rounded-lg overflow-hidden">
                    <thead className="bg-indigo-100">
                      <tr>
                        <th className="px-4 py-2 font-semibold text-indigo-700">Property</th>
                        <th className="px-4 py-2 font-semibold text-indigo-700">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.analysis.details.map((row: any, idx: number) => (
                        <tr key={idx} className="border-b border-indigo-100">
                          <td className="px-4 py-2 text-gray-700">{row.property}</td>
                          <td className="px-4 py-2 text-gray-900 font-medium">{row.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {file && (
                  <div className="bg-white rounded-lg shadow p-4">
                    <h3 className="text-lg font-semibold mb-2 text-indigo-700">3D Model Preview</h3>
                    <div style={{ height: 400 }}>
                      <ModelViewer file={file} fileUrl={modelUrl} />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      <footer className="mt-8 text-gray-500 text-sm text-center">&copy; 2025 3D Analyzer App. All rights reserved.</footer>
    </div>
  );
}
