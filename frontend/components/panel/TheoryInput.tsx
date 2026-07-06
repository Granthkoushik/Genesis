"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Sigma, Wand2, Loader2, AlertCircle } from "lucide-react";
import { useAIStore } from "@/stores/useAIStore";
import { useSceneStore } from "@/stores/useSceneStore";
import { sleep } from "@/lib/utils";
import type { SceneObject, Variable, Equation } from "@/types/genesis";
import { nanoid } from "@/lib/nanoid";

// Simulated AI pipeline — produces realistic results without a running backend
async function runAIPipeline(
  theory: string,
  equation: string,
  aiStore: ReturnType<typeof useAIStore.getState>,
  sceneStore: ReturnType<typeof useSceneStore.getState>
) {
  aiStore.startBuilding();
  aiStore.addMessage("user", theory || equation);

  const stageDelays = [800, 600, 700, 500, 900, 700, 600, 500];

  // Advance through each stage with realistic delays
  for (let i = 0; i < 8; i++) {
    await sleep(stageDelays[i]);
    aiStore.completeStage(i, { processed: true });
    if (i < 7) aiStore.advanceStage();
  }

  // Parse the input and generate appropriate scene
  const result = generateSceneFromInput(theory, equation);

  // Load into scene
  sceneStore.loadScene(result.objects, result.equations, result.variables);

  aiStore.finishBuilding(result);
  aiStore.addMessage("assistant", result.description);
}

function generateSceneFromInput(theory: string, equation: string): {
  objects: SceneObject[];
  equations: Equation[];
  variables: Variable[];
  description: string;
} {
  const input = (theory + " " + equation).toLowerCase();

  // Einstein field equations / General Relativity
  if (input.includes("einstein") || input.includes("g_") || input.includes("g_{") || input.includes("general relativity") || equation.includes("G_")) {
    return buildEinsteinReality();
  }

  // Gravity / Newton
  if (input.includes("gravity") || input.includes("newton") || input.includes("gravitational") || equation.includes("GM")) {
    return buildGravityReality();
  }

  // Quantum / Schrödinger
  if (input.includes("quantum") || input.includes("schrödinger") || input.includes("schrodinger") || input.includes("wave function") || equation.includes("ℏ") || equation.includes("hbar")) {
    return buildQuantumReality();
  }

  // Electromagnetic
  if (input.includes("maxwell") || input.includes("electromagnetic") || input.includes("electric") || input.includes("magnetic") || equation.includes("∇×") || equation.includes("nabla")) {
    return buildElectromagneticReality();
  }

  // Cosmology / Big Bang
  if (input.includes("hubble") || input.includes("cosmolog") || input.includes("universe") || input.includes("big bang") || input.includes("friedmann")) {
    return buildCosmologyReality();
  }

  // Default — general physics simulation
  return buildDefaultReality(theory || equation);
}

function makeObj(partial: Partial<SceneObject> & { type: SceneObject["type"] }): SceneObject {
  return {
    id: nanoid(),
    label: partial.label ?? partial.type,
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0, w: 1 },
    scale: { x: 1, y: 1, z: 1 },
    color: "#00A8FF",
    emissiveColor: "#00A8FF",
    emissiveIntensity: 1.5,
    properties: {},
    equations: [],
    locked: false,
    visible: true,
    selected: false,
    createdAt: Date.now(),
    ...partial,
  };
}

