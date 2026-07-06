"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSceneStore } from "@/stores/useSceneStore";
import { Pencil, Check, X } from "lucide-react";
import type { Variable } from "@/types/genesis";
import { cn } from "@/lib/utils";

export function VariableEditor() {
  const { variables, updateVariable } = useSceneStore();

  const defaultMockVariables: Variable[] = [
    { id: "v1", symbol: "G", name: "Gravitational Const.", value: 6.674e-11, unit: "m³/kg/s²", latex: "G", editable: true },
    { id: "v2", symbol: "Λ", name: "Cosmological Const.", value: 1.105e-52, unit: "m⁻²", latex: "\\Lambda", editable: true },
    { id: "v3", symbol: "c", name: "Speed of Light", value: 2.998e8, unit: "m/s", latex: "c", editable: true },
  ];

  const listToRender = variables.length > 0 ? variables : defaultMockVariables;

  return (
    <div className="p-4 flex flex-col gap-3">
      {/* Section label */}
      <div className="text-[10px] font-semibold tracking-widest text-white/50 uppercase font-sans">
        VARIABLES & CONSTANTS
      </div>

      {/* Variables Grid list */}
      <div className="flex flex-col gap-1.5">
        {listToRender.map((v) => (
          <VariableRow key={v.id} variable={v} onUpdate={(val) => updateVariable(v.id, val)} />
        ))}
      </div>
    </div>
  );
}

function VariableRow({
  variable,
  onUpdate,
}: {
  variable: Variable;
  onUpdate: (val: number) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(variable.value.toString());

  const handleSave = () => {
    const num = parseFloat(draft);
    if (!isNaN(num)) onUpdate(num);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setDraft(variable.value.toString());
    setIsEditing(false);
  };

  return (
    <div className="flex items-center gap-3 p-1.5 glass rounded-xl border border-white/[0.06] bg-black/30 w-full justify-between select-none">
      {/* 1. Symbol Box */}
      <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-xs font-bold font-mono text-neon-cyan/95 flex-shrink-0">
        {variable.symbol}
      </div>

      {/* 2. Variable Name */}
      <div className="flex-1 min-w-0 text-left pl-1">
        <div className="text-[10px] font-medium text-white/45 font-sans leading-tight truncate">
          {variable.name}
        </div>
      </div>

      {/* 3. Value & Editing Box */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <AnimatePresence mode="wait">
          {isEditing ? (
            <motion.div
              key="editing"
              className="flex items-center gap-1.5 bg-black/50 border border-neon-blue/30 rounded-lg p-0.5"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <input
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                className="w-24 bg-transparent text-[11px] font-mono text-white outline-none text-right px-1"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSave();
                  if (e.key === "Escape") handleCancel();
                }}
              />
              <button onClick={handleSave} className="text-neon-cyan hover:scale-105 transition-transform p-0.5 cursor-pointer">
                <Check size={11} />
              </button>
              <button onClick={handleCancel} className="text-red-400 hover:scale-105 transition-transform p-0.5 cursor-pointer">
                <X size={11} />
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="display"
              className="flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {/* Value box */}
              <div className="px-2.5 py-1 rounded-md bg-black/40 border border-white/[0.05] min-w-[90px] text-right">
                <span className="text-[10px] font-mono font-medium text-white/90">
                  {formatValue(variable.value)}
                </span>
              </div>
              
              {/* Unit */}
              <span className="text-[8px] font-medium text-white/30 font-sans tracking-wide min-w-[45px] text-left truncate">
                {variable.unit}
              </span>

              {/* Edit Action */}
              {variable.editable && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-6 h-6 rounded flex items-center justify-center text-white/20 hover:text-neon-cyan hover:bg-white/[0.04] transition-all cursor-pointer"
                  title="Modify Parameter"
                >
                  <Pencil size={11} />
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function formatValue(v: number): string {
  if (v === 0) return "0";
  const abs = Math.abs(v);
  
  if (abs >= 1e6 || abs < 0.001) {
    const exp = Math.floor(Math.log10(abs));
    const coef = (v / Math.pow(10, exp)).toFixed(3);
    return `${coef} × 10${getSuperscript(exp)}`;
  }
  return v.toFixed(3).replace(/\.?0+$/, "");
}

function getSuperscript(num: number): string {
  const superscripts: Record<string, string> = {
    "-": "⁻", "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴",
    "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹"
  };
  return num
    .toString()
    .split("")
    .map(c => superscripts[c] || c)
    .join("");
}
