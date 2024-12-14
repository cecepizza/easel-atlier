"use client";

import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  useCursor,
  Image,
  Text,
  Environment,
  OrbitControls,
  CameraControls,
  KeyboardControls,
} from "@react-three/drei";
import { useRoute, useLocation } from "wouter";
import { easing } from "maath";
import getUuid from "uuid-by-string";
import { MeshBasicMaterial } from "three";
import envConfig from "../env.config";

const GOLDENRATIO = 1.61803398875;

const pexel = (id: string) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`;
const mockImages = [
  // Front
  { position: [0, 0, 1.5], rotation: [0, 0, 0], url: pexel("1103970") },
  // Back
  { position: [-0.8, 0, -0.6], rotation: [0, 0, 0], url: pexel("416430") },
  { position: [0.8, 0, -0.6], rotation: [0, 0, 0], url: pexel("310452") },
  // Left
  {
    position: [-1.75, 0, 0.25],
    rotation: [0, Math.PI / 2.5, 0],
    url: pexel("327482"),
  },
  {
    position: [-2.15, 0, 1.5],
    rotation: [0, Math.PI / 2.5, 0],
    url: pexel("325185"),
  },
  {
    position: [-2, 0, 2.75],
    rotation: [0, Math.PI / 2.5, 0],
    url: pexel("358574"),
  },
  // Right
  {
    position: [1.75, 0, 0.25],
    rotation: [0, -Math.PI / 2.5, 0],
    url: pexel("227675"),
  },
  {
    position: [2.15, 0, 1.5],
    rotation: [0, -Math.PI / 2.5, 0],
    url: pexel("911738"),
  },
  {
    position: [2, 0, 2.75],
    rotation: [0, -Math.PI / 2.5, 0],
    url: pexel("1738986"),
  },
];

const useImages = () => {
  const [images, setImages] = useState(mockImages);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const response = await fetch(`${envConfig.apiUrl}/artworks`);
        const artworks = await response.json();
        // Transform artworks into the expected format
        const artworkImages = artworks.map((artwork: any, index: number) => ({
          position: mockImages[index % mockImages.length].position,
          rotation: mockImages[index % mockImages.length].rotation,
          url: `${envConfig.apiUrl}/images/${encodeURIComponent(
            artwork.imageURL
          )}`,
          name: artwork.title,
        }));
        setImages(artworkImages);
        console.log(artworkImages);
      } catch (error) {
        console.error("Failed to fetch artworks:", error);
        // Keep using mockImages on error
      } finally {
        setLoading(false);
      }
    };

    fetchArtworks();
  }, []);

  const imagesPlusThree = [...images, ...mockImages.slice(-3)];

  return { images: imagesPlusThree, loading };
};

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
    <div className="h-screen w-full">
      <Canvas
        className="h-[${height}px] w-[${width}px]"
        dpr={[1, 1.5]}
        camera={{ fov: 70, position: [0, 2, 15] }}
      >
        <color attach="background" args={["#191920"]} />
        <fog attach="fog" args={["#191920", 0, 15]} />
        <group position={[0, -0.5, 0]}>
          <Frames images={images} />
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[50, 50]} />
          </mesh>
        </group>
        <Environment preset="city" />
      </Canvas>
    </div>
  );
};

export default App;

function Frames({
  images,
  q = new THREE.Quaternion(),
  p = new THREE.Vector3(),
}) {
  const ref = useRef<THREE.Group>(null);
  const clicked = useRef<THREE.Object3D | null>(null);
  const [, params] = useRoute("/item/:id");
  console.log(params);
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!ref.current) return;
    if (params?.id) {
      clicked.current = ref.current.getObjectByName(params?.id || "");
    } else {
      clicked.current = null;
    }
    if (clicked.current) {
      clicked.current.parent?.updateWorldMatrix(true, true);
      clicked.current.parent?.localToWorld(p.set(0, GOLDENRATIO / 2, 1.25));
      clicked.current.parent?.getWorldQuaternion(q);
    } else {
      p.set(0, 0, 5.5);
      q.identity();
    }
  });

  useFrame((state, dt) => {
    easing.damp3(state.camera.position, p, 0.4, dt);
    easing.dampQ(state.camera.quaternion, q, 0.4, dt);
  });

  console.log(images);

  return (
    <group
      ref={ref}
      onClick={(e) => (
        e.stopPropagation(),
        setLocation(
          clicked.current === e.object ? "/" : "/item/" + e.object.name
        )
      )}
      onPointerMissed={() => setLocation("/")}
    >
      {images.map(
        (props) => <Frame key={props.url} {...props} /> /* prettier-ignore */
      )}
    </group>
  );
}

function Frame({ url, c = new THREE.Color(), ...props }) {
  const image = useRef<THREE.Mesh>(null);
  const frame = useRef<THREE.Mesh>(null);
  const [, params] = useRoute("/item/:id");
  const [hovered, hover] = useState(false);
  const [rnd] = useState(() => Math.random());
  const name = getUuid(url);
  console.log("Name is ", name);
  const isActive = params?.id === name;
  useCursor(hovered);

  useFrame((state, dt) => {
    if (!image.current || !frame.current) return;

    image.current.material.zoom =
      2 + Math.sin(rnd * 10000 + state.clock.elapsedTime / 3) / 2;
    easing.damp3(
      image.current.scale,
      [
        0.85 * (!isActive && hovered ? 0.85 : 1),
        0.9 * (!isActive && hovered ? 0.905 : 1),
        1,
      ],
      0.1,
      dt
    );
    easing.dampC(
      frame.current.material.color,
      hovered ? "orange" : "white",
      0.1,
      dt
    );
  });

  return (
    // this group is the parent of the mesh which we are using for identification
    <group {...props}>
      <mesh
        // this name is used as a unique identifier to focus and manipulate things
        name={name}
        onPointerOver={(e) => (e.stopPropagation(), hover(true))}
        onPointerOut={() => hover(false)}
        scale={[1, GOLDENRATIO, 0.05]}
        position={[0, GOLDENRATIO / 2, 0]}
      >
        <boxGeometry />
        <meshStandardMaterial
          color="#151515"
          metalness={0.5}
          roughness={0.5}
          envMapIntensity={2}
        />
        <mesh
          ref={frame}
          raycast={() => null}
          scale={[0.9, 0.93, 0.9]}
          position={[0, 0, 0.2]}
        >
          <boxGeometry />
          <meshBasicMaterial toneMapped={false} fog={false} />
        </mesh>
        <Image
          raycast={() => null}
          ref={image}
          position={[0, 0, 0.7]}
          url={url}
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
