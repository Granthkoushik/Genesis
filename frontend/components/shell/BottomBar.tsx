"use client";

import { motion } from "framer-motion";
import { useSimulationStore } from "@/stores/useSimulationStore";
import {
  Play, Pause, RotateCcw, FastForward, Clock, Activity,
  Zap, Compass, Disc
} from "lucide-react";
import { formatNumber } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function BottomBar() {
  const {
    isPlaying,
    age,
    timeScale,
    energy,
    matter,
    entropy,
    play,
    pause,
    reset,
    setTimeScale,
  } = useSimulationStore();

  const handleSlow = () => setTimeScale(Math.max(0.1, timeScale * 0.5));
  const handleFast = () => setTimeScale(Math.min(10, timeScale * 2));

  return (
    <>
      {/* 1. Floating Simulation Timeline Controls (Lower-Center) */}
      <div className="fixed bottom-18 left-1/2 -translate-x-1/2 z-30">
        <motion.div
          className="flex items-center gap-5 px-6 py-2 glass rounded-xl border border-white/[0.06] bg-black/60 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.5)]"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 280, damping: 26, delay: 0.15 }}
        >
          <TimelineBtn
            onClick={play}
            isActive={isPlaying}
            icon={<Play size={14} />}
            label="Play"
          />
          <TimelineBtn
            onClick={pause}
            isActive={!isPlaying}
            icon={<Pause size={14} />}
            label="Pause"
          />
          <TimelineBtn
            onClick={reset}
            isActive={false}
            icon={<RotateCcw size={14} />}
            label="Reset"
          />
          <TimelineBtn
            onClick={handleSlow}
            isActive={false}
            icon={<Compass size={14} />}
            label="Slow"
          />
          <TimelineBtn
            onClick={handleFast}
            isActive={false}
            icon={<FastForward size={14} />}
            label="Fast"
          />

          <div className="w-px h-6 bg-white/[0.08]" />

          <button className="flex flex-col items-center gap-1 text-white/40 hover:text-neon-cyan transition-colors cursor-pointer select-none">
            <div className="w-2.5 h-2.5 rounded-full bg-neon-blue border-2 border-neon-cyan animate-pulse-neon" />
            <span className="text-[8px] font-semibold tracking-wider uppercase font-sans">
              Real Time
            </span>
          </button>
        </motion.div>
      </div>

      {/* 2. Main Metrics Footer Bar (Very Bottom Edge) */}
      <motion.footer
        className="fixed bottom-0 left-0 right-0 z-40 h-14 border-t border-white/[0.05] flex items-center bg-black/95 px-8"
        initial={{ y: 56, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="flex items-center justify-between w-full">
          {/* SIMULATION TIME */}
          <FooterMetric
            icon={<Clock size={16} className="text-white/40" />}
            label="Simulation Time"
            value={`${age.toFixed(2)} Ga`}
          />

          {/* TIME SCALE */}
          <FooterMetric
            icon={<Activity size={16} className="text-neon-blue" />}
            label="Time Scale"
            value={`${timeScale.toFixed(2)} ×`}
          />

          {/* ENERGY */}
          <FooterMetric
            icon={<Zap size={16} className="text-neon-cyan" />}
            label="Energy"
            value={formatNumber(energy, "J")}
          />

          {/* MATTER */}
          <FooterMetric
            icon={<Disc size={16} className="text-neon-purple" />}
            label="Matter"
            value={formatNumber(matter, "kg")}
          />

          {/* ENTROPY */}
          <FooterMetric
            icon={<Zap size={16} className="text-neon-violet" />}
            label="Entropy"
            value={formatNumber(entropy, "J/K")}
          />
        </div>
      </motion.footer>
    </>
  );
}

function TimelineBtn({
  onClick,
  isActive,
  icon,
  label,
}: {
  onClick: () => void;
  isActive: boolean;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-1.5 transition-colors cursor-pointer select-none",
        isActive ? "text-neon-cyan" : "text-white/40 hover:text-white/70"
      )}
    >
      <div className={cn("transition-transform duration-200", isActive && "scale-110")}>
        {icon}
      </div>
      <span className="text-[8px] font-semibold tracking-wider uppercase font-sans">
        {label}
      </span>
    </button>
  );
}

function FooterMetric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 select-none">
      <div className="flex-shrink-0">{icon}</div>
      <div className="flex flex-col">
        <span className="text-[8px] tracking-[0.15em] text-white/30 uppercase font-sans font-semibold">
          {label}
        </span>
        <span className="text-xs font-mono font-medium text-white/80 mt-0.5">
          {value}
        </span>
      </div>
    </div>
  );
}
