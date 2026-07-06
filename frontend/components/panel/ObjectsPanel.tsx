"use client";

import { motion } from "framer-motion";
import { useSceneStore } from "@/stores/useSceneStore";
import {
  Compass, Disc, Star, Atom, GitBranch,
  Activity, BarChart2, Grid3X3
} from "lucide-react";
import type { ObjectType } from "@/types/genesis";
import { cn } from "@/lib/utils";

interface RegistryItem {
  type: ObjectType;
  label: string;
  icon: React.ReactNode;
  color: string;
}

const REGISTRY: RegistryItem[] = [
  {
    type: "galaxy",
    label: "Galaxy",
    icon: <Compass size={18} />,
    color: "#7B2FFF",
  },
  {
    type: "blackhole",
    label: "Black Hole",
    icon: <Disc size={18} />,
    color: "#00A8FF",
  },
  {
    type: "star",
    label: "Star",
    icon: <Star size={18} />,
    color: "#FFD700",
  },
  {
    type: "particle",
    label: "Particle",
    icon: <Atom size={18} />,
    color: "#00F5FF",
  },
  {
    type: "nebula", // acts as Timeline in our registry mapping
    label: "Timeline",
    icon: <GitBranch size={18} />,
    color: "#A855F7",
  },
  {
    type: "field",
    label: "Field",
    icon: <Activity size={18} />,
    color: "#00A8FF",
  },
  {
    type: "wave",
    label: "Wave",
    icon: <BarChart2 size={18} />,
    color: "#7B2FFF",
  },
  {
    type: "grid",
    label: "Grid",
    icon: <Grid3X3 size={18} />,
    color: "#00F5FF",
  },
];

export function ObjectsPanel() {
  const { addObject, objects } = useSceneStore();

  const handleAdd = (type: ObjectType) => {
    const spreadX = (Math.random() - 0.5) * 8;
    const spreadZ = (Math.random() - 0.5) * 8;
    addObject({
      type,
      position: { x: spreadX, y: 0.2, z: spreadZ },
      label: `${type.charAt(0).toUpperCase() + type.slice(1)} ${objects.length + 1}`,
    });
  };

  return (
    <div className="p-4 flex flex-col gap-3">
      {/* Section label */}
      <div className="text-[10px] font-semibold tracking-widest text-white/50 uppercase font-sans">
        OBJECTS IN REALITY
      </div>

      {/* 4x2 Object Grid */}
      <div className="grid grid-cols-4 gap-2">
        {REGISTRY.map((item) => {
          // Count active instances in the scene
          const count = objects.filter((o) => o.type === item.type).length;

          return (
            <motion.button
              key={item.label}
              onClick={() => handleAdd(item.type)}
              className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-white/[0.05] bg-black/40 hover:bg-white/[0.03] transition-all relative group cursor-pointer select-none min-h-[64px]"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                boxShadow: "inset 0 1px 1px rgba(255,255,255,0.02)",
              }}
            >
              {/* Active count badge */}
              {count > 0 && (
                <div className="absolute top-1.5 right-1.5 w-3.5 h-3.5 rounded-full bg-neon-blue flex items-center justify-center text-[7px] font-bold text-white shadow-[0_0_6px_rgba(0,168,255,0.5)]">
                  {count}
                </div>
              )}

              {/* Icon Container with subtle radial glow */}
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center mb-1.5 relative"
                style={{
                  background: `${item.color}08`,
                  border: `1px solid ${item.color}18`,
                }}
              >
                <div
                  className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity blur-sm"
                  style={{ background: `${item.color}25` }}
                />
                <span style={{ color: item.color }} className="relative z-10">
                  {item.icon}
                </span>
              </div>

              {/* Label */}
              <span className="text-[9px] font-semibold text-white/40 group-hover:text-white/70 transition-colors uppercase tracking-wider font-sans">
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Add New Object button */}
      <button
        onClick={() => handleAdd("star")}
        className="w-full mt-1.5 py-2.5 rounded-xl border border-dashed border-neon-purple/40 hover:border-neon-purple text-neon-purple hover:text-white bg-neon-purple/[0.02] hover:bg-neon-purple/10 text-[9px] font-bold tracking-widest uppercase transition-all duration-300 shadow-[0_0_8px_rgba(168,85,247,0.05)] cursor-pointer"
      >
        + ADD NEW OBJECT
      </button>
    </div>
  );
}
