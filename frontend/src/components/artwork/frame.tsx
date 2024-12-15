// individual frame component

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useRoute } from "wouter";
import { useCursor } from "@react-three/drei";
import { easing } from "maath"; // animation easing
import getUuid from "uuid-by-string"; /// generate unique ids from strings
import * as THREE from "three";
import { Image, Text } from "@react-three/drei";
import envConfig from "../env.config";

const GOLDENRATIO = 1.61803398875; // golden ratio for aesthetic purposes

export default function Frame({ url, c = new THREE.Color(), ...props }) {
  const image = useRef<THREE.Mesh>(null);
  const frame = useRef<THREE.Mesh>(null);
  const group = useRef<THREE.Group>(null);
  const [, params] = useRoute("/item/:id");
  const [hovered, hover] = useState(false);
  const [rnd] = useState(() => Math.random()); // random value for animations
  const name = getUuid(url);
  const isActive = params?.id === name;
  useCursor(hovered); // change cursor when hovered

  // handle frame animations
  useFrame((state, dt) => {
    if (!image.current || !frame.current || !group.current) return;

    // floating animation
    const floatOffset = Math.sin(state.clock.elapsedTime + rnd * 2000) * 0.1;
    group.current.position.y = floatOffset;

    // image zoom animation
    image.current.material.zoom =
      2 + Math.sin(rnd * 10000 + state.clock.elapsedTime / 3) / 2;

    // scale animaton on hover
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

    // frame color animation
    easing.dampC(
      frame.current.material.color,
      hovered ? "black" : "white",
      0.1,
      dt
    );
  });

  return (
    // this group is the parent of the mesh which we are using for identification
    <group ref={group} {...props}>
      <mesh
        // this name is used as a unique identifier to focus and manipulate things
        name={name}
        onPointerOver={(e) => (e.stopPropagation(), hover(true))}
        onPointerOut={() => hover(false)}
        scale={[1, GOLDENRATIO, 0.05]}
        position={[0, GOLDENRATIO / 1, 0]}
      >
        <boxGeometry />
        <meshStandardMaterial
          color="#lightgray"
          metalness={1.5}
          roughness={2.5}
          envMapIntensity={2}
        />

        {/* frame border */}
        <mesh
          ref={frame}
          raycast={() => null}
          scale={[0.9, 0.93, 0.9]}
          //   position={[0, 0, 0.0]}
        >
          <boxGeometry />
          <meshBasicMaterial color="white" toneMapped={false} fog={false} />
        </mesh>

        {/* image mesh */}
        <Image
          raycast={() => null}
          ref={image}
          position={[0, 0, 0.7]}
          url={url}
          color="#lightgray"
        />
      </mesh>
      {/*image title*/}
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