function buildEinsteinReality() {
  const objects: SceneObject[] = [
    makeObj({ type: "blackhole", label: "Schwarzschild Black Hole", position: { x: 0, y: 0, z: 0 }, properties: { mass: 1e30, accretionRadius: 2.5, lensStrength: 3 }, color: "#000000", emissiveColor: "#00A8FF", emissiveIntensity: 2 }),
    makeObj({ type: "grid", label: "Spacetime Curvature G_μν", position: { x: 0, y: -0.5, z: 0 }, scale: { x: 2, y: 2, z: 2 }, properties: { size: 12, divisions: 28, curvature: 2.5 }, color: "#00A8FF", emissiveColor: "#00A8FF", emissiveIntensity: 0.5 }),
    makeObj({ type: "galaxy", label: "Mass-Energy T_μν", position: { x: 10, y: 1, z: -6 }, scale: { x: 0.6, y: 0.6, z: 0.6 }, properties: { arms: 3, particleCount: 5000, radius: 3, rotationSpeed: 0.05 }, color: "#7B2FFF", emissiveColor: "#A855F7", emissiveIntensity: 1.5 }),
    makeObj({ type: "star", label: "Cosmological Constant Λ", position: { x: -8, y: 2, z: 4 }, properties: { radius: 0.4, temperature: 8000 }, color: "#00F5FF", emissiveColor: "#00F5FF", emissiveIntensity: 3 }),
  ];

  const variables: Variable[] = [
    { id: nanoid(), symbol: "G", name: "Gravitational Constant", value: 6.674e-11, unit: "m³/kg·s²", latex: "G", editable: false },
    { id: nanoid(), symbol: "Λ", name: "Cosmological Constant", value: 1.105e-52, unit: "m⁻²", latex: "\\Lambda", editable: true, min: 0, max: 1e-50 },
    { id: nanoid(), symbol: "c", name: "Speed of Light", value: 2.998e8, unit: "m/s", latex: "c", editable: false },
    { id: nanoid(), symbol: "M", name: "Black Hole Mass", value: 1e30, unit: "kg", latex: "M", editable: true },
  ];

  const equations: Equation[] = [
    { id: nanoid(), latex: "G_{\\mu\\nu} + \\Lambda g_{\\mu\\nu} = \\frac{8\\pi G}{c^4} T_{\\mu\\nu}", sympyExpr: "Einstein_tensor + Lambda*metric = (8*pi*G/c**4)*stress_energy", description: "Einstein Field Equations", variables: ["G", "Λ", "c"], isValid: true },
    { id: nanoid(), latex: "r_s = \\frac{2GM}{c^2}", sympyExpr: "r_s = 2*G*M/c**2", description: "Schwarzschild Radius", variables: ["G", "M", "c"], isValid: true },
  ];

  return {
    objects,
    equations,
    variables,
    description: "Built Einstein's General Relativity: Schwarzschild black hole with spacetime curvature grid, mass-energy tensor, and cosmological constant. The Schwarzschild radius r_s = 2GM/c² determines the event horizon.",
  };
}

function buildGravityReality() {
  const objects: SceneObject[] = [
    makeObj({ type: "star", label: "Central Mass M", position: { x: 0, y: 0, z: 0 }, properties: { radius: 0.8, temperature: 6000 }, color: "#FFD700", emissiveColor: "#FF8C00", emissiveIntensity: 3 }),
    makeObj({ type: "particle", label: "Orbiting Bodies", position: { x: 0, y: 0, z: 0 }, scale: { x: 4, y: 4, z: 4 }, properties: { count: 1500, spread: 4, speed: 0.015 }, color: "#00F5FF", emissiveColor: "#00F5FF", emissiveIntensity: 1.5 }),
    makeObj({ type: "grid", label: "Gravitational Field", position: { x: 0, y: -0.8, z: 0 }, scale: { x: 1.5, y: 1.5, z: 1.5 }, properties: { size: 12, divisions: 24, curvature: 1.5 }, color: "#7B2FFF", emissiveColor: "#7B2FFF", emissiveIntensity: 0.4 }),
    makeObj({ type: "field", label: "Force Field Lines", position: { x: 0, y: 0, z: 0 }, scale: { x: 1.2, y: 1.2, z: 1.2 }, properties: { strength: 1, lineCount: 20, range: 5 }, color: "#A855F7", emissiveColor: "#A855F7", emissiveIntensity: 0.8 }),
  ];

  const variables: Variable[] = [
    { id: nanoid(), symbol: "G", name: "Gravitational Constant", value: 6.674e-11, unit: "m³/kg·s²", latex: "G", editable: false },
    { id: nanoid(), symbol: "M", name: "Central Mass", value: 2e30, unit: "kg", latex: "M", editable: true },
    { id: nanoid(), symbol: "m", name: "Orbiting Mass", value: 5.97e24, unit: "kg", latex: "m", editable: true },
    { id: nanoid(), symbol: "r", name: "Orbital Radius", value: 1.5e11, unit: "m", latex: "r", editable: true },
  ];

  const equations: Equation[] = [
    { id: nanoid(), latex: "F = \\frac{GMm}{r^2}", sympyExpr: "F = G*M*m/r**2", description: "Newton's Law of Gravitation", variables: ["G", "M", "m", "r"], isValid: true },
    { id: nanoid(), latex: "v = \\sqrt{\\frac{GM}{r}}", sympyExpr: "v = sqrt(G*M/r)", description: "Orbital Velocity", variables: ["G", "M", "r"], isValid: true },
  ];

  return { objects, equations, variables, description: "Simulated Newtonian gravity system with central star, orbiting particle cloud, gravitational field lines, and spacetime curvature." };
}

