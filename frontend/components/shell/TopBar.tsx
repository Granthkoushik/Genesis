"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Globe2, History, Telescope, Settings, HelpCircle, Sun, Hexagon, User } from "lucide-react";
import { cn } from "@/lib/utils";

type Tab = "reality" | "explorer" | "history";

const TABS: { id: Tab; label: string }[] = [
  { id: "reality",  label: "REALITY WORKSPACE" },
  { id: "explorer", label: "EXPLORER" },
  { id: "history",  label: "HISTORY" },
];

interface TopBarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export function TopBar({ activeTab, onTabChange }: TopBarProps) {
  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-40 h-16 border-b border-white/[0.05]"
      style={{
        background: "rgba(3, 3, 8, 0.95)",
        backdropFilter: "blur(20px)",
      }}
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="flex items-center h-full px-6 gap-6">
        {/* Logo */}
        <Logo />

        <div className="flex-1" />

        {/* Tab Nav Wrapper */}
        <div className="flex items-center p-0.5 glass rounded-lg border border-white/[0.06] gap-1.5">
          {TABS.map((tab) => (
            <TabButton
              key={tab.id}
              tab={tab}
              isActive={activeTab === tab.id}
              onClick={() => onTabChange(tab.id)}
            />
          ))}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* System icons */}
        <SystemIcons />
      </div>
    </motion.header>
  );
}

function Logo() {
  return (
    <motion.div
      className="flex items-center gap-3 cursor-pointer group"
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <div className="relative w-8 h-8 flex items-center justify-center">
        <motion.div
          className="absolute inset-0 rounded-lg bg-gradient-to-br from-neon-blue to-neon-purple opacity-25"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
        <Hexagon size={20} className="text-neon-blue relative z-10 group-hover:text-neon-cyan transition-colors" />
        <div className="absolute inset-0 rounded-lg glow-blue opacity-30 group-hover:opacity-60 transition-opacity" />
      </div>
      <div>
        <div className="text-sm font-semibold tracking-[0.15em] text-white font-sans group-hover:text-neon-cyan transition-colors">
          THEORY → REALITY
        </div>
        <div className="text-[8px] tracking-[0.25em] text-white/40 font-sans uppercase font-medium">
          IDEAS BECOME UNIVERSES
        </div>
      </div>
    </motion.div>
  );
}

function TabButton({ tab, isActive, onClick }: { tab: { id: Tab; label: string }; isActive: boolean; onClick: () => void }) {
  return (
    <button
      className={cn(
        "relative px-5 py-1.5 rounded-md text-[10px] font-semibold tracking-wider font-sans transition-all duration-200",
        isActive
          ? "text-neon-cyan font-bold"
          : "text-white/40 hover:text-white/70"
      )}
      onClick={onClick}
    >
      {isActive && (
        <motion.div
          className="absolute inset-0 rounded-md bg-neon-blue/5 border border-neon-blue/30 shadow-[0_0_8px_rgba(0,168,255,0.15)]"
          layoutId="active-tab"
          transition={{ type: "spring", stiffness: 450, damping: 30 }}
        />
      )}
      <span className="relative z-10">{tab.label}</span>
    </button>
  );
}

function SystemIcons() {
  return (
    <div className="flex items-center gap-1.5">
      {[
        { icon: <Sun size={15} />, label: "Theme" },
        { icon: <HelpCircle size={15} />, label: "Help" },
        { icon: <Settings size={15} />, label: "Settings" },
      ].map(({ icon, label }) => (
        <button
          key={label}
          title={label}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white/80 hover:bg-white/5 transition-all duration-200"
        >
          {icon}
        </button>
      ))}
      {/* Avatar */}
      <button className="w-8 h-8 rounded-full bg-neon-blue/20 border border-neon-blue/40 flex items-center justify-center ml-1 shadow-[0_0_8px_rgba(0,168,255,0.2)]">
        <User size={13} className="text-neon-cyan" />
      </button>
    </div>
  );
}

export type { Tab };
