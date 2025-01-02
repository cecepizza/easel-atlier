"use client"; // use client side rendering

import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import EnvironmentSetup from "../scenes/environmentSetup";
import useImages from "../hooks/useImages";
import Frames from "../components/artwork/allFrames";
import Cityscape from "../scenes/dynamicGrid";

const App = () => {
  const { images, loading } = useImages();
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="h-screen w-full flex items-center justify-center">
      <Canvas
        style={{ height: `${height}px`, width: `${width}px` }} // set canvas size to match window size
        camera={{ fov: 70, position: [0, 2, 15] }}
        shadows
      >
        <EnvironmentSetup />
        <group position={[0, -1.5, 0]}>
          <Frames images={images} />
        </group>
      </Canvas>
    </div>
  );
};

export default App;
