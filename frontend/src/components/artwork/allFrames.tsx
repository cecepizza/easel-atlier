// frames component manages the collection of image frames
import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useRoute, useLocation } from "wouter";
import { easing } from "maath";
import Frame from "./frame";
import * as THREE from "three";

const GOLDENRATIO = 1.61803398875;

export default function Frames({
  images,
  q = new THREE.Quaternion(),
  p = new THREE.Vector3(),
}) {
  const ref = useRef<THREE.Group>(null);
  const clicked = useRef<THREE.Object3D | null>(null);

  // params contains the route parameters - in this case the 'id' from the URL path '/item/:id'
  // e.g. if URL is '/item/123', then params would be { id: '123' }
  const [, routeParams] = useRoute<{ id: string }>("/item/:id");
  const [, setLocation] = useLocation(); // navigation handler

  useEffect(() => {
    if (!ref.current) return;
    clicked.current = routeParams?.id
      ? ref.current.getObjectByName(routeParams.id)
      : null;

    if (clicked.current) {
      clicked.current.parent?.updateWorldMatrix(true, true);
      clicked.current.parent?.localToWorld(
        p.set(0, GOLDENRATIO / 2 + 0.6, 1.5)
      );
      clicked.current.parent?.getWorldQuaternion(q);
    } else {
      p.set(0, 0, 5.5);
      q.identity();
    }
  }, [routeParams, p, q]);

  useFrame((state, dt) => {
    easing.damp3(state.camera.position, p, 0.4, dt);
    easing.dampQ(state.camera.quaternion, q, 0.4, dt);
  });

  return (
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
      {images.map((props) => (
        <Frame key={props.url} {...props} />
      ))}
    </group>
  );
}
