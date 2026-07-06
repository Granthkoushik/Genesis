import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { AIReasoningStep, AIConversation, AIStage, SceneObject, Equation, Variable } from "@/types/genesis";
import { nanoid } from "nanoid";

const REASONING_STAGES: Array<{ stage: AIStage; label: string; description: string }> = [
  { stage: "understanding", label: "Understanding theory", description: "Parsing natural language and identifying core concepts..." },
  { stage: "relationships", label: "Finding relationships", description: "Mapping dependencies between physical quantities..." },
  { stage: "equations", label: "Constructing equations", description: "Deriving mathematical formulations from concepts..." },
  { stage: "units", label: "Checking dimensions", description: "Verifying dimensional consistency across all terms..." },
  { stage: "spacetime", label: "Building spacetime", description: "Generating the geometric structure of the simulation..." },
  { stage: "particles", label: "Generating particles", description: "Distributing matter and energy across the simulation..." },
  { stage: "physics", label: "Applying physical laws", description: "Initializing force fields and interaction hamiltonians..." },
  { stage: "rendering", label: "Rendering reality", description: "Compiling scene graph and initializing GPU resources..." },
];

interface AIStore {
  isBuilding: boolean;
  stages: AIReasoningStep[];
  currentStageIndex: number;
  overallProgress: number;
  conversation: AIConversation[];
  theoryInput: string;
  equationInput: string;
  lastBuildResult: {
    objects: SceneObject[];
    equations: Equation[];
    variables: Variable[];
  } | null;
  error: string | null;

  setTheoryInput: (text: string) => void;
  setEquationInput: (text: string) => void;
  startBuilding: () => void;
  advanceStage: () => void;
  completeStage: (index: number, data?: unknown) => void;
  failStage: (index: number, error: string) => void;
  finishBuilding: (result: {
    objects: SceneObject[];
    equations: Equation[];
    variables: Variable[];
  }) => void;
  failBuilding: (error: string) => void;
  resetBuilding: () => void;
  addMessage: (role: "user" | "assistant", content: string) => void;
  clearConversation: () => void;
}

export const useAIStore = create<AIStore>()(
  devtools(
    (set, get) => ({
      isBuilding: false,
      stages: [],
      currentStageIndex: -1,
      overallProgress: 0,
      conversation: [],
      theoryInput: "",
      equationInput: "",
      lastBuildResult: null,
      error: null,

      setTheoryInput: (text) => set({ theoryInput: text }),
      setEquationInput: (text) => set({ equationInput: text }),

      startBuilding: () => {
        const stages: AIReasoningStep[] = REASONING_STAGES.map((s, i) => ({
          id: nanoid(),
          ...s,
          status: i === 0 ? "active" : "pending",
          progress: 0,
          timestamp: Date.now() + i * 100,
        }));
        set({
          isBuilding: true,
          stages,
          currentStageIndex: 0,
          overallProgress: 0,
          error: null,
        });
      },

      advanceStage: () => {
        const { currentStageIndex, stages } = get();
        const nextIndex = currentStageIndex + 1;
        if (nextIndex >= stages.length) return;

        set((state) => ({
          currentStageIndex: nextIndex,
          overallProgress: Math.round((nextIndex / state.stages.length) * 100),
          stages: state.stages.map((s, i) => {
            if (i === currentStageIndex)
              return { ...s, status: "complete", progress: 100 };
            if (i === nextIndex)
              return { ...s, status: "active", progress: 0 };
            return s;
          }),
        }));
      },

      completeStage: (index, data) => {
        set((state) => ({
          stages: state.stages.map((s, i) =>
            i === index ? { ...s, status: "complete", progress: 100, data } : s
          ),
        }));
      },

      failStage: (index, error) => {
        set((state) => ({
          stages: state.stages.map((s, i) =>
            i === index ? { ...s, status: "error", progress: 0 } : s
          ),
          error,
        }));
      },

      finishBuilding: (result) => {
        set((state) => ({
          isBuilding: false,
          overallProgress: 100,
          lastBuildResult: result,
          stages: state.stages.map((s) => ({ ...s, status: "complete", progress: 100 })),
        }));
      },

      failBuilding: (error) => {
        set({ isBuilding: false, error });
      },

      resetBuilding: () => {
        set({
          isBuilding: false,
          stages: [],
          currentStageIndex: -1,
          overallProgress: 0,
          error: null,
        });
      },

      addMessage: (role, content) => {
        const msg: AIConversation = {
          id: nanoid(),
          role,
          content,
          timestamp: Date.now(),
        };
        set((state) => ({ conversation: [...state.conversation, msg] }));
      },

      clearConversation: () => set({ conversation: [] }),
    }),
    { name: "genesis-ai" }
  )
);
