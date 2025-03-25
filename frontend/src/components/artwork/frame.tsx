// individual frame component

import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useRoute } from "wouter";
import { useCursor } from "@react-three/drei";
import { easing } from "maath"; // animation easing
import getUuid from "uuid-by-string"; /// generate unique ids from strings
import * as THREE from "three";
import { Image } from "@react-three/drei";
// import envConfig from "../../env.config";

export interface FrameProps {
  url: string;
  c?: THREE.Color;
  width?: number;
  height?: number;
  position?: [number, number, number];
}

// Define a custom type for the material
interface CustomMaterial extends THREE.Material {
  zoom: number;
}

const Frame = React.memo(function Frame({
  url,

  c = new THREE.Color(),
  width,
  height,
  position = [0, 0, 0],
  ...props
}: FrameProps) {
  const image = useRef<THREE.Mesh>(null);
  const frame = useRef<THREE.Mesh>(null); // reference frame mesh
  const group = useRef<THREE.Group>(null);
  const [, params] = useRoute<{ id: string }>("/item/:id");
  const [hovered, hover] = useState(false);
  const [rnd] = useState(() => Math.random());
  const name = getUuid(url);
  const isActive = params?.id === name;
  useCursor(hovered);

  // Set frame size based on image aspect ratio
  const aspectRatio = width && height ? width / height : 1;
  const frameScale: [number, number, number] =
    aspectRatio > 1
      ? [0.9, 0.9 / aspectRatio, 0.05]
      : [0.9 * aspectRatio, 0.9, 0.05];
  // Set image scale to match frame scale
  const imageScale: [number, number] = [
    frameScale[0] * 0.95,
    frameScale[1] * 0.95,
  ];

  // Original frame animations
  useFrame((state, dt) => {
    if (!image.current || !frame.current || !group.current) return;

    // float offset
    const floatOffset = Math.sin(state.clock.elapsedTime + rnd * 2000) * 0.05;
    group.current.position.y = floatOffset;

    // Minimize zoom variation
    (image.current.material as CustomMaterial).zoom =
      1.0 + Math.sin(rnd * 10000 + state.clock.elapsedTime / 3) / 50;

    easing.damp3(
      image.current.scale,
      [
        1 * (!isActive && hovered ? 0.95 : 1),
        1 * (!isActive && hovered ? 0.95 : 1),
        1 * (!isActive && hovered ? 1.05 : 1),
      ],
      0.1,
      dt
    );

    easing.dampC(
      (frame.current.material as THREE.MeshBasicMaterial).color,
      hovered ? "black" : "white",
      0.1,
      dt
    );
  });

  return (
    <group ref={group} {...props}>
      <mesh
        name={name}
        onPointerOver={(e) => (e.stopPropagation(), hover(true))}
        onPointerOut={() => hover(false)}
        scale={frameScale}
        position={position}
      >
        <boxGeometry />
        <meshStandardMaterial
          color={c}
          metalness={1.5}
          roughness={2.5}
          envMapIntensity={2}
        />

        <mesh ref={frame} raycast={() => null} scale={[0.9, 0.93, 0.9]}>
          <boxGeometry />
          <meshBasicMaterial color="white" toneMapped={false} fog={false} />
        </mesh>

        <Image
          position={[0, 0, 0.7]}
          url={url}
          scale={imageScale}
          grayscale={0}
          zoom={1}
          transparent
          opacity={1}
        />
      </mesh>
      {/* <Text
        maxWidth={0.1}
        anchorX="left"
        anchorY="top"
        position={[0.55, GOLDENRATIO, 0]}
        fontSize={0.025}
      > */}
      {name.split("-").join(" ")}
      {/* </Text> */}
    </group>
  );
});

export default Frame;
