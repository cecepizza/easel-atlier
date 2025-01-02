import { Environment, Grid, Points, PointMaterial } from "@react-three/drei";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const EnvironmentSetup = () => {
  const gridRef = useRef();
  const gridMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
  const pointsRef = useRef<THREE.Points>(null);

  // Generate points for the grid
  const generatePoints = () => {
    const points = [];
    const spreadX = 200; // Spread on the X-axis
    const spreadZ = 200; // Spread on the Z-axis
    const count = 3000; // Higher point count for better density

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * spreadX;
      const y = -1.5; // Y position above grid
      const z = (Math.random() - 0.5) * spreadZ;
      points.push(x, y, z);
    }

    return new Float32Array(points);
  };

  // Animate grid and points
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    // Animate grid color
    if (gridMaterialRef.current) {
      const color1 = new THREE.Color("#1a1a3a");
      const color2 = new THREE.Color("#4a4a8a");
      const mixedColor = color1.lerp(color2, Math.sin(time * 0.5) * 0.5 + 0.5);
      gridMaterialRef.current.color = mixedColor;
    }

    // Animate points
    if (pointsRef.current) {
      const positions = pointsRef.current.geometry.attributes.position
        .array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] =
          -1.5 + Math.sin(time * 0.3 + positions[i] * 0.2) * 0.5; // Increased amplitude from 0.3 to 0.5
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <>
      {/* Background color */}
      <color attach="background" args={["#10101a"]} />

      {/* Fog for depth effect */}
      <fog attach="fog" args={["#10101a", 10, 50]} />

      {/* Dynamic environment lighting */}
      <Environment preset="city" background={false} />

      {/* Grid with dynamic colors */}
      <Grid
        ref={gridRef}
        position={[0, -8, 0]}
        args={[100, 100]}
        cellSize={1}
        cellThickness={0.6}
        sectionSize={5}
        fadeDistance={60}
        fadeStrength={2}
        infiniteGrid={true}
        material={gridMaterialRef}
        cellColor="#3a3a6a"
        receiveShadow
        opacity={0.2}
      />

      {/* Floating, moving points */}
      <Points
        ref={pointsRef}
        positions={generatePoints()}
        stride={3}
        frustumCulled={false}
      >
        <PointMaterial
          transparent
          size={3} // Increased size
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.NormalBlending} // Changed blending mode
          color="#ff99cc" // Brighter color
          opacity={0.1} // Increased opacity
        />
      </Points>

      {/* Ambient light for subtle overall lighting */}
      <ambientLight intensity={0.2} color="#1a1a3a" />

      {/* Directional light for more dynamic shadows */}
      <directionalLight
        intensity={0.5}
        position={[10, 20, 10]}
        color="#ffffff"
        castShadow
      />

      {/* Spotlight for a glowing focal effect */}
      <spotLight
        intensity={1}
        position={[0, 20, 0]}
        angle={Math.PI / 6}
        penumbra={0.5}
        castShadow
        color="#88aaff"
      />
    </>
  );
};

export default EnvironmentSetup;
