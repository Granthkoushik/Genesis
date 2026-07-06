"use client";

import { useRef } from "react";
import * as THREE from "three";

export function AxesHelper() {
  return (
    <group position={[-8, 0.02, 8]}>
      {/* X axis — red */}
      <Axis direction={[1, 0, 0]} color="#FF4466" label="X" />
      {/* Y axis — neon blue */}
      <Axis direction={[0, 1, 0]} color="#00A8FF" label="Y" />
      {/* Z axis — neon cyan */}
      <Axis direction={[0, 0, -1]} color="#00F5FF" label="Z" />
    </group>
  );
}

function Axis({
  direction,
  color,
  label,
}: {
  direction: [number, number, number];
  color: string;
  label: string;
}) {
  const dir = new THREE.Vector3(...direction);
  const length = 1.2;
  const start = new THREE.Vector3(0, 0, 0);
  const end = dir.clone().multiplyScalar(length);

  const line = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([start, end]),
    new THREE.LineBasicMaterial({ color, linewidth: 2 })
  );

  return (
    <group>
      <primitive object={line} />
    </group>
  );
}
