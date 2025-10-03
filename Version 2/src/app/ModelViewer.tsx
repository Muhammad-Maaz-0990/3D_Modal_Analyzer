"use client";
// Ensure this is a client component to avoid hydration mismatch
import React, { Suspense } from "react";
import { OrbitControls, Grid, Bounds } from "@react-three/drei";
import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OBJLoader } from "three-stdlib";



function Model({ file, fileUrl }: { file?: File | null; fileUrl?: string | null }) {
  const [obj, setObj] = useState<any>(null);

  useEffect(() => {
    if (file && file.name.endsWith('.obj')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const loader = new OBJLoader();
        const object = loader.parse(text);
        setObj(object);
      };
      reader.readAsText(file);
    } else if (fileUrl && (fileUrl.endsWith('.glb') || fileUrl.endsWith('.gltf'))) {
      // For .glb/.gltf, use useGLTF (not implemented here for brevity)
    }
  }, [file, fileUrl]);

  if (obj) {
    return <primitive object={obj} />;
  }
  return null;
}

export default function ModelViewer({ file, fileUrl }: { file?: File | null; fileUrl?: string | null }) {
  return (
    <Suspense fallback={
      <div className="grid h-full place-items-center text-center bg-gray-50">
        <div>
          <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-indigo-100 text-indigo-600 grid place-items-center">
            <div className="animate-spin h-6 w-6 border-2 border-indigo-200 border-t-indigo-600 rounded-full"></div>
          </div>
          <p className="text-sm text-gray-600">Loading 3D model...</p>
        </div>
      </div>
    }>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 55 }}
        dpr={[1, 2]}
        style={{ height: "100%" }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <directionalLight position={[-5, -5, -5]} intensity={0.4} />
        <Grid args={[20, 20]} cellSize={0.5} cellThickness={0.5} sectionSize={2} sectionThickness={1.2} fadeDistance={30} />
        <Bounds fit clip observe margin={1.2}>
          <Model file={file} fileUrl={fileUrl} />
        </Bounds>
        <OrbitControls enablePan enableZoom enableRotate />
      </Canvas>
    </Suspense>
  );
}
