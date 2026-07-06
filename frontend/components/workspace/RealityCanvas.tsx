"use client";

import { Suspense, useRef, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Stars,
  AdaptiveDpr,
  AdaptiveEvents,
  BakeShadows,
} from "@react-three/drei";
import { EffectComposer, Bloom, ChromaticAberration, Noise, Vignette } from "@react-three/postprocessing";
import { BlendFunction, KernelSize } from "postprocessing";
import { Vector2 } from "three";
import { InfiniteGrid } from "./InfiniteGrid";
import { ParticleField } from "./ParticleField";
import { SceneObjects } from "./SceneObjects";
import { AxesHelper } from "./AxesHelper";
import { useToolStore } from "@/stores/useToolStore";
import { useSimulationStore } from "@/stores/useSimulationStore";
import { useFrame } from "@react-three/fiber";

function SimulationTicker() {
  const { isPlaying, step } = useSimulationStore();
  useFrame((_, delta) => {
    if (isPlaying) step(delta);
  });
  return null;
}

export function RealityCanvas() {
  const { showGrid, showAxes } = useToolStore();

  return (
    <div className="absolute inset-0" style={{ cursor: "crosshair" }}>
      <Canvas
        camera={{ position: [0, 8, 20], fov: 55, near: 0.01, far: 10000 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
          toneMapping: 4, // ACESFilmicToneMapping
          toneMappingExposure: 1.1,
        }}
        dpr={[1, 2]}
        shadows
      >
        {/* Performance adaptations */}
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />

        {/* Scene tick */}
        <SimulationTicker />

        {/* Camera */}
        <OrbitControls
          enablePan
          enableZoom
          enableRotate
          zoomSpeed={0.8}
          panSpeed={0.8}
          rotateSpeed={0.5}
          minDistance={2}
          maxDistance={1000}
          makeDefault
        />

        {/* Lighting */}
        <ambientLight intensity={0.05} />
        <pointLight position={[0, 0, 0]} intensity={2} color="#00A8FF" distance={50} decay={2} />
        <pointLight position={[20, 10, -20]} intensity={1} color="#7B2FFF" distance={60} decay={2} />

        {/* Background stars */}
        <Stars
          radius={300}
          depth={60}
          count={2500}
          factor={1.2}
          saturation={0.05}
          fade
          speed={0.05}
        />

        {/* Particle dust field */}
        <ParticleField />

        {/* Infinite grid */}
        {showGrid && <InfiniteGrid />}

        {/* Axes helper */}
        {showAxes && <AxesHelper />}

        {/* Scene objects */}
        <Suspense fallback={null}>
          <SceneObjects />
        </Suspense>

        {/* Post-processing */}
        <EffectComposer multisampling={4}>
          <Bloom
            intensity={1.2}
            luminanceThreshold={0.15}
            luminanceSmoothing={0.9}
            kernelSize={KernelSize.LARGE}
            mipmapBlur
          />
          <ChromaticAberration
            blendFunction={BlendFunction.NORMAL}
            offset={new Vector2(0.0006, 0.0006)}
            radialModulation={false}
            modulationOffset={0.15}
          />
          <Noise
            premultiply
            blendFunction={BlendFunction.ADD}
            opacity={0.04}
          />
          <Vignette
            eskil={false}
            offset={0.3}
            darkness={0.65}
            blendFunction={BlendFunction.NORMAL}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
