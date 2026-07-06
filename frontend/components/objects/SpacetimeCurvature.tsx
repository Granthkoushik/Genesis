"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface SpacetimeCurvatureProps {
  position?: [number, number, number];
  size?: number;
  divisions?: number;
  curvature?: number;
  massPosition?: [number, number, number];
  color?: string;
}

export function SpacetimeCurvature({
  position = [0, 0, 0],
  size = 10,
  divisions = 24,
  curvature = 2,
  massPosition = [0, 0, 0],
  color = "#00A8FF",
}: SpacetimeCurvatureProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const matRef = useRef<THREE.ShaderMaterial>(null!);

  const shader = useMemo(() => ({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uCurvature: { value: curvature },
      uMassPos: { value: new THREE.Vector3(...massPosition) },
      uSize: { value: size },
    },
    vertexShader: `
      uniform float uTime;
      uniform float uCurvature;
      uniform vec3 uMassPos;
      uniform float uSize;

      varying vec3 vPosition;
      varying float vCurvature;

      void main() {
        vec3 pos = position;
        float dx = pos.x - uMassPos.x;
        float dz = pos.z - uMassPos.z;
        float dist = sqrt(dx*dx + dz*dz) + 0.1;
        float dip = -uCurvature / (dist * 0.8 + 1.0);
        pos.y += dip;

        // Subtle ripple
        float ripple = sin(dist * 2.0 - uTime * 1.5) * 0.04 * (1.0 / (dist * 0.5 + 1.0));
        pos.y += ripple;

        vPosition = pos;
        vCurvature = abs(dip) / uCurvature;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      varying vec3 vPosition;
      varying float vCurvature;

      void main() {
        vec3 col = uColor * (0.4 + vCurvature * 0.8);
        float alpha = 0.55 + vCurvature * 0.3;
        gl_FragColor = vec4(col, alpha);
      }
    `,
  }), [color, curvature, massPosition, size]);

  useFrame(({ clock }) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = clock.elapsedTime;
    }
  });

  return (
    <group position={position}>
      {/* Curved grid surface */}
      <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[size, size, divisions, divisions]} />
        <shaderMaterial
          ref={matRef}
          uniforms={shader.uniforms}
          vertexShader={shader.vertexShader}
          fragmentShader={shader.fragmentShader}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
          wireframe
        />
      </mesh>
    </group>
  );
}
