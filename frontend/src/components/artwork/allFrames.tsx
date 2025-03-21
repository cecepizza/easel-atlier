import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useRoute, useLocation } from "wouter";
import { easing } from "maath";
import Frame from "./frame";
import DynamicGrid from "../../scenes/dynamicGrid";
import * as THREE from "three";

// const GOLDENRATIO = 1.61803398875;

function getPosition(
  index: number,
  total: number,
  radius: number
): [number, number, number] {
  const phi = Math.acos(-1 + (2 * index) / total);
  const theta = Math.sqrt(total * Math.PI) * phi;

  const adjustedRadius = radius * 0.75;

  const x = adjustedRadius * Math.sin(phi) * Math.cos(theta);
  const y = adjustedRadius * Math.sin(phi) * Math.sin(theta);
  const z = adjustedRadius * Math.cos(phi);

  return [x, y, z];
}

interface FramesProps {
  images: Array<{
    url: string;
    position?: [number, number, number];
    rotation?: [number, number, number];
    name?: string;
    width?: number;
    height?: number;
  }>;
  q?: THREE.Quaternion;
  p?: THREE.Vector3;
}

export default function Frames({
  images,
  q = new THREE.Quaternion(),
  p = new THREE.Vector3(),
}: FramesProps) {
  const ref = useRef<THREE.Group>(null);
  const clicked = useRef<THREE.Object3D | null>(null);

  const [, routeParams] = useRoute<{ id: string }>("/item/:id");
  const [, setLocation] = useLocation();

  // Ensure frame positions are always defined
  const framePositions = images.map(
    (
      image: {
        url: string;
        position?: [number, number, number];
        rotation?: [number, number, number];
        name?: string;
        width?: number;
        height?: number;
      },
      index: number
    ) => getPosition(index, images.length, 5)
  );

  // Convert framePositions to THREE.Vector3 objects
  const vector3FramePositions = framePositions.map(
    (pos) => new THREE.Vector3(...pos)
  );

  useEffect(() => {
    if (!ref.current) return;

    // Fix the type error by explicitly handling undefined case
    const foundObject = routeParams?.id
      ? ref.current.getObjectByName(routeParams.id)
      : null;

    // Ensure undefined becomes null
    clicked.current = foundObject || null;

    if (clicked.current) {
      clicked.current.parent?.updateWorldMatrix(true, true);

      const box = new THREE.Box3().setFromObject(clicked.current);
      const size = box.getSize(new THREE.Vector3());
      const maxDimension = Math.max(size.x, size.y, size.z);

      const fitOffset = 1.5;
      const distance = maxDimension * fitOffset;

      clicked.current.getWorldPosition(p);
      p.z += distance;
      clicked.current.getWorldQuaternion(q);
    } else {
      p.set(0, 0, 8);
      q.identity();
    }
  }, [routeParams, p, q]);

  useFrame((state, dt) => {
    easing.damp3(state.camera.position, p, 0.4, dt);
    easing.dampQ(state.camera.quaternion, q, 0.4, dt);
  });

  return (
    <>
      <DynamicGrid framePositions={vector3FramePositions} />
      <group
        ref={ref}
        onClick={(e) => {
          e.stopPropagation();
          setLocation(
            clicked.current === e.object ? "/" : "/item/" + e.object.name
          );
        }}
        onPointerMissed={() => setLocation("/")}
      >
        {images.map((props, index) => (
          <Frame key={props.url} {...props} position={framePositions[index]} />
        ))}
      </group>
    </>
  );
}
