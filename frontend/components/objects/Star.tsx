"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface StarProps {
  position?: [number, number, number];
  radius?: number;
  color?: string;
  temperature?: number;
}

export function Star({
  position = [0, 0, 0],
  radius = 0.5,
  color = "#FFD700",
}: StarProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const coronaRef = useRef<THREE.Mesh>(null!);
  const flareRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const pulse = 1 + 0.04 * Math.sin(t * 2.3);
    const pulse2 = 1 + 0.06 * Math.sin(t * 1.7 + 1.2);
    const pulse3 = 1 + 0.1 * Math.sin(t * 1.1 + 2.4);

    if (meshRef.current) meshRef.current.scale.setScalar(pulse);
    if (coronaRef.current) coronaRef.current.scale.setScalar(pulse2);
    if (flareRef.current) {
      flareRef.current.scale.setScalar(pulse3);
      flareRef.current.rotation.y = t * 0.15;
      flareRef.current.rotation.z = t * 0.08;
    }
  });

  return (
    <group position={position}>
      {/* Core */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={3}
          roughness={0.4}
          metalness={0}
        />
      </mesh>

      {/* Corona layer 1 */}
      <mesh ref={coronaRef}>
        <sphereGeometry args={[radius * 1.25, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.5}
          transparent
          opacity={0.15}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {/* Corona layer 2 */}
      <mesh ref={flareRef}>
        <sphereGeometry args={[radius * 1.7, 8, 8]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.6}
          transparent
          opacity={0.06}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {/* Point light — actual illumination */}
      <pointLight color={color} intensity={8} distance={radius * 30} decay={2} />
    </group>
  );
}
