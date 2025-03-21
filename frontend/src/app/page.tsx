"use client"; // use client side rendering

import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import EnvironmentSetup from "../scenes/environmentSetup";
import useImages from "../components/hooks/useImages";
import Frames from "../components/artwork/allFrames";

const App = () => {
  const { images, loading } = useImages();
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  if (loading || !isBrowser) return <div>Loading...</div>;

  // Transform images to have the correct type for position and rotation
  const formattedImages = images.map((img) => ({
    ...img,
    position: img.position as [number, number, number],
    rotation: img.rotation as [number, number, number],
  }));

  return (
    <div className="h-screen w-full flex items-center justify-center">
      <Canvas
        style={{ width: "100%", height: "100%" }}
        camera={{ fov: 70, position: [0, 2, 15] }}
        shadows
      >
        <EnvironmentSetup />
        <group position={[0, -1.5, 0]}>
          <Frames images={formattedImages} />
        </group>
      </Canvas>
    </div>
  );
};

export default App;
