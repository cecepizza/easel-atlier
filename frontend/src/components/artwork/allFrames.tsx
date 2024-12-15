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
  q = new THREE.Quaternion(), // for rotation
  p = new THREE.Vector3(), // for position
}) {
  const ref = useRef<THREE.Group>(null);
  const clicked = useRef<THREE.Object3D | null>(null);
  const [, params] = useRoute("/item/:id"); // get route parameters
  console.log(params);
  const [, setLocation] = useLocation(); // navigation handler

  // handle frame selection and camera movement
  useEffect(() => {
    if (!ref.current) return;
    if (params?.id) {
      clicked.current = ref.current.getObjectByName(params?.id || "");
    } else {
      clicked.current = null;
    }
    // update camera position when frame is selected
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
  });

  // animate camera movement
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
