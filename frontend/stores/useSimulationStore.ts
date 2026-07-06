import { create } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";

interface SimulationStore {
  isPlaying: boolean;
  time: number;        // simulation time in seconds
  timeScale: number;   // 1x = real time
  energy: number;      // total energy (J)
  matter: number;      // total matter (kg)
  entropy: number;     // entropy (J/K)
  frameRate: number;   // current FPS
  age: number;         // universe age in Ga (gigayears)

  play: () => void;
  pause: () => void;
  reset: () => void;
  setTimeScale: (scale: number) => void;
  step: (delta: number) => void;
  setMetrics: (metrics: {
    energy?: number;
    matter?: number;
    entropy?: number;
    frameRate?: number;
  }) => void;
}

export const useSimulationStore = create<SimulationStore>()(
  devtools(
    subscribeWithSelector((set) => ({
      isPlaying: false,
      time: 0,
      timeScale: 1,
      energy: 7.21e69,
      matter: 4.36e53,
      entropy: 2.11e100,
      frameRate: 60,
      age: 13.82,

      play: () => set({ isPlaying: true }),
      pause: () => set({ isPlaying: false }),
      reset: () =>
        set({
          isPlaying: false,
          time: 0,
          energy: 7.21e69,
          matter: 4.36e53,
          entropy: 2.11e100,
          age: 13.82,
        }),

      setTimeScale: (scale) => set({ timeScale: scale }),

      step: (delta) =>
        set((state) => ({
          time: state.time + delta * state.timeScale,
          age: state.age + (delta * state.timeScale) / 3.154e16, // seconds → Ga
          entropy: state.entropy * (1 + delta * 1e-12), // entropy always increases
        })),

      setMetrics: (m) =>
        set((state) => ({
          energy: m.energy ?? state.energy,
          matter: m.matter ?? state.matter,
          entropy: m.entropy ?? state.entropy,
          frameRate: m.frameRate ?? state.frameRate,
        })),
    })),
    { name: "genesis-simulation" }
  )
);
