"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { TopBar, type Tab } from "@/components/shell/TopBar";
import { BottomBar } from "@/components/shell/BottomBar";
import { ToolBar } from "@/components/shell/ToolBar";
import { AIPanel } from "@/components/panel/AIPanel";

const RealityCanvas = dynamic(
  () => import("@/components/workspace/RealityCanvas").then((mod) => mod.RealityCanvas),
  { ssr: false }
);

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("reality");

  return (
    <main className="relative w-screen h-screen bg-black overflow-hidden flex flex-col font-sans select-none">
      {/* 3D Simulation Workspace */}
      <RealityCanvas />

      {/* OS Top Navigation Bar */}
      <TopBar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Floating Left Toolbar */}
      <ToolBar />

      {/* Collapsible Right AI Panel */}
      <AIPanel />

      {/* Simulation Timeline & Control Bottom Bar */}
      <BottomBar />

      {/* Ambient background noise/gradient layering */}
      <div className="absolute inset-0 pointer-events-none border border-white/[0.03] z-50 rounded-lg" />
    </main>
  );
}
