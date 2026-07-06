import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { ToolType } from "@/types/genesis";

interface ToolStore {
  activeTool: ToolType;
  isCreating: boolean;
  createType: string | null;
  snapToGrid: boolean;
  gridSize: number;
  showLabels: boolean;
  showEquations: boolean;
  showGrid: boolean;
  showAxes: boolean;
  cameraMode: "orbit" | "pan" | "fly";

  setTool: (tool: ToolType) => void;
  setCreating: (type: string | null) => void;
  toggleSnap: () => void;
  toggleLabels: () => void;
  toggleEquations: () => void;
  toggleGrid: () => void;
  toggleAxes: () => void;
  setCameraMode: (mode: "orbit" | "pan" | "fly") => void;
}

export const useToolStore = create<ToolStore>()(
  devtools(
    (set) => ({
      activeTool: "select",
      isCreating: false,
      createType: null,
      snapToGrid: false,
      gridSize: 0.5,
      showLabels: true,
      showEquations: true,
      showGrid: false,
      showAxes: false,
      cameraMode: "orbit",

      setTool: (tool) => set({ activeTool: tool, isCreating: tool === "create" }),
      setCreating: (type) => set({ createType: type, isCreating: !!type }),
      toggleSnap: () => set((s) => ({ snapToGrid: !s.snapToGrid })),
      toggleLabels: () => set((s) => ({ showLabels: !s.showLabels })),
      toggleEquations: () => set((s) => ({ showEquations: !s.showEquations })),
      toggleGrid: () => set((s) => ({ showGrid: !s.showGrid })),
      toggleAxes: () => set((s) => ({ showAxes: !s.showAxes })),
      setCameraMode: (mode) => set({ cameraMode: mode }),
    }),
    { name: "genesis-tools" }
  )
);
