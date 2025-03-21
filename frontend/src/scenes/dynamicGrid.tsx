import { useMemo } from "react";
import { Line } from "@react-three/drei";
import * as THREE from "three";

/**
 * Helper function to create lines between frames for a grid effect.
 * @param {Array} positions - Array of frame positions
 * @returns {Array} - Array of line positions
 */
const generateGridLines = (positions: THREE.Vector3[]) => {
  if (!positions || positions.length === 0) return []; // Guard against undefined or empty array
  const lines = [];
  for (let i = 0; i < positions.length; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      // Create a line between two frames if they are close enough
      const distance = new THREE.Vector3()
        .fromArray(positions[i].toArray())
        .distanceTo(new THREE.Vector3().fromArray(positions[j].toArray()));
      if (distance < 3) {
        lines.push([positions[i], positions[j]]);
      }
    }
  }
  return lines;
};

const DynamicGrid = ({
  framePositions,
}: {
  framePositions: THREE.Vector3[];
}) => {
  // Generate grid lines based on frame positions
  const lines = useMemo(
    () => generateGridLines(framePositions),
    [framePositions]
  );

  return (
    <>
      {lines.map(([start, end], index) => (
        <Line
          key={index}
          points={[start, end]} // Start and end points of the line
          color="#8caebd" // Line color
          linewidth={1} // Line thickness
          transparent
          opacity={0.5} // Make lines slightly transparent
          renderOrder={-1} // Ensures lines are rendered behind the frames
          depthWrite={false} // Prevent lines from affecting the depth buffer
        />
      ))}
    </>
  );
};

export default DynamicGrid;
