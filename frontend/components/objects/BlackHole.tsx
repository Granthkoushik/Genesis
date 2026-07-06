"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface BlackHoleProps {
  position?: [number, number, number];
  mass?: number;
  accretionRadius?: number;
  color?: string;
}

export function BlackHole({
  position = [0, 0, 0],
  accretionRadius = 2,
  color = "#00A8FF",
}: BlackHoleProps) {
  const diskRef = useRef<THREE.Mesh>(null!);
  const ringRef = useRef<THREE.Mesh>(null!);
  const innerRingRef = useRef<THREE.Mesh>(null!);
  const heatRef = useRef<THREE.Points>(null!);

  // Accretion disk particles
  const diskParticles = useMemo(() => {
    const count = 3000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    const hot = new THREE.Color("#FF8C00");
    const cold = new THREE.Color(color);
    const white = new THREE.Color("#FFEECC");

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = accretionRadius * 0.7 + Math.random() * accretionRadius * 0.8;
      const scatter = (Math.random() - 0.5) * 0.08;

      positions[i * 3]     = Math.cos(angle) * r;
      positions[i * 3 + 1] = scatter;
      positions[i * 3 + 2] = Math.sin(angle) * r;

      const t = (r - accretionRadius * 0.7) / (accretionRadius * 0.8);
      const col = t < 0.3
        ? white.clone().lerp(hot, t / 0.3)
        : hot.clone().lerp(cold, (t - 0.3) / 0.7);

      colors[i * 3]     = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
      sizes[i] = 0.03 + Math.random() * 0.06;
    }

    return { positions, colors, sizes };
  }, [accretionRadius, color]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (diskRef.current) diskRef.current.rotation.y = t * 0.5;
    if (ringRef.current) ringRef.current.rotation.y = -t * 0.3;
    if (innerRingRef.current) innerRingRef.current.rotation.y = t * 1.2;
    if (heatRef.current) heatRef.current.rotation.y = t * 0.4;
  });

  return (
    <group position={position}>
      {/* Event horizon — pure black sphere */}
      <mesh>
        <sphereGeometry args={[accretionRadius * 0.35, 32, 32]} />
        <meshStandardMaterial color="#000000" roughness={1} metalness={0} />
      </mesh>

      {/* Photon sphere glow */}
      <mesh>
        <sphereGeometry args={[accretionRadius * 0.4, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={2}
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Accretion disk — torus geometry */}
      <mesh ref={diskRef} rotation={[Math.PI / 8, 0, 0]}>
        <torusGeometry args={[accretionRadius * 1.1, accretionRadius * 0.3, 6, 80]} />
        <meshStandardMaterial
          color="#FF6600"
          emissive="#FF4400"
          emissiveIntensity={1.5}
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Inner ring */}
      <mesh ref={innerRingRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[accretionRadius * 0.5, 0.04, 4, 64]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={3}
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Outer photon ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 2.2, 0, 0]}>
        <torusGeometry args={[accretionRadius * 0.42, 0.02, 4, 64]} />
        <meshStandardMaterial
          color="#FFFFFF"
          emissive="#FFFFFF"
          emissiveIntensity={5}
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Heat particles */}
      <points ref={heatRef} rotation={[Math.PI / 8, 0, 0]}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[diskParticles.positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[diskParticles.colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.04}
          vertexColors
          transparent
          opacity={0.85}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Gravitational lensing halo */}
      <mesh>
        <sphereGeometry args={[accretionRadius * 1.8, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
          transparent
          opacity={0.03}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
