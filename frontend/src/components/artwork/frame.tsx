// individual frame component

import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useRoute } from "wouter";
import { useCursor } from "@react-three/drei";
import { easing } from "maath"; // animation easing
import getUuid from "uuid-by-string"; /// generate unique ids from strings
import * as THREE from "three";
import { Image, Text } from "@react-three/drei";
// import envConfig from "../../env.config";

const GOLDENRATIO = 1.61803398875; // golden ratio for aesthetic purposes

export default function Frame({
  url,
  metadata,
  c = new THREE.Color(),
  ...props
}) {
  const image = useRef<THREE.Mesh>(null);
  const frame = useRef<THREE.Mesh>(null);
  const group = useRef<THREE.Group>(null);
  const [, params] = useRoute("/item/:id");
  const [hovered, hover] = useState(false);
  const [rnd] = useState(() => Math.random());
  const name = getUuid(url);
  const isActive = params?.id === name;
  useCursor(hovered);

  // Keep frame size consistent for camera
  const frameScale = [1, GOLDENRATIO, 0.05];
  const framePosition = [0, GOLDENRATIO / 1, 0];

  // Handle image aspect ratio
  useEffect(() => {
    if (image.current) {
      const img = new window.Image();
      img.onload = () => {
        const aspectRatio = img.width / img.height;
        if (image.current) {
          // Adjust image scale within the frame
          if (aspectRatio > 1) {
            image.current.scale.set(0.9, 0.9 / aspectRatio, 1);
          } else {
            image.current.scale.set(0.9 * aspectRatio, 0.9, 1);
          }
        }
      };
      img.src = url;
    }
  }, [url]);

  // Original frame animations
  useFrame((state, dt) => {
    if (!image.current || !frame.current || !group.current) return;

    const floatOffset = Math.sin(state.clock.elapsedTime + rnd * 2000) * 0.1;
    group.current.position.y = floatOffset;

    image.current.material.zoom =
      2 + Math.sin(rnd * 10000 + state.clock.elapsedTime / 3) / 2;

    easing.damp3(
      image.current.scale,
      [
        1 * (!isActive && hovered ? 0.85 : 1),
        1 * (!isActive && hovered ? 0.75 : 1),
        1 * (!isActive && hovered ? 1.05 : 1),
      ],
      0.1,
      dt
    );

    easing.dampC(
      frame.current.material.color,
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
        position={framePosition}
      >
        <boxGeometry />
        <meshStandardMaterial
          color="#lightgray"
          metalness={1.5}
          roughness={2.5}
          envMapIntensity={2}
        />

        <mesh ref={frame} raycast={() => null} scale={[0.9, 0.93, 0.9]}>
          <boxGeometry />
          <meshBasicMaterial color="white" toneMapped={false} fog={false} />
        </mesh>

        <Image
          raycast={() => null}
          ref={image}
          position={[0, 0, 0.7]}
          url={url}
          grayscale={0}
          zoom={1}
          transparent
          opacity={1}
        />
      </mesh>
      <Text
        maxWidth={0.1}
        anchorX="left"
        anchorY="top"
        position={[0.55, GOLDENRATIO, 0]}
        fontSize={0.025}
      >
        {name.split("-").join(" ")}
      </Text>
    </group>
  );
}
