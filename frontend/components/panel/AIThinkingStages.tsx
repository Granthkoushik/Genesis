"use client";

import { motion } from "framer-motion";
import { useAIStore } from "@/stores/useAIStore";
import { Check, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChecklistItem {
  label: string;
  threshold: number;
}

const CHECKLIST: ChecklistItem[] = [
  { label: "Parsing Equation", threshold: 15 },
  { label: "Understanding Physics", threshold: 35 },
  { label: "Deriving Relationships", threshold: 55 },
  { label: "Building Spacetime", threshold: 75 },
  { label: "Calculating Effects", threshold: 90 },
  { label: "Rendering Reality", threshold: 100 },
];

export function AIThinkingStages() {
  const { overallProgress, isBuilding } = useAIStore();

  // If not building and progress is zero, show a default mock state matching the image
  const displayProgress = isBuilding ? overallProgress : 78;
  const activeBuildingState = isBuilding;

  return (
    <div className="px-4 pb-4 flex flex-col gap-3">
      {/* Section label */}
      <div className="text-[10px] font-semibold tracking-widest text-white/50 uppercase font-sans">
        AI STATUS
      </div>

      <div className="grid grid-cols-[1.4fr_1fr] gap-2 items-center glass rounded-xl border border-white/[0.06] bg-black/40 p-4 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
        {/* Left Side: checklist */}
        <div className="flex flex-col gap-2">
          {CHECKLIST.map((item, idx) => {
            // Determine status
            let status: "complete" | "active" | "pending" = "pending";
            
            if (displayProgress >= item.threshold) {
              status = "complete";
            } else if (
              displayProgress < item.threshold &&
              (idx === 0 || displayProgress >= CHECKLIST[idx - 1].threshold)
            ) {
              status = "active";
            }

            return (
              <div key={item.label} className="flex items-center gap-2 select-none">
                {/* Custom checkmark wrapper */}
                <div className="flex-shrink-0">
                  {status === "complete" ? (
                    <div className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center">
                      <Check size={9} className="text-emerald-400 stroke-[3]" />
                    </div>
                  ) : status === "active" ? (
                    <div className="w-4 h-4 rounded-full bg-neon-blue/20 border border-neon-cyan flex items-center justify-center shadow-[0_0_8px_rgba(0,245,255,0.5)]">
                      <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse" />
                    </div>
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-white/10 flex items-center justify-center">
                      <Circle size={8} className="text-white/10" />
                    </div>
                  )}
                </div>

                {/* Text Label */}
                <span
                  className={cn(
                    "text-[10px] font-medium tracking-wide font-sans",
                    status === "complete"
                      ? "text-white/60 line-through decoration-white/10"
                      : status === "active"
                      ? "text-neon-cyan font-semibold"
                      : "text-white/20"
                  )}
                >
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Right Side: Circular HUD Dial */}
        <div className="flex flex-col items-center justify-center relative">
          <div className="relative w-24 h-24 flex items-center justify-center">
            {/* Concentric rotating outer arcs */}
            <motion.div
              className="absolute inset-0 border-2 border-dashed border-neon-cyan/20 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute inset-1.5 border border-dashed border-neon-blue/40 rounded-full"
              animate={{ rotate: -360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />

            {/* Glowing progress arc */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                className="stroke-white/[0.04]"
                strokeWidth="2.5"
                fill="transparent"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="40"
                className="stroke-neon-cyan"
                strokeWidth="3.5"
                fill="transparent"
                strokeDasharray="251.2"
                animate={{
                  strokeDashoffset: 251.2 - (251.2 * displayProgress) / 100,
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                style={{
                  filter: "drop-shadow(0px 0px 4px rgba(0, 245, 255, 0.6))",
                  strokeLinecap: "round"
                }}
              />
            </svg>

            {/* Center HUD status info */}
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-[16px] font-bold font-mono text-white tracking-tighter glow-blue">
                {displayProgress}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
