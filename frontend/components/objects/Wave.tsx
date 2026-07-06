"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface WaveProps {
  position?: [number, number, number];
  amplitude?: number;
  frequency?: number;
  speed?: number;
  resolution?: number;
  color?: string;
}

export function Wave({
  position = [0, 0, 0],
  amplitude = 0.6,
  frequency = 2,
  speed = 1,
  resolution = 80,
  color = "#A855F7",
}: WaveProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const matRef = useRef<THREE.ShaderMaterial>(null!);
  const timeRef = useRef(0);

  const shader = useMemo(() => {
    return {
      uniforms: {
        uTime: { value: 0 },
        uAmplitude: { value: amplitude },
        uFrequency: { value: frequency },
        uSpeed: { value: speed },
        uColor: { value: new THREE.Color(color) },
        uBaseColor: { value: new THREE.Color("#1a0030") },
      },
      vertexShader: `
        uniform float uTime;
        uniform float uAmplitude;
        uniform float uFrequency;
        uniform float uSpeed;

        varying float vHeight;
        varying vec2 vUv;

        void main() {
          vUv = uv;
          vec3 pos = position;
          float wave1 = sin(pos.x * uFrequency + uTime * uSpeed) * cos(pos.z * uFrequency * 0.8 + uTime * uSpeed * 0.7);
          float wave2 = sin(pos.x * uFrequency * 1.5 - uTime * uSpeed * 1.2) * 0.5;
          float wave3 = cos(pos.z * uFrequency * 1.2 + uTime * uSpeed * 0.9) * 0.3;
          pos.y = (wave1 + wave2 + wave3) * uAmplitude;
          vHeight = pos.y / uAmplitude;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform vec3 uBaseColor;

        varying float vHeight;
        varying vec2 vUv;

        void main() {
          float h = (vHeight + 1.0) * 0.5;
          vec3 col = mix(uBaseColor, uColor, h);
          float glow = pow(abs(vHeight), 1.5) * 0.8;
          col += uColor * glow;
          float edgeFade = 1.0 - smoothstep(0.35, 0.5, length(vUv - 0.5));
          gl_FragColor = vec4(col, edgeFade * 0.85);
        }
      `,
    };
  }, [amplitude, frequency, speed, color]);

  useFrame(({ clock }) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = clock.elapsedTime;
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[8, 8, resolution, resolution]} />
        <shaderMaterial
          ref={matRef}
          uniforms={shader.uniforms}
          vertexShader={shader.vertexShader}
          fragmentShader={shader.fragmentShader}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Wireframe overlay */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[8, 8, resolution / 4, resolution / 4]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
          transparent
          opacity={0.06}
          wireframe
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
