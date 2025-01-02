"use client"; // use client side rendering

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import EnvironmentSetup from "../scenes/environmentSetup";
import useImages from "../hooks/useImages";
import Frames from "../components/artwork/allFrames";
import { Float } from "@react-three/drei";

// Separate component for the animated cityscape
const Cityscape = () => {
  const buildingsRef = useRef([]);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    buildingsRef.current.forEach((building, i) => {
      if (building) {
        // Animate building lights with grayscale colors
        const material = building.material;
        const brightness = 0.3 + Math.sin(time + i) * 0.2;
        material.emissive.setRGB(brightness, brightness, brightness);
        material.opacity = 0.3 + Math.sin(time * 0.5 + i * 0.1) * 0.1;
      }
    });
  });

  return (
    <group position={[1, -1.5, 1]}>
      {/* Grayscale Buildings */}
      {Array.from({ length: 150 }).map((_, i) => (
        <mesh
          key={i}
          ref={(el) => (buildingsRef.current[i] = el)}
          position={[
            (i % 10) * 2 - 9,
            Math.random() * 8 + 10,
            Math.floor(i / 10) * 2 - 20,
          ]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[1, Math.random() * 8 + 1, 1]} />
          <meshPhysicalMaterial
            color="#333333"
            emissive="#666666"
            emissiveIntensity={0.2}
            metalness={0.9}
            roughness={0.1}
            transparent={true}
            opacity={0.3}
            transmission={0.6}
            thickness={0.5}
            clearcoat={1}
          />
        </mesh>
      ))}

      {/* Grayscale fog */}
      {Array.from({ length: 20 }).map((_, i) => (
        <Float key={i} speed={0.3} rotationIntensity={0.1} floatIntensity={0.2}>
          <mesh
            position={[(i % 5) * 5 - 10, -6, Math.floor(i / 5) * 5 - 10]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <planeGeometry args={[10, 10]} />
            <meshStandardMaterial
              color="#444444"
              transparent
              opacity={0.15}
              fog={true}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
};

const App = () => {
  const { images, loading } = useImages();
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="h-screen w-full">
      <Canvas
        style={{ height: `${height}px`, width: `${width}px` }} // set canvas size to match window size
        camera={{ fov: 70, position: [0, 2, 15] }}
        shadows
      >
        <EnvironmentSetup />
        <group position={[0, -1.5, 0]}>
          <Frames images={images} />
          <Cityscape />
        </group>
      </Canvas>
    </div>
  );
};

export default App;