function buildQuantumReality() {
  const objects: SceneObject[] = [
    makeObj({ type: "wave", label: "Wave Function ψ(x,t)", position: { x: 0, y: 0, z: 0 }, scale: { x: 1.2, y: 1.2, z: 1.2 }, properties: { amplitude: 0.8, frequency: 3, speed: 1.5, resolution: 80 }, color: "#A855F7", emissiveColor: "#7B2FFF", emissiveIntensity: 1.2 }),
    makeObj({ type: "particle", label: "Quantum Foam", position: { x: 0, y: 1, z: 0 }, scale: { x: 1.5, y: 1.5, z: 1.5 }, properties: { count: 3000, spread: 5, speed: 0.03 }, color: "#00F5FF", emissiveColor: "#00F5FF", emissiveIntensity: 2 }),
    makeObj({ type: "field", label: "Probability Amplitude |ψ|²", position: { x: 0, y: 0, z: 6 }, scale: { x: 0.8, y: 0.8, z: 0.8 }, properties: { strength: 0.5, lineCount: 16, range: 3 }, color: "#7B2FFF", emissiveColor: "#7B2FFF", emissiveIntensity: 1 }),
  ];

  const variables: Variable[] = [
    { id: nanoid(), symbol: "ℏ", name: "Reduced Planck Constant", value: 1.055e-34, unit: "J·s", latex: "\\hbar", editable: false },
    { id: nanoid(), symbol: "m", name: "Particle Mass", value: 9.109e-31, unit: "kg", latex: "m", editable: true },
    { id: nanoid(), symbol: "V", name: "Potential Energy", value: 0, unit: "J", latex: "V(x)", editable: true },
  ];

  const equations: Equation[] = [
    { id: nanoid(), latex: "i\\hbar \\frac{\\partial \\psi}{\\partial t} = \\left[-\\frac{\\hbar^2}{2m}\\nabla^2 + V\\right]\\psi", sympyExpr: "I*hbar*diff(psi,t) = (-hbar**2/(2*m)*laplacian + V)*psi", description: "Time-Dependent Schrödinger Equation", variables: ["ℏ", "m", "V"], isValid: true },
    { id: nanoid(), latex: "\\langle x \\rangle = \\int_{-\\infty}^{\\infty} \\psi^* x \\psi \\, dx", sympyExpr: "expectation_x = integral(conj(psi)*x*psi, (x,-oo,oo))", description: "Position Expectation Value", variables: [], isValid: true },
  ];

  return { objects, equations, variables, description: "Rendered quantum mechanics: Schrödinger wave function as an animated wave surface, quantum foam particle field, and probability amplitude field lines." };
}

