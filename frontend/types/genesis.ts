export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export interface Quaternion {
  x: number;
  y: number;
  z: number;
  w: number;
}

export type ObjectType =
  | "galaxy"
  | "blackhole"
  | "star"
  | "particle"
  | "field"
  | "wave"
  | "grid"
  | "nebula"
  | "orbit"
  | "point_mass";

export interface SceneObject {
  id: string;
  type: ObjectType;
  label: string;
  position: Vector3D;
  rotation: Quaternion;
  scale: Vector3D;
  color: string;
  emissiveColor: string;
  emissiveIntensity: number;
  properties: Record<string, number | string | boolean>;
  equations: string[];
  locked: boolean;
  visible: boolean;
  selected: boolean;
  createdAt: number;
}

export interface Variable {
  id: string;
  symbol: string;
  name: string;
  value: number;
  unit: string;
  latex: string;
  editable: boolean;
  min?: number;
  max?: number;
}

export interface Equation {
  id: string;
  latex: string;
  sympyExpr?: string;
  description: string;
  variables: string[];
  isValid: boolean;
  derivedFrom?: string;
}

export type AIStage =
  | "idle"
  | "understanding"
  | "relationships"
  | "equations"
  | "units"
  | "spacetime"
  | "particles"
  | "physics"
  | "rendering"
  | "complete"
  | "error";

export interface AIReasoningStep {
  id: string;
  stage: AIStage;
  label: string;
  description: string;
  status: "pending" | "active" | "complete" | "error";
  progress: number;
  timestamp: number;
  data?: unknown;
}

export interface AIConversation {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

export type ToolType =
  | "select"
  | "move"
  | "rotate"
  | "scale"
  | "duplicate"
  | "split"
  | "erase"
  | "measure"
  | "create";

export interface SimulationState {
  isPlaying: boolean;
  time: number;
  timeScale: number;
  energy: number;
  matter: number;
  entropy: number;
  frameRate: number;
}

export interface VersionEntry {
  id: string;
  label: string;
  description: string;
  timestamp: number;
  parentId?: string;
  sceneSnapshot: Partial<SceneObject>[];
  equationSnapshot: Equation[];
  thumbnail?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: number;
  updatedAt: number;
  userId?: string;
}

export interface BuildRealityRequest {
  theory: string;
  equation?: string;
  context?: Record<string, unknown>;
}

export interface BuildRealityResponse {
  success: boolean;
  objects: SceneObject[];
  equations: Equation[];
  variables: Variable[];
  description: string;
  stages: AIReasoningStep[];
}

export interface MathParseResponse {
  success: boolean;
  latex: string;
  sympyExpr: string;
  variables: string[];
  isValid: boolean;
  errorMessage?: string;
}

export interface PhysicsStepResponse {
  objects: Array<{
    id: string;
    position: Vector3D;
    rotation: Quaternion;
    velocity: Vector3D;
  }>;
  timestamp: number;
  energy: number;
  entropy: number;
}

export interface ExportOptions {
  format: "gltf" | "obj" | "png" | "pdf" | "latex" | "mathml" | "json";
  includeEquations: boolean;
  includeVariables: boolean;
  quality?: "low" | "medium" | "high";
}
