import { Environment, Grid, Points, PointMaterial } from "@react-three/drei";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const EnvironmentSetup = () => {
  const gridRef = useRef();
  const gridMaterialRef = useRef();
  const pointsRef = useRef();

  // Generate points for the grid
  const generatePoints = () => {
    const points = [];
    const spread = 100;
    const count = 2000; // More points for better coverage

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * spread;
      const y = -1.5; // Start points just above the grid
      const z = (Math.random() - 0.5) * spread;
      points.push(x, y, z);
    }

    return new Float32Array(points);
  };

  // Animate grid and points
  useFrame(({ clock }) => {
    // Grid animation
    if (gridMaterialRef.current) {
      const time = clock.getElapsedTime();
      const color1 = new THREE.Color("#1a1a3a");
      const color2 = new THREE.Color("#2a2a4a");
      const mixedColor = color1.lerp(color2, Math.sin(time * 0.5) * 0.5 + 0.5);
      gridMaterialRef.current.color = mixedColor;
    }

    // Points animation
    if (pointsRef.current) {
      const time = clock.getElapsedTime();
      const positions = pointsRef.current.geometry.attributes.position.array;

      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] =
          -1.5 + Math.sin(time * 0.3 + positions[i] * 0.2) * 0.2;
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <>
      <color attach="background" args={["#000000"]} />
      <fog attach="fog" args={["#000000", 15, 45]} />
      <Environment preset="city" background={false} />

      {/* Floor Grid */}
      <Grid
        ref={gridRef}
        position={[0, -2, 0]}
        args={[100, 100]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#1a1a3a"
        sectionSize={5}
        fadeDistance={45}
        fadeStrength={2}
        infiniteGrid={true}
        material={gridMaterialRef}
        receiveShadow={true}
        castShadow={true}
        opacity={0.1}
      />

      {/* Moving Points */}
      <Points
        ref={pointsRef}
        positions={generatePoints()}
        stride={3}
        frustumCulled={false}
      >
        <PointMaterial
          transparent
          vertexColors
          size={1}
          sizeAttenuation={false}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          color="#2a4a8a"
          opacity={0.3}
        />
      </Points>

      {/* Subtle ambient light */}
      <ambientLight intensity={0.05} color="#1a1a3a" />
    </>
  );
};

export default EnvironmentSetup;