function buildElectromagneticReality() {
  const objects: SceneObject[] = [
    makeObj({ type: "field", label: "Electric Field E", position: { x: -3, y: 0, z: 0 }, properties: { strength: 1.2, lineCount: 20, range: 4 }, color: "#00A8FF", emissiveColor: "#00A8FF", emissiveIntensity: 1 }),
    makeObj({ type: "field", label: "Magnetic Field B", position: { x: 3, y: 0, z: 0 }, scale: { x: -1, y: 1, z: 1 }, properties: { strength: 0.8, lineCount: 20, range: 4 }, color: "#A855F7", emissiveColor: "#A855F7", emissiveIntensity: 1 }),
    makeObj({ type: "wave", label: "EM Wave propagation", position: { x: 0, y: 0, z: -4 }, properties: { amplitude: 0.5, frequency: 4, speed: 2, resolution: 60 }, color: "#00F5FF", emissiveColor: "#00F5FF", emissiveIntensity: 1.2 }),
    makeObj({ type: "particle", label: "Photon stream", position: { x: 0, y: 2, z: 0 }, scale: { x: 1, y: 0.3, z: 1 }, properties: { count: 1000, spread: 6, speed: 0.04 }, color: "#FFFFFF", emissiveColor: "#00F5FF", emissiveIntensity: 2 }),
  ];

  const variables: Variable[] = [
    { id: nanoid(), symbol: "ε₀", name: "Permittivity of Free Space", value: 8.854e-12, unit: "F/m", latex: "\\varepsilon_0", editable: false },
    { id: nanoid(), symbol: "μ₀", name: "Permeability of Free Space", value: 1.257e-6, unit: "H/m", latex: "\\mu_0", editable: false },
    { id: nanoid(), symbol: "c", name: "Speed of Light", value: 2.998e8, unit: "m/s", latex: "c", editable: false },
  ];

  const equations: Equation[] = [
    { id: nanoid(), latex: "\\nabla \\cdot \\mathbf{E} = \\frac{\\rho}{\\varepsilon_0}", description: "Gauss's Law", variables: ["ε₀"], isValid: true },
    { id: nanoid(), latex: "\\nabla \\times \\mathbf{B} = \\mu_0 \\mathbf{J} + \\mu_0\\varepsilon_0 \\frac{\\partial \\mathbf{E}}{\\partial t}", description: "Ampere-Maxwell Law", variables: ["ε₀", "μ₀"], isValid: true },
    { id: nanoid(), latex: "c = \\frac{1}{\\sqrt{\\mu_0 \\varepsilon_0}}", description: "Speed of Light", variables: ["ε₀", "μ₀", "c"], isValid: true },
  ];

  return { objects, equations, variables, description: "Maxwell's electrodynamics: Electric and magnetic field lines, EM wave propagation, and photon stream particle system." };
}

function buildCosmologyReality() {
  const objects: SceneObject[] = [
    makeObj({ type: "galaxy", label: "Milky Way", position: { x: 0, y: 0, z: 0 }, properties: { arms: 4, particleCount: 8000, radius: 4, rotationSpeed: 0.04 }, color: "#7B2FFF", emissiveColor: "#A855F7", emissiveIntensity: 1.5 }),
    makeObj({ type: "galaxy", label: "Andromeda", position: { x: 12, y: 1, z: -8 }, properties: { arms: 2, particleCount: 6000, radius: 3.5, rotationSpeed: 0.03 }, color: "#00A8FF", emissiveColor: "#00F5FF", emissiveIntensity: 1.3 }),
    makeObj({ type: "blackhole", label: "Sgr A*", position: { x: 0.5, y: 0, z: 0.5 }, scale: { x: 0.4, y: 0.4, z: 0.4 }, properties: { accretionRadius: 1, lensStrength: 2 }, color: "#000000", emissiveColor: "#7B2FFF", emissiveIntensity: 2 }),
    makeObj({ type: "particle", label: "Cosmic Web", position: { x: 0, y: 0, z: 0 }, scale: { x: 8, y: 3, z: 8 }, properties: { count: 3000, spread: 8, speed: 0.005 }, color: "#00F5FF", emissiveColor: "#00F5FF", emissiveIntensity: 0.8 }),
    makeObj({ type: "star", label: "Quasar", position: { x: -10, y: 3, z: 6 }, properties: { radius: 0.3, temperature: 30000 }, color: "#FFFFFF", emissiveColor: "#00F5FF", emissiveIntensity: 5 }),
  ];

  const variables: Variable[] = [
    { id: nanoid(), symbol: "H₀", name: "Hubble Constant", value: 67.4, unit: "km/s/Mpc", latex: "H_0", editable: true },
    { id: nanoid(), symbol: "Ω_m", name: "Matter Density", value: 0.315, unit: "", latex: "\\Omega_m", editable: true, min: 0, max: 1 },
    { id: nanoid(), symbol: "Ω_Λ", name: "Dark Energy Density", value: 0.685, unit: "", latex: "\\Omega_\\Lambda", editable: true, min: 0, max: 1 },
  ];

  const equations: Equation[] = [
    { id: nanoid(), latex: "H(z) = H_0 \\sqrt{\\Omega_m(1+z)^3 + \\Omega_\\Lambda}", description: "Friedmann Equation", variables: ["H₀", "Ω_m", "Ω_Λ"], isValid: true },
    { id: nanoid(), latex: "v = H_0 d", description: "Hubble's Law", variables: ["H₀"], isValid: true },
  ];

  return { objects, equations, variables, description: "Cosmological simulation: Milky Way + Andromeda galaxies, Sagittarius A* black hole, cosmic web particle distribution, and quasar. Based on Friedmann equations with Planck 2018 parameters." };
}

