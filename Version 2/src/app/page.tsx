"use client";
import React, { useState, useRef } from "react";
import dynamic from "next/dynamic";

// Dynamically import the 3D viewer to avoid SSR issues
const ModelViewer = dynamic(() => import("./ModelViewer"), { ssr: false });

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [modelLoading, setModelLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const onPick = (f: File | null) => {
    setFile(f);
    setResult(null);
    setError(null);
    setModelLoading(true);
    const url = f ? URL.createObjectURL(f) : null;
    setModelUrl(url);
    
    // Simulate model loading delay
    setTimeout(() => {
      setModelLoading(false);
    }, 1000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onPick(e.target.files?.[0] || null);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0] || null;
    onPick(f);
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
    <>
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="section-title mb-4">Analyze your 3D models</h1>
        <p className="subtle text-lg max-w-2xl mx-auto">
          Upload .obj or .stl files for instant metrics, detailed analysis, and a live 3D viewer.
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-2 items-start">
        {/* Left panel: uploader and results */}
        <section className="space-y-6 animate-fadeUp">
          <div className="glass rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-semibold mb-4">Upload Your Model</h2>
            
            <label
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-indigo-200 bg-white/60 p-8 text-center transition hover:border-indigo-400 hover:bg-white shadow-sm"
            >
              <div className="pointer-events-none">
                <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-indigo-100 text-indigo-600 grid place-items-center shadow-inner animate-float">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 16V4m0 0l-4 4m4-4l4 4" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M20 16.5a4.5 4.5 0 01-4.5 4.5h-7A4.5 4.5 0 014 16.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <p className="font-medium">Drag & drop your model here</p>
                <p className="subtle mt-1">or click to browse (.obj, .stl)</p>
              </div>
              <input ref={inputRef} type="file" accept=".obj,.stl" onChange={handleFileChange} className="sr-only" />
            </label>

            {file && (
              <div className="mt-4 flex items-center justify-between rounded-lg border bg-white/70 px-4 py-3 text-sm">
                <span className="truncate max-w-[65%]">{file.name}</span>
                <button
                  onClick={() => inputRef.current?.click()}
                  className="btn-primary px-3 py-1.5 text-xs"
                >
                  Change
                </button>
              </div>
            )}

            <div className="mt-6 flex gap-3">
              <button onClick={handleUpload} disabled={!file || loading} className="btn-primary disabled:opacity-50">
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full"></div>
                    Analyzing…
                  </div>
                ) : (
                  "Analyze File"
                )}
              </button>
              {file && (
                <button onClick={() => onPick(null)} className="rounded-lg border px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Clear</button>
              )}
            </div>

            {error && <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">{error}</div>}
          </div>

          {result && (
            <div className="glass rounded-2xl p-6 md:p-8 animate-fadeUp">
              <h2 className="text-xl font-semibold mb-4">Analysis Results</h2>
              <p className="subtle mb-6">Complete analysis of your 3D model with detailed metrics.</p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <Stat label="Volume (cm³)" value={result.analysis.volume} />
                <Stat label="Surface (cm²)" value={result.analysis.surface_area} />
                <Stat label="Faces" value={result.analysis.num_faces} />
                <Stat label="Material" value={result.analysis.material} />
                <Stat label="Density (g/cm³)" value={result.analysis.density} />
                <Stat label="Final Cost (USD)" value={`$${result.analysis.cost}`} />
              </div>

              <div className="overflow-hidden rounded-xl border">
                <table className="w-full text-sm">
                  <thead className="bg-indigo-50 text-indigo-700">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">Property</th>
                      <th className="px-4 py-3 text-left font-semibold">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.analysis.details.map((row: any, idx: number) => (
                      <tr key={idx} className="even:bg-gray-50 hover:bg-gray-100/50 transition-colors">
                        <td className="px-4 py-3 text-gray-700">{row.property}</td>
                        <td className="px-4 py-3 font-medium">{row.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>

        {/* Right panel: viewer */}
        <aside className="sticky top-6 h-[520px] glass rounded-2xl p-4 md:p-6 animate-fadeUp">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">3D Model Preview</h3>
            <span className="text-xs text-gray-500">Orbit to inspect</span>
          </div>
          <div className="h-[440px] rounded-xl overflow-hidden bg-white relative">
            {modelLoading ? (
              <ModelLoadingState />
            ) : file ? (
              <ModelViewer file={file} fileUrl={modelUrl} />
            ) : (
              <EmptyViewer />
            )}
          </div>
        </aside>
      </div>
    </>
  );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-xl border bg-white/70 px-4 py-3 shadow-sm">
      <div className="text-xs uppercase tracking-wide text-gray-500">{label}</div>
      <div className="mt-1 text-lg font-semibold">{String(value)}</div>
    </div>
  );
}

function ModelLoadingState() {
  return (
    <div className="grid h-full place-items-center text-center">
      <div>
        <div className="mx-auto mb-3 h-14 w-14 rounded-full bg-indigo-100 text-indigo-600 grid place-items-center animate-float">
          <div className="animate-spin h-6 w-6 border-2 border-indigo-200 border-t-indigo-600 rounded-full"></div>
        </div>
        <p className="font-medium">Loading 3D model...</p>
        <p className="subtle text-sm">Please wait while we render your model.</p>
      </div>
    </div>
  );
}

function EmptyViewer() {
  return (
    <div className="grid h-full place-items-center text-center">
      <div>
        <div className="mx-auto mb-3 h-14 w-14 rounded-full bg-gray-100 text-gray-500 grid place-items-center animate-float">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4 7l8-4 8 4-8 4-8-4z"/>
            <path d="M4 12l8 4 8-4"/>
            <path d="M4 17l8 4 8-4"/>
          </svg>
        </div>
        <p className="font-medium">No model yet</p>
        <p className="subtle text-sm">Upload a file to preview it here.</p>
      </div>
    </div>
  );
}
