import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { ThreeMFLoader } from "three/examples/jsm/loaders/3MFLoader.js";
// occt-import-js loads a wasm at runtime; we help it find the file via locateFile
// Vite: import wasm asset URL
// @ts-ignore - Vite will resolve this to a URL string
import occtWasmUrl from "occt-import-js/dist/occt-import-js.wasm?url";
// occt-import-js exports a function that returns a Promise<occt>
// We import it dynamically to avoid SSR issues
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import occtimportjs from "occt-import-js";

export type SupportedExt = "obj" | "stl" | "3mf" | "step" | "stp" | "iges" | "igs";

type Props = {
  file: File | null;
  ext: SupportedExt | null;
  className?: string;
};

export const ModelPreview: React.FC<Props> = ({ file, ext, className }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const rafRef = useRef<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Initialize scene once
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff); // Pure white background
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 2000);
    camera.position.set(100, 80, 160);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setClearColor(0xffffff, 1); // Ensure white background
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Enhanced Lighting for better model visibility
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight1.position.set(100, 100, 50);
    directionalLight1.castShadow = true;
    directionalLight1.shadow.mapSize.width = 2048;
    directionalLight1.shadow.mapSize.height = 2048;
    scene.add(directionalLight1);
    
    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
    directionalLight2.position.set(-50, 50, -50);
    scene.add(directionalLight2);

    // Create a more visible grid like in the reference image
    const gridSize = 400;
    const gridDivisions = 40;
    const grid = new THREE.GridHelper(gridSize, gridDivisions, 0x93c5fd, 0xbfdbfe);
    grid.material.opacity = 0.6;
    grid.material.transparent = true;
    grid.position.y = -20; // Lower the grid slightly
    scene.add(grid);
    
    // Add a subtle floor plane for better depth perception
    const floorGeometry = new THREE.PlaneGeometry(gridSize, gridSize);
    const floorMaterial = new THREE.MeshLambertMaterial({ 
      color: 0xffffff, 
      transparent: true, 
      opacity: 0.8,
      side: THREE.DoubleSide 
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -20;
    floor.receiveShadow = true;
    scene.add(floor);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.target.set(0, 0, 0);
    controlsRef.current = controls;

    const onResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const { clientWidth, clientHeight } = containerRef.current;
      rendererRef.current.setSize(clientWidth, clientHeight);
      cameraRef.current.aspect = clientWidth / clientHeight;
      cameraRef.current.updateProjectionMatrix();
    };
    onResize();
    window.addEventListener("resize", onResize);

    const animate = () => {
      controls.update();
      renderer.render(scene, camera);
      rafRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", onResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      controls.dispose();
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, []);

  // Load model whenever file/ext changes
  useEffect(() => {
    const loadModel = async () => {
      if (!file || !ext || !sceneRef.current) {
        // Clear any existing models but keep grid and lights
        if (sceneRef.current) {
          const scene = sceneRef.current;
          const toRemove: THREE.Object3D[] = [];
          scene.traverse((obj) => {
            if ((obj as THREE.Mesh).isMesh) {
              toRemove.push(obj);
            }
          });
          toRemove.forEach((obj) => obj.parent?.remove(obj));
        }
        setError(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      // Small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 200));

      try {
        const scene = sceneRef.current;
        
        // Remove previous models (keep lights and grid)
        const toRemove: THREE.Object3D[] = [];
        scene.traverse((obj) => {
          if ((obj as THREE.Mesh).isMesh) {
            toRemove.push(obj);
          }
        });
        toRemove.forEach((obj) => obj.parent?.remove(obj));

        // Common material - use the gray color from the reference image with better lighting
        const baseMaterial = new THREE.MeshLambertMaterial({ 
          color: 0xbbbbbb, // Slightly darker gray for better contrast
          side: THREE.DoubleSide,
        });

        const fitView = (object: THREE.Object3D) => {
          if (!cameraRef.current || !controlsRef.current) return;
          
          const camera = cameraRef.current;
          const controls = controlsRef.current;
          const box = new THREE.Box3().setFromObject(object);
          
          if (box.isEmpty()) {
            // Default camera position for empty models
            camera.position.set(100, 80, 160);
            controls.target.set(0, 0, 0);
            controls.update();
            return;
          }
          
          const size = box.getSize(new THREE.Vector3());
          const center = box.getCenter(new THREE.Vector3());
          
          // Center the object and position it slightly above the grid
          object.position.sub(center);
          object.position.y = Math.max(object.position.y, size.y / 2 - 15); // Position above grid
          controls.target.copy(object.position);

          // Calculate appropriate camera distance
          const maxDim = Math.max(size.x, size.y, size.z);
          const fov = camera.fov * (Math.PI / 180);
          const distance = maxDim / (2 * Math.tan(fov / 2)) * 2.5; // Slightly further back
          
          // Position camera at an angle similar to the reference image
          camera.position.set(
            object.position.x + distance * 0.7, 
            object.position.y + distance * 0.5, 
            object.position.z + distance * 0.7
          );
          camera.lookAt(object.position);
          controls.update();
        };

        if (ext === "obj") {
          const url = URL.createObjectURL(file);
          const loader = new OBJLoader();
          const group = await loader.loadAsync(url);
          URL.revokeObjectURL(url);
          
          group.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              const mesh = child as THREE.Mesh;
              mesh.material = baseMaterial;
              mesh.castShadow = true;
              mesh.receiveShadow = true;
            }
          });
          
          scene.add(group);
          fitView(group);
          
        } else if (ext === "stl") {
          const url = URL.createObjectURL(file);
          const loader = new STLLoader();
          const geometry = await loader.loadAsync(url);
          URL.revokeObjectURL(url);
          
          const mesh = new THREE.Mesh(geometry, baseMaterial);
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          scene.add(mesh);
          fitView(mesh);
          
        } else if (ext === "3mf") {
          const url = URL.createObjectURL(file);
          const loader = new ThreeMFLoader();
          const group = await loader.loadAsync(url);
          URL.revokeObjectURL(url);
          
          group.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              const mesh = child as THREE.Mesh;
              if (!mesh.material) mesh.material = baseMaterial;
              mesh.castShadow = true;
              mesh.receiveShadow = true;
            }
          });
          
          scene.add(group);
          fitView(group);
          
        } else if (ext === "step" || ext === "stp" || ext === "iges" || ext === "igs") {
          const buffer = new Uint8Array(await file.arrayBuffer());
          const occt = await (occtimportjs as any)({ locateFile: () => occtWasmUrl });
          const params = {
            linearUnit: "millimeter",
            linearDeflectionType: "bounding_box_ratio",
            linearDeflection: 0.0015,
            angularDeflection: 0.2,
          };
          
          const result = ext === "iges" || ext === "igs"
            ? occt.ReadIgesFile(buffer, params)
            : occt.ReadStepFile(buffer, params);
            
          if (!result?.success) throw new Error("Failed to parse CAD file");

          const group = new THREE.Group();
          (result.meshes || []).forEach((mesh: any) => {
            const positions = (mesh.attributes?.position?.array || []) as number[] | number[][];
            const flatPos = (Array.isArray(positions[0]) ? (positions as number[][]).flat() : (positions as number[])) as number[];
            const indices = (mesh.index?.array || []) as number[] | number[][];
            const flatIdx = (Array.isArray(indices[0]) ? (indices as number[][]).flat() : (indices as number[])) as number[];

            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute("position", new THREE.Float32BufferAttribute(new Float32Array(flatPos), 3));
            if (flatIdx.length) geometry.setIndex(flatIdx);
            geometry.computeVertexNormals();

            const color = mesh.color && Array.isArray(mesh.color) 
              ? new THREE.Color(mesh.color[0] / 255, mesh.color[1] / 255, mesh.color[2] / 255) 
              : null;
            const mat = color ? baseMaterial.clone() : baseMaterial;
            if (color) (mat as THREE.MeshLambertMaterial).color = color;
            
            const meshObject = new THREE.Mesh(geometry, mat);
            meshObject.castShadow = true;
            meshObject.receiveShadow = true;
            group.add(meshObject);
          });
          
          scene.add(group);
          fitView(group);
        }
        
      } catch (e: any) {
        // Handle model loading errors silently in production
        setError(e?.message || "Failed to load model");
      } finally {
        setLoading(false);
      }
    };
    
    loadModel();
  }, [file, ext]);

  return (
    <div ref={containerRef} className={className} style={{ width: "100%", height: "100%", position: "relative" }}>
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-10">
          <div className="flex items-center gap-3 px-4 py-2 bg-white/90 rounded-lg shadow-lg border">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-gray-700">Loading model...</span>
          </div>
        </div>
      )}
      
      {/* Error overlay */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-10">
          <div className="flex items-center gap-3 px-4 py-2 bg-red-50 rounded-lg shadow-lg border border-red-200">
            <span className="text-sm text-red-600">{error}</span>
          </div>
        </div>
      )}
      
      {/* Empty state */}
      {!file && !loading && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400 z-10">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-3 opacity-30">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <p className="text-sm">Upload a 3D model to preview</p>
          </div>
        </div>
      )}
    </div>
  );
};