function buildDefaultReality(input: string) {
  const objects: SceneObject[] = [
    makeObj({ type: "particle", label: "Simulation Particles", position: { x: 0, y: 0, z: 0 }, scale: { x: 2, y: 2, z: 2 }, properties: { count: 2000, spread: 4, speed: 0.02 }, color: "#00A8FF", emissiveColor: "#00A8FF", emissiveIntensity: 1.5 }),
    makeObj({ type: "grid", label: "Spacetime Grid", position: { x: 0, y: -1, z: 0 }, scale: { x: 1.5, y: 1.5, z: 1.5 }, properties: { size: 10, divisions: 20, curvature: 0.5 }, color: "#7B2FFF", emissiveColor: "#7B2FFF", emissiveIntensity: 0.4 }),
    makeObj({ type: "wave", label: "Field Oscillation", position: { x: 0, y: 0, z: 6 }, properties: { amplitude: 0.4, frequency: 2, speed: 1, resolution: 60 }, color: "#A855F7", emissiveColor: "#A855F7", emissiveIntensity: 1 }),
  ];

  return {
    objects,
    equations: [
      { id: nanoid(), latex: "E = mc^2", sympyExpr: "E = m*c**2", description: "Mass-Energy Equivalence", variables: ["m", "c"], isValid: true },
    ],
    variables: [
      { id: nanoid(), symbol: "m", name: "Mass", value: 1, unit: "kg", latex: "m", editable: true },
      { id: nanoid(), symbol: "c", name: "Speed of Light", value: 2.998e8, unit: "m/s", latex: "c", editable: false },
    ],
    description: `Rendered reality from: "${input}". Default physics simulation initialized.`,
  };
}

import { BlockMath } from "react-katex";

