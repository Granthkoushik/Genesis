"use client";

import { motion } from "framer-motion";
import { useToolStore } from "@/stores/useToolStore";
import {
  MousePointer2, Move, RotateCcw, Maximize2,
  Scissors, Trash2, Ruler, Box
} from "lucide-react";
import type { ToolType } from "@/types/genesis";
import { cn } from "@/lib/utils";

interface ToolDef {
  id: ToolType;
  icon: React.ReactNode;
  label: string;
}

const TOOLS: ToolDef[] = [
  { id: "select",    icon: <MousePointer2 size={16} />, label: "Select" },
  { id: "move",      icon: <Move size={16} />,          label: "Move" },
  { id: "rotate",    icon: <RotateCcw size={16} />,     label: "Rotate" },
  { id: "scale",     icon: <Maximize2 size={16} />,     label: "Scale" },
  { id: "create",    icon: <Box size={16} />,           label: "Add" },
  { id: "split",     icon: <Scissors size={16} />,      label: "Split" },
  { id: "erase",     icon: <Trash2 size={16} />,        label: "Erase" },
  { id: "measure",   icon: <Ruler size={16} />,         label: "Measure" },
];

export function ToolBar() {
  const { activeTool, setTool } = useToolStore();

  return (
    <motion.div
      className="fixed left-4 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-1"
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 24, delay: 0.3 }}
    >
      <div className="glass rounded-xl p-1.5 flex flex-col gap-1 border border-white/[0.06] w-[56px] items-center bg-black/60 backdrop-blur-md">
        {TOOLS.map((tool, i) => {
          const isActive = activeTool === tool.id;
          return (
            <motion.button
              key={tool.id}
              onClick={() => setTool(tool.id)}
              className={cn(
                "w-12 h-12 flex flex-col items-center justify-center rounded-lg transition-all duration-200 cursor-pointer select-none",
                isActive
                  ? "text-neon-cyan bg-neon-blue/10 border border-neon-blue/20"
                  : "text-white/40 hover:text-white/70 hover:bg-white/[0.04] border border-transparent"
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className={cn("transition-transform duration-200", isActive && "scale-110")}>
                {tool.icon}
              </div>
              <span className="text-[8px] font-medium tracking-wide mt-1 uppercase font-sans">
                {tool.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
