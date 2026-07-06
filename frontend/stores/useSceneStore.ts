import { create } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";
import type { SceneObject, Equation, Variable, ObjectType, Vector3D } from "@/types/genesis";
import { nanoid } from "nanoid";

interface SceneStore {
  objects: SceneObject[];
  equations: Equation[];
  variables: Variable[];
  selectedIds: string[];
  hoveredId: string | null;

  // Object CRUD
  addObject: (obj: Partial<SceneObject> & { type: ObjectType }) => string;
  updateObject: (id: string, updates: Partial<SceneObject>) => void;
  removeObject: (id: string) => void;
  duplicateObject: (id: string) => string;
  clearScene: () => void;

  // Selection
  selectObject: (id: string, multi?: boolean) => void;
  deselectAll: () => void;
  setHovered: (id: string | null) => void;

  // Equations
  addEquation: (eq: Partial<Equation>) => string;
  updateEquation: (id: string, updates: Partial<Equation>) => void;
  removeEquation: (id: string) => void;

  // Variables
  addVariable: (v: Partial<Variable>) => string;
  updateVariable: (id: string, value: number) => void;

  // Bulk scene replace
  loadScene: (objects: SceneObject[], equations: Equation[], variables: Variable[]) => void;
}

const DEFAULT_OBJECT_PROPS: Omit<SceneObject, "id" | "type" | "label"> = {
  position: { x: 0, y: 0, z: 0 },
  rotation: { x: 0, y: 0, z: 0, w: 1 },
  scale: { x: 1, y: 1, z: 1 },
  color: "#00A8FF",
  emissiveColor: "#00A8FF",
  emissiveIntensity: 1.2,
  properties: {},
  equations: [],
  locked: false,
  visible: true,
  selected: false,
  createdAt: Date.now(),
};

const OBJECT_DEFAULTS: Record<ObjectType, Partial<SceneObject>> = {
  galaxy: {
    color: "#7B2FFF",
    emissiveColor: "#A855F7",
    emissiveIntensity: 1.5,
    properties: { arms: 4, particleCount: 8000, radius: 3, rotationSpeed: 0.05 },
  },
  blackhole: {
    color: "#000000",
    emissiveColor: "#00A8FF",
    emissiveIntensity: 2,
    properties: { mass: 1e30, accretionRadius: 1.5, lensStrength: 2 },
  },
  star: {
    color: "#FFD700",
    emissiveColor: "#FF8C00",
    emissiveIntensity: 3,
    properties: { mass: 2e30, radius: 0.5, temperature: 5778, luminosity: 1 },
  },
  particle: {
    color: "#00F5FF",
    emissiveColor: "#00F5FF",
    emissiveIntensity: 1.8,
    properties: { count: 2000, spread: 2, speed: 0.02 },
  },
  field: {
    color: "#00A8FF",
    emissiveColor: "#00A8FF",
    emissiveIntensity: 0.8,
    properties: { strength: 1, lineCount: 32, range: 4 },
  },
  wave: {
    color: "#A855F7",
    emissiveColor: "#7B2FFF",
    emissiveIntensity: 1,
    properties: { amplitude: 0.5, frequency: 2, speed: 1, resolution: 64 },
  },
  grid: {
    color: "#00A8FF",
    emissiveColor: "#00A8FF",
    emissiveIntensity: 0.4,
    properties: { size: 10, divisions: 20, curvature: 0 },
  },
  nebula: {
    color: "#7B2FFF",
    emissiveColor: "#A855F7",
    emissiveIntensity: 0.6,
    properties: { density: 0.5, spread: 5, colorVariance: 0.3 },
  },
  orbit: {
    color: "#00F5FF",
    emissiveColor: "#00F5FF",
    emissiveIntensity: 1,
    properties: { radius: 3, period: 10, eccentricity: 0 },
  },
  point_mass: {
    color: "#FFD700",
    emissiveColor: "#FF8C00",
    emissiveIntensity: 2,
    properties: { mass: 1e10 },
  },
};

