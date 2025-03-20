import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

const Environment = () => {
  const gridRef = useRef<THREE.Mesh>(null);

  // Animate grid
  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Pulse grid effect
    if (gridRef.current) {
    }
  });

  return (
    <>
      {/* Background Color */}
      <color attach="background" args={["#101522"]} />

      {/* Fog for Atmosphere */}
      <fog attach="fog" args={["#101522", 10, 80]} />

      {/* Glowing Neon Grid */}
      <mesh
        ref={gridRef}
        position={[0, -10, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[200, 200, 100, 100]} />
        <meshStandardMaterial
          color="#4a6a8a"
          emissive="#4a6a8a"
          emissiveIntensity={0.8}
          wireframe={true}
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* Ambient Light */}
      <ambientLight intensity={0.1} color="#ffffff" />

      {/* spotlights */}
      <spotLight
        position={[-50, 50, 50]}
        angle={Math.PI / 6}
        intensity={2.0}
        color="#ff8c00"
        penumbra={0.3}
        castShadow
      />
      <spotLight
        position={[50, 50, -50]}
        angle={Math.PI / 6}
        intensity={1.8}
        color="#00bfff"
        penumbra={0.3}
        castShadow
      />

      {/* main point */}
      <pointLight
        position={[0, 20, 0]}
        intensity={1.5}
        color="#ff4500"
        distance={100}
        decay={2}
      />
      <directionalLight
        position={[0, 50, 50]}
        intensity={0.5}
        color="#ffffff"
        castShadow
      />

      {/* floating shapes */}
      {Array.from({ length: 10 }).map((_, i) => (
        <Float
          key={i}
          speed={0.8 + Math.random() * 0.5}
          rotationIntensity={0.3}
          floatIntensity={0.5}
        >
          <mesh
            position={[
              (Math.random() - 0.5) * 50,
              Math.random() * 20,
              (Math.random() - 0.5) * 50,
            ]}
          >
            <icosahedronGeometry args={[Math.random() * 1.5 + 0.5, 1]} />
            <meshStandardMaterial
              color="#2a3a4a"
              emissive="#2a3a4a"
              emissiveIntensity={0.4}
              wireframe
            />
          </mesh>
        </Float>
      ))}
    </>
  );
};

export default Environment;