export function TheoryInput() {
  const { theoryInput, equationInput, isBuilding, setTheoryInput, setEquationInput } = useAIStore();
  const aiStoreState = useAIStore.getState;
  const sceneStoreState = useSceneStore.getState;

  const handleBuild = async () => {
    if (isBuilding) return;
    const text = theoryInput || equationInput;
    if (!text.trim()) return;
    await runAIPipeline(theoryInput, equationInput, useAIStore.getState(), useSceneStore.getState());
  };

  // Default math representation when empty
  const mathToShow = equationInput.trim() || "G_{\\mu\\nu} + \\Lambda g_{\\mu\\nu} = \\frac{8\\pi G}{c^4} T_{\\mu\\nu}";

  return (
    <div className="p-4 flex flex-col gap-3">
      {/* Section label */}
      <div className="text-[10px] font-semibold tracking-widest text-neon-cyan/80 uppercase font-sans">
        PLACE THEORY OR EQUATION
      </div>

      {/* Unified Input Card */}
      <div className="glass rounded-xl border border-white/[0.06] bg-black/40 p-4 flex flex-col gap-3.5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
        {/* Theory Description Textarea */}
        <div className="flex flex-col gap-1">
          <label className="text-[8px] font-bold tracking-widest text-white/30 uppercase font-sans">
            Theory / Description
          </label>
          <textarea
            value={theoryInput}
            onChange={(e) => {
              setTheoryInput(e.target.value);
              // Auto extract standard equations based on keywords to help the user get started
              const val = e.target.value.toLowerCase();
              if (val.includes("einstein") || val.includes("general relativity")) {
                setEquationInput("G_{\\mu\\nu} + \\Lambda g_{\\mu\\nu} = \\frac{8\\pi G}{c^4} T_{\\mu\\nu}");
              } else if (val.includes("gravity") || val.includes("newton")) {
                setEquationInput("F = \\frac{GMm}{r^2}");
              } else if (val.includes("quantum") || val.includes("schrodinger") || val.includes("schrödinger")) {
                setEquationInput("i\\hbar \\frac{\\partial \\psi}{\\partial t} = \\hat{H}\\psi");
              } else if (val.includes("maxwell")) {
                setEquationInput("\\nabla \\times \\mathbf{B} = \\mu_0 \\mathbf{J} + \\mu_0\\varepsilon_0 \\frac{\\partial \\mathbf{E}}{\\partial t}");
              }
            }}
            placeholder="Describe your scientific theory or philosophical concept..."
            className="w-full h-14 bg-transparent text-white/80 placeholder:text-white/20 resize-none outline-none border-none text-xs font-sans leading-relaxed"
          />
        </div>

        {/* Separator */}
        <div className="h-px bg-white/[0.06]" />

        {/* Mathematical Equation Input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[8px] font-bold tracking-widest text-white/30 uppercase font-sans">
            Mathematical Equation (LaTeX)
          </label>
          <input
            type="text"
            value={equationInput}
            onChange={(e) => setEquationInput(e.target.value)}
            placeholder="Enter custom mathematical equation (LaTeX)..."
            className="w-full bg-transparent text-neon-cyan/95 placeholder:text-white/10 outline-none border-none text-xs font-mono py-0.5"
          />
        </div>

        {/* Live KaTeX Render Block */}
        <div className="flex items-center justify-center py-3.5 px-2 bg-white/[0.01] rounded-lg border border-white/[0.03] overflow-x-auto min-h-[64px]">
          <div className="text-white text-base font-mono tracking-wide">
            <BlockMath math={mathToShow} />
          </div>
        </div>
      </div>

      {/* Bottom actions row */}
      <div className="flex items-center gap-2 mt-1">
        {/* Sigma Symbol Button */}
        <button
          onClick={() => setTheoryInput("Einstein field equations of general relativity")}
          className="w-9 h-9 glass rounded-lg flex items-center justify-center text-white/40 hover:text-neon-cyan hover:border-neon-cyan/30 border border-white/[0.06] transition-all cursor-pointer"
          title="Insert Sigma Math"
        >
          <Sigma size={15} />
        </button>

        {/* Preset Wand Button */}
        <button
          onClick={() => {
            setTheoryInput("General relativity spacetime curvature gravitational field");
            setEquationInput("G_{\\mu\\nu} + \\Lambda g_{\\mu\\nu} = \\frac{8\\pi G}{c^4} T_{\\mu\\nu}");
          }}
          className="w-9 h-9 glass rounded-lg flex items-center justify-center text-white/40 hover:text-neon-cyan hover:border-neon-cyan/30 border border-white/[0.06] transition-all cursor-pointer"
          title="Load Einstein Preset"
        >
          <Wand2 size={15} />
        </button>

        <div className="flex-1" />

        {/* Build Reality Button */}
        <BuildRealityButton
          onBuild={handleBuild}
          isBuilding={isBuilding}
          disabled={!theoryInput.trim() && !equationInput.trim()}
        />
      </div>
    </div>
  );
}

function BuildRealityButton({
  onBuild,
  isBuilding,
  disabled,
}: {
  onBuild: () => void;
  isBuilding: boolean;
  disabled: boolean;
}) {
  return (
    <motion.button
      onClick={onBuild}
      disabled={disabled || isBuilding}
      className={`
        flex items-center gap-2.5 px-6 py-2 rounded-lg text-[10px] font-bold tracking-widest uppercase
        transition-all duration-300 relative overflow-hidden border cursor-pointer select-none
        ${disabled
          ? "bg-white/[0.03] text-white/20 border-white/[0.06] cursor-not-allowed"
          : "bg-gradient-to-r from-neon-purple/80 to-neon-blue/80 text-white border-neon-blue/40 shadow-[0_0_12px_rgba(0,168,255,0.2)]"
        }
      `}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
    >
      {/* Shimmer overlay */}
      {!disabled && !isBuilding && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 2.0, repeat: Infinity, ease: "linear" }}
        />
      )}

      {isBuilding ? (
        <>
          <Loader2 size={12} className="animate-spin text-neon-cyan" />
          <span>Building...</span>
        </>
      ) : (
        <>
          <span>BUILD REALITY</span>
          <ChevronRight size={12} />
        </>
      )}
    </motion.button>
  );
}

function ChevronRight({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}