export const useSceneStore = create<SceneStore>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      objects: [],
      equations: [],
      variables: [],
      selectedIds: [],
      hoveredId: null,

      addObject: (obj) => {
        const id = nanoid();
        const defaults = OBJECT_DEFAULTS[obj.type] ?? {};
        const newObj: SceneObject = {
          ...DEFAULT_OBJECT_PROPS,
          ...defaults,
          ...obj,
          id,
          label: obj.label ?? `${obj.type.charAt(0).toUpperCase()}${obj.type.slice(1)} ${get().objects.length + 1}`,
          createdAt: Date.now(),
        };
        set((state) => ({ objects: [...state.objects, newObj] }));
        return id;
      },

      updateObject: (id, updates) => {
        set((state) => ({
          objects: state.objects.map((o) =>
            o.id === id ? { ...o, ...updates } : o
          ),
        }));
      },

      removeObject: (id) => {
        set((state) => ({
          objects: state.objects.filter((o) => o.id !== id),
          selectedIds: state.selectedIds.filter((sid) => sid !== id),
        }));
      },

      duplicateObject: (id) => {
        const obj = get().objects.find((o) => o.id === id);
        if (!obj) return "";
        const newId = nanoid();
        const dup: SceneObject = {
          ...obj,
          id: newId,
          label: `${obj.label} (copy)`,
          position: {
            x: obj.position.x + 1.5,
            y: obj.position.y,
            z: obj.position.z + 1.5,
          },
          selected: false,
          createdAt: Date.now(),
        };
        set((state) => ({ objects: [...state.objects, dup] }));
        return newId;
      },

      clearScene: () =>
        set({ objects: [], equations: [], variables: [], selectedIds: [] }),

      selectObject: (id, multi = false) => {
        set((state) => {
          if (multi) {
            const alreadySelected = state.selectedIds.includes(id);
            const newIds = alreadySelected
              ? state.selectedIds.filter((s) => s !== id)
              : [...state.selectedIds, id];
            return {
              selectedIds: newIds,
              objects: state.objects.map((o) => ({ ...o, selected: newIds.includes(o.id) })),
            };
          }
          return {
            selectedIds: [id],
            objects: state.objects.map((o) => ({ ...o, selected: o.id === id })),
          };
        });
      },

      deselectAll: () =>
        set((state) => ({
          selectedIds: [],
          objects: state.objects.map((o) => ({ ...o, selected: false })),
        })),

      setHovered: (id) => set({ hoveredId: id }),

      addEquation: (eq) => {
        const id = nanoid();
        const newEq: Equation = {
          id,
          latex: eq.latex ?? "",
          sympyExpr: eq.sympyExpr,
          description: eq.description ?? "",
          variables: eq.variables ?? [],
          isValid: eq.isValid ?? true,
          derivedFrom: eq.derivedFrom,
        };
        set((state) => ({ equations: [...state.equations, newEq] }));
        return id;
      },

      updateEquation: (id, updates) => {
        set((state) => ({
          equations: state.equations.map((e) => (e.id === id ? { ...e, ...updates } : e)),
        }));
      },

      removeEquation: (id) => {
        set((state) => ({ equations: state.equations.filter((e) => e.id !== id) }));
      },

      addVariable: (v) => {
        const id = nanoid();
        const newVar: Variable = {
          id,
          symbol: v.symbol ?? "x",
          name: v.name ?? "Variable",
          value: v.value ?? 0,
          unit: v.unit ?? "",
          latex: v.latex ?? v.symbol ?? "x",
          editable: v.editable ?? true,
          min: v.min,
          max: v.max,
        };
        set((state) => ({ variables: [...state.variables, newVar] }));
        return id;
      },

      updateVariable: (id, value) => {
        set((state) => ({
          variables: state.variables.map((v) => (v.id === id ? { ...v, value } : v)),
        }));
      },

      loadScene: (objects, equations, variables) => {
        set({ objects, equations, variables, selectedIds: [] });
      },
    })),
    { name: "genesis-scene" }
  )
);
