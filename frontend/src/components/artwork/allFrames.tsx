import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useRoute, useLocation } from "wouter";
import { easing } from "maath"; // For smooth transitions
import Frame from "./frame"; // Component for individual frames
import * as THREE from "three";

const GOLDENRATIO = 1.61803398875;

/**
 * Helper function to calculate the position of a frame.
 * Distributes frames on a spherical layout and adjusts Y based on Z for the vertical stacking effect.
 * @param index - Index of the frame
 * @param total - Total number of frames
 * @param radius - Radius of the sphere
 * @returns {x, y, z} - Position coordinates
 */
function getPosition(index, total, radius) {
  const phi = Math.acos(-1 + (2 * index) / total); // Calculate the polar angle
  const theta = Math.sqrt(total * Math.PI) * phi; // Calculate the azimuthal angle

  const x = radius * Math.sin(phi) * Math.cos(theta); // Spherical X position
  const y = radius * Math.sin(phi) * Math.sin(theta); // Spherical Y position
  const z = radius * Math.cos(phi); // Spherical Z position

  return { x, y, z };
}

export default function Frames({
  images,
  q = new THREE.Quaternion(), // Camera orientation (rotation)
  p = new THREE.Vector3(), // Camera position
}) {
  const ref = useRef<THREE.Group>(null); // Reference to the group of frames
  const clicked = useRef<THREE.Object3D | null>(null); // Reference to the clicked frame

  const [, routeParams] = useRoute<{ id: string }>("/item/:id"); // Get 'id' from URL (e.g., '/item/123')
  const [, setLocation] = useLocation(); // Function to change the URL

  useEffect(() => {
    if (!ref.current) return;

    clicked.current = routeParams?.id
      ? ref.current.getObjectByName(routeParams.id)
      : null;

    if (clicked.current) {
      clicked.current.parent?.updateWorldMatrix(true, true);

      // Get the frame's bounding box to calculate its size
      const box = new THREE.Box3().setFromObject(clicked.current);
      const size = box.getSize(new THREE.Vector3()); // Get size of the frame
      const maxDimension = Math.max(size.x, size.y, size.z); // Largest dimension

      // Adjust camera position dynamically based on frame size
      const fitOffset = 1.5; // Adjust this multiplier to control zoom level
      const distance = maxDimension * fitOffset; // Calculate appropriate distance

      clicked.current.getWorldPosition(p); // Get frame's world position
      p.z += distance; // Move camera back by calculated distance
      clicked.current.getWorldQuaternion(q); // Get frame's orientation
    } else {
      p.set(0, 0, 8); // Default camera position
      q.identity(); // Reset rotation
    }
  }, [routeParams, p, q]);

  // Smoothly update the camera's position and orientation on every frame
  useFrame((state, dt) => {
    easing.damp3(state.camera.position, p, 0.4, dt); // Smoothly move the camera to the target position
    easing.dampQ(state.camera.quaternion, q, 0.4, dt); // Smoothly rotate the camera to the target orientation
  });

  return (
    <group
      ref={ref}
      // Handle frame clicks: Update the URL with the clicked frame's ID
      onClick={(e) => {
        e.stopPropagation(); // Prevent event from propagating to the background
        setLocation(
          clicked.current === e.object ? "/" : "/item/" + e.object.name
        ); // Toggle between default view and the clicked frame
      }}
      onPointerMissed={() => setLocation("/")} // Reset to default view if no frame is clicked
    >
      {images.map((props, index) => {
        // Calculate the position for each frame
        const { x, y, z } = getPosition(index, images.length, 5); // Radius of 5
        return (
          <Frame
            key={props.url} // Unique key for React rendering
            {...props} // Pass all frame properties (e.g., URL, name)
            position={[x, y, z]} // Set the frame's position
          />
        );
      })}
    </group>
  );
}
