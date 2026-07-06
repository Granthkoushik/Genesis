"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ParticleSystemProps {
  position?: [number, number, number];
  count?: number;
  spread?: number;
  speed?: number;
  color?: string;
}

export function ParticleSystem({
  position = [0, 0, 0],
  count = 2000,
  spread = 2,
  speed = 0.02,
  color = "#00F5FF",
}: ParticleSystemProps) {
  const pointsRef = useRef<THREE.Points>(null!);

  const { positions, velocities, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const baseColor = new THREE.Color(color);
    const white = new THREE.Color("#ffffff");

    for (let i = 0; i < count; i++) {
      const r = (Math.random() - 0.5) * spread * 2;
      positions[i * 3]     = (Math.random() - 0.5) * spread;
      positions[i * 3 + 1] = (Math.random() - 0.5) * spread;
      positions[i * 3 + 2] = (Math.random() - 0.5) * spread;

      // Random drift velocity
      velocities[i * 3]     = (Math.random() - 0.5) * speed;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * speed * 0.5;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * speed;

      const t = Math.random();
      const col = baseColor.clone().lerp(white, t * 0.3);
      colors[i * 3]     = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    return { positions, velocities, colors };
  }, [count, spread, speed, color]);

  const positionArray = useMemo(() => Float32Array.from(positions), [positions]);

  useFrame(() => {
    if (!pointsRef.current) return;
    const pos = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const half = spread;

    for (let i = 0; i < count; i++) {
      pos[i * 3]     += velocities[i * 3];
      pos[i * 3 + 1] += velocities[i * 3 + 1];
      pos[i * 3 + 2] += velocities[i * 3 + 2];

      // Wrap around bounds
      if (Math.abs(pos[i * 3])     > half) velocities[i * 3]     *= -1;
      if (Math.abs(pos[i * 3 + 1]) > half) velocities[i * 3 + 1] *= -1;
      if (Math.abs(pos[i * 3 + 2]) > half) velocities[i * 3 + 2] *= -1;
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <group position={position}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positionArray, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.04}
          vertexColors
          transparent
          opacity={0.9}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Bounding sphere indicator */}
      <mesh>
        <sphereGeometry args={[spread, 8, 8]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.2}
          transparent
          opacity={0.02}
          wireframe
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
