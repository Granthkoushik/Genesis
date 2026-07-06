"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";
import { extend } from "@react-three/fiber";

// ─── Infinite Grid Shader ─────────────────────────────────────────────────────

const GridMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor: new THREE.Color("#00A8FF"),
    uAccentColor: new THREE.Color("#7B2FFF"),
    uLineWidth: 0.008,
    uScale: 1.0,
    uFadeRadius: 25.0,
    uOpacity: 0.5,
  },
  /* vertex */
  `
    varying vec3 vWorldPosition;
    varying vec2 vUv;

    void main() {
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPos.xyz;
      vUv = uv;
      gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
  `,
  /* fragment */
  `
    uniform float uTime;
    uniform vec3 uColor;
    uniform vec3 uAccentColor;
    uniform float uLineWidth;
    uniform float uScale;
    uniform float uFadeRadius;
    uniform float uOpacity;

    varying vec3 vWorldPosition;
    varying vec2 vUv;

    float gridLine(vec2 p, float scale, float width) {
      vec2 grid = abs(fract(p * scale - 0.5) - 0.5) / fwidth(p * scale);
      float line = min(grid.x, grid.y);
      return 1.0 - min(line, 1.0);
    }

    void main() {
      vec2 p = vWorldPosition.xz;

      // Major grid (every 1 unit)
      float major = gridLine(p, 1.0, uLineWidth);
      // Minor grid (every 5 units)
      float minor = gridLine(p, 0.2, uLineWidth * 0.5);

      // Distance fade
      float dist = length(vWorldPosition.xz);
      float fade = 1.0 - smoothstep(uFadeRadius * 0.4, uFadeRadius, dist);

      // Pulse animation on major axis
      float axisPulse = 0.5 + 0.5 * sin(uTime * 0.8);
      float xAxis = smoothstep(0.04, 0.0, abs(vWorldPosition.z)) * axisPulse;
      float zAxis = smoothstep(0.04, 0.0, abs(vWorldPosition.x)) * axisPulse;

      vec3 color = mix(uColor, uAccentColor, minor * 0.5);
      float alpha = (major * 0.6 + minor * 0.2) * fade * uOpacity;
      alpha = max(alpha, (xAxis + zAxis) * 0.8 * fade);

      if (alpha < 0.001) discard;

      gl_FragColor = vec4(color, alpha);
    }
  `
);

export function InfiniteGrid() {
  const gridMat = useMemo(() => new GridMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide
  }), []);

  useFrame(({ clock }) => {
    if (gridMat) {
      gridMat.uniforms.uTime.value = clock.elapsedTime;
    }
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
      <planeGeometry args={[200, 200, 1, 1]} />
      <primitive object={gridMat} attach="material" />
    </mesh>
  );
}
