// This component displays a collection of frames

import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRoute, useLocation } from "wouter";
import { easing } from "maath";
import Frame from "./frame";
import DynamicGrid from "../../scenes/dynamicGrid";
import * as THREE from "three";

const GOLDENRATIO = 1.61803398875;

/**
 * Calculates the position of a frame in a spherical arrangement.
 *
 * @param index The index of the frame.
 * @param total The total number of frames.
 * @param radius The radius of the sphere.
 * @returns The position of the frame as an array of three numbers.
 */
function getPosition(index, total, radius) {
  // calculates the position of a frame in a spherical arrangement
  const phi = Math.acos(-1 + (2 * index) / total);
  const theta = Math.sqrt(total * Math.PI) * phi;

  const adjustedRadius = radius * 0.75;

  const x = adjustedRadius * Math.sin(phi) * Math.cos(theta);
  const y = adjustedRadius * Math.sin(phi) * Math.sin(theta);
  const z = adjustedRadius * Math.cos(phi);

  return [x, y, z];
}

/**
 * The AllFrames component displays a collection of frames in a spherical arrangement.
 *
 * @param images An array of image objects.
 * @param q The quaternion of the camera.
 * @param p The position of the camera.
 * @returns The JSX element representing the component.
 */
export default function AllFrames({
  images,
  q = new THREE.Quaternion(),
  p = new THREE.Vector3(),
}) {
  const ref = useRef<THREE.Group>(null);
  const clicked = useRef<THREE.Object3D | null>(null);

  const [, routeParams] = useRoute<{ id: string }>("/item/:id");
  const [, setLocation] = useLocation();

  // Ensure frame positions are always defined
  const framePositions = images.map((_, index) =>
    getPosition(index, images.length, 5)
  );

  useEffect(() => {
    if (!ref.current) return;

    clicked.current = routeParams?.id
      ? ref.current.getObjectByName(routeParams.id)
      : null;

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

  //   useFrame((state, dt) => {
  //     easing.damp3(state.camera.position, p, 0.4, dt);
  //     easing.dampQ(state.camera.quaternion, q, 0.4, dt);
  //   });

  return (
    <>
      <OrbitControls
        makeDefault
        enableZoom={true}
        enablePan={true}
        enableRotate={true}
        minDistance={2}
        maxDistance={20}
      />
      <DynamicGrid framePositions={framePositions} />
      <group
        ref={ref} // create ref to access group directly
        onClick={(e) => {
          // handles onclick of any frame
          e.stopPropagation(); // clicks that dont hit any frame should not bubble up
          setLocation(
            clicked.current === e.object ? "/" : "/item/" + e.object.name // selects the current clicked frame to go back to home route or navigates to new clicked frame
          );
        }}
        onPointerMissed={() => setLocation("/")}
      >
        {images.map((props, index) => (
          // each frame gets its image props and calculated position from framePositions array
          <Frame key={props.url} {...props} position={framePositions[index]} /> // create Frame component for each image
        ))}
      </group>
    </>
  );
}
