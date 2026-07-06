"use client";

import { Suspense } from "react";
import { Html } from "@react-three/drei";
import { useSceneStore } from "@/stores/useSceneStore";
import { useToolStore } from "@/stores/useToolStore";
import { Galaxy } from "@/components/objects/Galaxy";
import { BlackHole } from "@/components/objects/BlackHole";
import { Star } from "@/components/objects/Star";
import { ParticleSystem } from "@/components/objects/ParticleSystem";
import { Field } from "@/components/objects/Field";
import { Wave } from "@/components/objects/Wave";
import { SpacetimeCurvature } from "@/components/objects/SpacetimeCurvature";
import { ThreeEvent } from "@react-three/fiber";
import type { SceneObject } from "@/types/genesis";

export function SceneObjects() {
  const { objects, selectObject, deselectAll } = useSceneStore();
  const { activeTool, showLabels } = useToolStore();

  const handleObjectClick = (e: ThreeEvent<MouseEvent>, id: string) => {
    e.stopPropagation();
    if (activeTool === "select" || activeTool === "move") {
      selectObject(id, e.shiftKey);
    }
  };

  const handleMissedClick = () => {
    deselectAll();
  };

  return (
    <group onClick={handleMissedClick}>
      {objects.map((obj) => (
        <ObjectWrapper
          key={obj.id}
          obj={obj}
          showLabel={showLabels}
          onClick={(e) => handleObjectClick(e, obj.id)}
        />
      ))}
    </group>
  );
}

function ObjectWrapper({
  obj,
  showLabel,
  onClick,
}: {
  obj: SceneObject;
  showLabel: boolean;
  onClick: (e: ThreeEvent<MouseEvent>) => void;
}) {
  if (!obj.visible) return null;

  const pos: [number, number, number] = [obj.position.x, obj.position.y, obj.position.z];

  return (
    <group
      position={pos}
      scale={[obj.scale.x, obj.scale.y, obj.scale.z]}
      onClick={onClick}
    >
      {/* Selection ring */}
      {obj.selected && (
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[getObjectRadius(obj) * 1.4, getObjectRadius(obj) * 1.55, 48]} />
          <meshBasicMaterial color="#00A8FF" transparent opacity={0.8} depthWrite={false} />
        </mesh>
      )}

      {/* Object renderer */}
      <ObjectRenderer obj={obj} />

      {/* callout label overlay matching user dashboard callout lines */}
      {showLabel && (
        <ObjectCallout obj={obj} />
      )}
    </group>
  );
}

function ObjectRenderer({ obj }: { obj: SceneObject }) {
  const { variables } = useSceneStore();
  const p = { ...obj.properties };

  // Local helper to read active variable values mapped by symbol
  const getVal = (symbol: string, fallback: number): number => {
    const v = variables.find(
      (x) =>
        x.symbol.toLowerCase() === symbol.toLowerCase() ||
        x.latex.toLowerCase() === symbol.toLowerCase()
    );
    return v ? v.value : fallback;
  };

  switch (obj.type) {
    case "galaxy": {
      const arms = getVal("arms", Number(p.arms ?? 4));
      const radius = getVal("r", Number(p.radius ?? 4));
      const h0 = variables.find((x) => x.symbol === "H₀");
      const rotationSpeed = h0 
        ? (h0.value / 67.4) * 0.04 
        : getVal("omega", Number(p.rotationSpeed ?? 0.04));

      return (
        <Galaxy
          arms={arms}
          particleCount={Number(p.particleCount ?? 8000)}
          radius={radius}
          rotationSpeed={rotationSpeed}
          color1={obj.color}
          color2={obj.emissiveColor}
        />
      );
    }

    case "blackhole": {
      let accretionRadius = Number(p.accretionRadius ?? 2);
      const G = variables.find((x) => x.symbol === "G");
      const M = variables.find((x) => x.symbol === "M" || x.symbol === "m");
      const c = variables.find((x) => x.symbol === "c");
      
      // Calculate Schwarzschild radius rs = 2GM/c^2 dynamically
      if (G && M && c) {
        const rs = (2 * G.value * M.value) / (c.value ** 2);
        accretionRadius = (rs / 1485) * 2.5; // Visually normalized scale
      } else {
        // Direct scaling helper if G/c constants are not extracted
        const massVar = variables.find((x) => x.symbol.toLowerCase() === "m");
        if (massVar) {
          accretionRadius = (massVar.value / 1e30) * 2.5;
        }
      }

      return (
        <BlackHole
          accretionRadius={accretionRadius}
          color={obj.emissiveColor}
        />
      );
    }

    case "star": {
      const radius = getVal("r", Number(p.radius ?? 0.5));
      const temperature = getVal("T", Number(p.temperature ?? 5778));
      return (
        <Star
          radius={radius}
          color={obj.color}
          temperature={temperature}
        />
      );
    }

    case "particle": {
      const spread = getVal("r", Number(p.spread ?? 2));
      const speed = getVal("v", Number(p.speed ?? 0.02));
      return (
        <ParticleSystem
          count={Number(p.count ?? 2000)}
          spread={spread}
          speed={speed}
          color={obj.emissiveColor}
        />
      );
    }

    case "field": {
      const strength = getVal("E", getVal("B", Number(p.strength ?? 1)));
      const range = getVal("r", Number(p.range ?? 4));
      return (
        <Field
          strength={strength}
          lineCount={Number(p.lineCount ?? 24)}
          range={range}
          color={obj.emissiveColor}
        />
      );
    }

    case "wave": {
      const amplitude = getVal("A", Number(p.amplitude ?? 0.6));
      const frequency = getVal("omega", getVal("f", Number(p.frequency ?? 2)));
      const speed = getVal("v", getVal("c", Number(p.speed ?? 1)));
      return (
        <Wave
          amplitude={amplitude}
          frequency={frequency}
          speed={speed}
          resolution={Number(p.resolution ?? 80)}
          color={obj.emissiveColor}
        />
      );
    }

    case "grid":
    case "nebula": {
      const size = getVal("size", Number(p.size ?? 10));
      const G = variables.find((x) => x.symbol === "G");
      const M = variables.find((x) => x.symbol === "M" || x.symbol === "m");
      
      // Spacetime curvature warps dynamically based on central mass gravity well
      const curvature = (G && M) 
        ? (G.value * M.value / 1.33e20) * 1.5 
        : getVal("curvature", Number(p.curvature ?? 0));

      return (
        <SpacetimeCurvature
          size={size}
          divisions={Number(p.divisions ?? 24)}
          curvature={curvature}
          color={obj.emissiveColor}
        />
      );
    }

    default:
      return (
        <mesh>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial color={obj.color} emissive={obj.emissiveColor} emissiveIntensity={2} />
        </mesh>
      );
  }
}

