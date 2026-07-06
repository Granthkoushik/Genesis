"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface GalaxyProps {
  position?: [number, number, number];
  arms?: number;
  particleCount?: number;
  radius?: number;
  rotationSpeed?: number;
  color1?: string;
  color2?: string;
}

export function Galaxy({
  position = [0, 0, 0],
  arms = 4,
  particleCount = 8000,
  radius = 4,
  rotationSpeed = 0.04,
  color1 = "#7B2FFF",
  color2 = "#00A8FF",
}: GalaxyProps) {
  const pointsRef = useRef<THREE.Points>(null!);

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const c1 = new THREE.Color(color1);
    const c2 = new THREE.Color(color2);
    const white = new THREE.Color("#ffffff");

    for (let i = 0; i < particleCount; i++) {
      const arm = Math.floor(Math.random() * arms);
      const armAngle = (arm / arms) * Math.PI * 2;
      const t = Math.random();
      const r = Math.pow(t, 0.7) * radius;

      // Spiral angle with random offset
      const angle = armAngle + r * 0.6 + (Math.random() - 0.5) * 0.5;

      // Gaussian scatter from arm
      const scatter = Math.random() * 0.4 * (1 - t);
      const scatterAngle = Math.random() * Math.PI * 2;
      const scatterR = scatter;

      positions[i * 3]     = Math.cos(angle) * r + Math.cos(scatterAngle) * scatterR;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 0.2 * (1 - t);
      positions[i * 3 + 2] = Math.sin(angle) * r + Math.sin(scatterAngle) * scatterR;

      // Color gradient: white core → color1 → color2 outer
      const col = t < 0.2
        ? white.clone().lerp(c1, t / 0.2)
        : t < 0.6
        ? c1.clone().lerp(c2, (t - 0.2) / 0.4)
        : c2;

      colors[i * 3]     = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    return { positions, colors };
  }, [particleCount, arms, radius, color1, color2]);

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = clock.elapsedTime * rotationSpeed;
    }
  });

  return (
    <group position={position}>
      {/* Galaxy core glow */}
      <mesh>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial
          color={color1}
          emissive={color1}
          emissiveIntensity={4}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Galaxy particles */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
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

      {/* Halo glow */}
      <mesh>
        <sphereGeometry args={[radius * 0.8, 16, 16]} />
        <meshStandardMaterial
          color={color2}
          emissive={color2}
          emissiveIntensity={0.1}
          transparent
          opacity={0.05}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}
