"use client";
// Ensure this is a client component to avoid hydration mismatch
import React, { Suspense } from "react";
// ...existing code...
import { OrbitControls, useGLTF } from "@react-three/drei";
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
    <Suspense fallback={<div>Loading 3D Model...</div>}>
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }} style={{ height: "100%" }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 10]} intensity={1} />
        <Model file={file} fileUrl={fileUrl} />
        <OrbitControls />
      </Canvas>
    </Suspense>
  );
}