function getObjectRadius(obj: SceneObject): number {
  const p = obj.properties;
  switch (obj.type) {
    case "galaxy": return Number(p.radius ?? 4);
    case "blackhole": return Number(p.accretionRadius ?? 2) * 1.3;
    case "star": return Number(p.radius ?? 0.5) * 2;
    case "particle": return Number(p.spread ?? 2);
    case "field": return Number(p.range ?? 4);
    case "wave": return 4;
    default: return 1;
  }
}

function ObjectCallout({ obj }: { obj: SceneObject }) {
  const radius = getObjectRadius(obj);
  
  // Custom offsets and texts matching the user image
  let position: [number, number, number] = [0, radius * 1.5, 0];
  let title = "SYSTEM NODE";
  let symbol = obj.label;
  let layout: "top-left" | "top-right" | "badge" | "hide" = "badge";

  if (obj.type === "galaxy") {
    // MASS ENERGY callout (positioned top-left, pointing down-right to object)
    position = [-radius * 1.4, radius * 1.2, 0];
    title = "MASS ENERGY";
    symbol = "T_μν";
    layout = "top-left";
  } else if (obj.type === "grid") {
    // SPACETIME CURVATURE callout (positioned top-left, pointing down-right to object)
    position = [-radius * 1.1, radius * 0.7, 0];
    title = "SPACETIME CURVATURE";
    symbol = "G_μν";
    layout = "top-left";
  } else if (obj.type === "star") {
    // COSMOLOGICAL CONSTANT callout (positioned top-right, pointing down-left to object)
    position = [radius * 1.4, radius * 1.2, 0];
    title = "COSMOLOGICAL CONSTANT";
    symbol = "Λg_μν";
    layout = "top-right";
  } else if (obj.type === "particle") {
    // TIMELINE badge (like TIMELINE A)
    position = [radius * 1.4, radius * 0.9, 0];
    title = obj.label.includes("copy") || obj.label.includes("2") ? "TIMELINE B" : "TIMELINE A";
    layout = "badge";
  } else {
    // Hide duplicate labels for other nodes (e.g. black hole) to prevent overlapping and match the image layout
    layout = "hide";
  }

  if (layout === "hide") {
    return null;
  }

  if (layout === "badge") {
    return (
      <Html position={position} center distanceFactor={14} occlude={false}>
        <div className="pointer-events-none px-3 py-1 font-bold tracking-widest text-[9px] font-sans text-white uppercase bg-purple-950/60 border border-purple-500/40 rounded shadow-[0_0_10px_rgba(168,85,247,0.2)] whitespace-nowrap">
          {title}
        </div>
      </Html>
    );
  }

  // Draw diagonal callout pointers
  return (
    <Html position={position} center distanceFactor={14} occlude={false}>
      <div className="relative pointer-events-none select-none flex flex-col items-start min-w-[130px]">
        {/* Header Title */}
        <div className="text-[9px] font-bold tracking-[0.2em] text-cyan-400 font-sans whitespace-nowrap drop-shadow-[0_0_6px_rgba(34,211,238,0.2)]">
          {title}
        </div>

        {/* Math Symbol */}
        <div className="text-lg font-serif italic text-white/95 mt-1 border-t border-cyan-400/40 pt-0.5 min-w-[90px]">
          {symbol}
        </div>

        {/* Curved / Diagonal Callout pointer line */}
        {layout === "top-left" ? (
          // Diagonal line pointing down and right towards the center of the object
          <div className="absolute left-[70%] top-[90%] w-[120px] h-[80px] pointer-events-none overflow-visible">
            <svg className="w-full h-full animate-pulse-neon" viewBox="0 0 120 80" fill="none">
              <path
                d="M 0 0 L 60 40 L 90 55"
                stroke="rgb(34, 211, 238)"
                strokeWidth="1.2"
                strokeOpacity="0.6"
              />
              <circle cx="90" cy="55" r="2.5" fill="rgb(34, 211, 238)" fillOpacity="0.9" />
            </svg>
          </div>
        ) : (
          // Diagonal line pointing down and left towards the center of the object
          <div className="absolute right-[70%] top-[90%] w-[120px] h-[80px] pointer-events-none overflow-visible">
            <svg className="w-full h-full animate-pulse-neon" viewBox="0 0 120 80" fill="none">
              <path
                d="M 120 0 L 60 40 L 30 55"
                stroke="rgb(34, 211, 238)"
                strokeWidth="1.2"
                strokeOpacity="0.6"
              />
              <circle cx="30" cy="55" r="2.5" fill="rgb(34, 211, 238)" fillOpacity="0.9" />
            </svg>
          </div>
        )}
      </div>
    </Html>
  );
}
