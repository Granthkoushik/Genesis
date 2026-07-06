"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface FieldProps {
  position?: [number, number, number];
  strength?: number;
  lineCount?: number;
  range?: number;
  color?: string;
}

export function Field({
  position = [0, 0, 0],
  strength = 1,
  lineCount = 24,
  range = 4,
  color = "#00A8FF",
}: FieldProps) {
  const groupRef = useRef<THREE.Group>(null!);

  const linePositions = useMemo(() => {
    const lines: Float32Array[] = [];

    for (let i = 0; i < lineCount; i++) {
      const theta = (i / lineCount) * Math.PI * 2;
      const points: number[] = [];
      const steps = 40;

      for (let j = 0; j <= steps; j++) {
        const t = j / steps;
        const r = range * Math.pow(t, 0.5);
        const angle = theta + t * 2 * Math.PI * 0.25 * strength;
        const x = Math.cos(angle) * r;
        const y = (t - 0.5) * range * 0.4 * strength;
        const z = Math.sin(angle) * r;
        points.push(x, y, z);
      }

      lines.push(new Float32Array(points));
    }

    return lines;
  }, [lineCount, range, strength]);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.elapsedTime * 0.08;
      groupRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.05) * 0.05;
    }
  });

  return (
    <group position={position} ref={groupRef}>
      {linePositions.map((pts, idx) => {
        const geom = new THREE.BufferGeometry();
        geom.setAttribute("position", new THREE.BufferAttribute(pts, 3));
        const mat = new THREE.LineBasicMaterial({
          color: color,
          transparent: true,
          opacity: 0.4,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });
        const line = new THREE.Line(geom, mat);
        return <primitive key={idx} object={line} />;
      })}

      {/* Central emitter */}
      <mesh>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={4}
        />
      </mesh>
    </group>
  );
}
