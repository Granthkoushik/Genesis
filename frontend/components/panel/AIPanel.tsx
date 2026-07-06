"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronRight, ChevronLeft, Globe } from "lucide-react";
import { TheoryInput } from "./TheoryInput";
import { AIThinkingStages } from "./AIThinkingStages";
import { VariableEditor } from "./VariableEditor";
import { ObjectsPanel } from "./ObjectsPanel";
import { useAIStore } from "@/stores/useAIStore";
import { cn } from "@/lib/utils";

export function AIPanel() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.div
      className="fixed right-0 top-16 bottom-0 z-35 flex items-stretch"
      initial={{ x: 380, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 280, damping: 28, delay: 0.4 }}
    >
      {/* Collapse toggle tab */}
      <div className="flex items-center pr-1">
        <motion.button
          className="w-5 h-16 glass rounded-l-xl border border-r-0 border-white/[0.07] flex items-center justify-center text-white/30 hover:text-white/70 transition-colors cursor-pointer"
          onClick={() => setCollapsed(!collapsed)}
          whileTap={{ scale: 0.95 }}
        >
          {collapsed ? <ChevronLeft size={10} /> : <ChevronRight size={10} />}
        </motion.button>
      </div>

      {/* Main Panel Column */}
      <AnimatePresence mode="wait">
        {!collapsed && (
          <motion.div
            className="w-[360px] flex flex-col border-l border-white/[0.05] overflow-hidden"
            style={{
              background: "rgba(3, 3, 8, 0.92)",
              backdropFilter: "blur(25px)",
            }}
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 360, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Scrollable contents feed containing all stacked widgets */}
            <div className="flex-1 overflow-y-auto pr-0.5 custom-scrollbar py-2 flex flex-col gap-2.5">
              {/* 1. Theory & Equation input */}
              <TheoryInput />

              {/* 2. Reasoning status dial & checklist */}
              <AIThinkingStages />

              {/* 3. Live Variables & Constants grid */}
              <VariableEditor />

              {/* 4. Predefined Objects 4x2 creator Grid */}
              <ObjectsPanel />
            </div>

            {/* Panel footer containing the Connected badge */}
            <div className="p-4 border-t border-white/[0.05] bg-black/40 flex items-center justify-end">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neon-blue/[0.03] border border-neon-blue/20 shadow-[0_0_12px_rgba(0,168,255,0.08)] select-none">
                <div className="relative flex items-center justify-center">
                  <span className="absolute w-2 h-2 rounded-full bg-neon-cyan animate-ping opacity-75" />
                  <Globe size={13} className="text-neon-cyan relative z-10 animate-spin-slow" />
                </div>
                <span className="text-[9px] font-bold tracking-widest text-neon-cyan uppercase font-sans">
                  CONNECTED TO REALITY ENGINE
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
