from fastapi import APIRouter
from pydantic import BaseModel
import uuid
import re

router = APIRouter()

class BuildRealityRequest(BaseModel):
    theory: str = ""
    equation: str = ""

KNOWN_CONSTANTS = {
    "G": {"name": "Gravitational Constant", "value": 6.674e-11, "unit": "m³/kg/s²", "latex": "G", "editable": False},
    "c": {"name": "Speed of Light", "value": 299792458.0, "unit": "m/s", "latex": "c", "editable": False},
    "hbar": {"name": "Reduced Planck Constant", "value": 1.054e-34, "unit": "J·s", "latex": "\\hbar", "editable": False},
    "h": {"name": "Planck Constant", "value": 6.626e-34, "unit": "J·s", "latex": "h", "editable": False},
    "epsilon_0": {"name": "Permittivity of Free Space", "value": 8.854e-12, "unit": "F/m", "latex": "\\varepsilon_0", "editable": False},
    "mu_0": {"name": "Permeability of Free Space", "value": 1.257e-6, "unit": "H/m", "latex": "\\mu_0", "editable": False},
    "M": {"name": "Central Mass", "value": 1.0e30, "unit": "kg", "latex": "M", "editable": True},
    "m": {"name": "Test Mass", "value": 1.0, "unit": "kg", "latex": "m", "editable": True},
    "r": {"name": "Radius", "value": 2.0, "unit": "m", "latex": "r", "editable": True},
    "omega": {"name": "Angular Frequency", "value": 2.5, "unit": "rad/s", "latex": "\\omega", "editable": True},
    "f": {"name": "Frequency", "value": 1.5, "unit": "Hz", "latex": "f", "editable": True},
    "A": {"name": "Amplitude", "value": 0.8, "unit": "m", "latex": "A", "editable": True},
    "v": {"name": "Velocity", "value": 1.0, "unit": "m/s", "latex": "v", "editable": True},
    "Lambda": {"name": "Cosmological Constant", "value": 1.105e-52, "unit": "m⁻²", "latex": "\\Lambda", "editable": True},
    "H_0": {"name": "Hubble Constant", "value": 67.4, "unit": "km/s/Mpc", "latex": "H_0", "editable": True},
}

MATH_FUNCS = {"sin", "cos", "tan", "exp", "log", "sqrt", "diff", "d", "dt", "dx", "pi", "t", "x", "y", "z", "i", "hat", "partial", "nabla"}

def make_id():
    return str(uuid.uuid4())

def make_obj(obj_type: str, label: str, pos: tuple[float, float, float], props: dict, color: str, em_color: str):
    return {
        "id": make_id(),
        "type": obj_type,
        "label": label,
        "position": {"x": pos[0], "y": pos[1], "z": pos[2]},
        "rotation": {"x": 0.0, "y": 0.0, "z": 0.0, "w": 1.0},
        "scale": {"x": 1.0, "y": 1.0, "z": 1.0},
        "color": color,
        "emissiveColor": em_color,
        "emissiveIntensity": 1.5,
        "properties": props,
        "equations": [],
        "locked": False,
        "visible": True,
        "selected": False,
    }

@router.post("/build-reality")
def build_reality(req: BuildRealityRequest):
    theory = req.theory.strip()
    equation = req.equation.strip()

    # Fallbacks/generators if one is missing
    if theory and not equation:
        equation = infer_equation_from_theory(theory)
    elif equation and not theory:
        theory = infer_theory_from_equation(equation)
    elif not theory and not equation:
        theory = "Quantum mechanics field packet"
        equation = "i\\hbar \\frac{\\partial \\psi}{\\partial t} = \\hat{H}\\psi"

    input_text = f"{theory} {equation}".lower()

    # Extract symbols to build dynamic variables list
    extracted_symbols = re.findall(r'\b[a-zA-Z_\\alpha-\\omega\\Lambda\\psi\\hbar\\varepsilon_0\\mu_0]+\b', equation)
    symbols_to_use = set(s for s in extracted_symbols if s not in MATH_FUNCS)

    variables = []
    for sym in symbols_to_use:
        # Check standard constants
        matched = False
        for key, val in KNOWN_CONSTANTS.items():
            if sym.lower() == key.lower() or sym.replace("\\", "") == key.lower():
                variables.append({
                    "id": make_id(),
                    "symbol": key,
                    "name": val["name"],
                    "value": val["value"],
                    "unit": val["unit"],
                    "latex": val["latex"],
                    "editable": val["editable"]
                })
                matched = True
                break
        if not matched:
            # Custom variable
            variables.append({
                "id": make_id(),
                "symbol": sym,
                "name": f"Parameter {sym}",
                "value": 1.0,
                "unit": "",
                "latex": sym,
                "editable": True
            })

    # Ensure at least one variable
    if not variables:
        variables.append({
            "id": make_id(),
            "symbol": "k",
            "name": "Wavenumber",
            "value": 1.0,
            "unit": "rad/m",
            "latex": "k",
            "editable": True
        })

    # Dynamic Object synthesis
    objects = []
    
    # Schwarzschild / Curvature checking
    if any(k in input_text for k in ["einstein", "schwarzschild", "singularity", "g_", "g_{", "curvature", "relativity"]):
        objects.append(make_obj("blackhole", "Schwarzschild Horizon", (0, 0, 0), {"mass": 1e30, "accretionRadius": 2.5, "lensStrength": 3}, "#000000", "#00A8FF"))
        objects.append(make_obj("grid", "Curved Spacetime", (0, -0.5, 0), {"size": 12, "divisions": 28, "curvature": 2.5}, "#00A8FF", "#00A8FF"))
    
    # Orbit / Gravity checking
    elif any(k in input_text for k in ["gravity", "newton", "orbit", "kepler", "gravitational"]):
        objects.append(make_obj("star", "Central Mass M", (0, 0, 0), {"radius": 0.8, "temperature": 6000}, "#FFD700", "#FF8C00"))
        objects.append(make_obj("particle", "Orbiting Cloud", (0, 0, 0), {"count": 1500, "spread": 4, "speed": 0.015}, "#00F5FF", "#00F5FF"))
        objects.append(make_obj("grid", "Gravity Well", (0, -0.8, 0), {"size": 12, "divisions": 24, "curvature": 1.5}, "#7B2FFF", "#7B2FFF"))

    # Quantum checking
    elif any(k in input_text for k in ["quantum", "schrodinger", "schrödinger", "psi", "wavefunction"]):
        objects.append(make_obj("wave", "Wave Function ψ", (0, 0, 0), {"amplitude": 0.8, "frequency": 3.0, "speed": 1.5, "resolution": 80}, "#A855F7", "#7B2FFF"))
        objects.append(make_obj("particle", "Quantum Foam", (0, 1.0, 0), {"count": 3000, "spread": 5, "speed": 0.03}, "#00F5FF", "#00F5FF"))

    # Maxwell checking
    elif any(k in input_text for k in ["maxwell", "electromagnetic", "electric", "magnetic", "field"]):
        objects.append(make_obj("field", "Force Field E/B", (0, 0, 0), {"strength": 1.2, "lineCount": 20, "range": 4}, "#00A8FF", "#00A8FF"))
        objects.append(make_obj("wave", "Wave Oscillation", (0, 0, -4.0), {"amplitude": 0.5, "frequency": 4.0, "speed": 2.0, "resolution": 60}, "#00F5FF", "#00F5FF"))

    # Cosmology checking
    elif any(k in input_text for k in ["galaxy", "milky way", "universe", "cosmology", "hubble"]):
        objects.append(make_obj("galaxy", "Galactic Cluster", (0, 0, 0), {"arms": 4, "particleCount": 8000, "radius": 4.0, "rotationSpeed": 0.04}, "#7B2FFF", "#A855F7"))
        objects.append(make_obj("particle", "Cosmic Web", (0, 0, 0), {"count": 2000, "spread": 6, "speed": 0.005}, "#00F5FF", "#00F5FF"))

    # Default fallback generator based on variables
    else:
        # Check symbols for hints
        if any(s in symbols_to_use for s in ["omega", "f", "A", "psi"]):
            objects.append(make_obj("wave", "Custom Wave Oscillation", (0, 0, 0), {"amplitude": 0.8, "frequency": 2.5, "speed": 1.2, "resolution": 70}, "#A855F7", "#00F5FF"))
        elif any(s in symbols_to_use for s in ["G", "M", "r"]):
            objects.append(make_obj("star", "Core Mass", (0, 0, 0), {"radius": 0.6, "temperature": 5000}, "#FFD700", "#FF8C00"))
            objects.append(make_obj("grid", "Curved Surface", (0, -0.5, 0), {"size": 10, "divisions": 20, "curvature": 1.0}, "#00A8FF", "#00A8FF"))
        else:
            objects.append(make_obj("particle", "Quantum System Particles", (0, 0, 0), {"count": 2000, "spread": 4.0, "speed": 0.02}, "#00A8FF", "#00A8FF"))
            objects.append(make_obj("grid", "Quantum Spacetime Grid", (0, -1.0, 0), {"size": 10.0, "divisions": 20, "curvature": 0.5}, "#7B2FFF", "#7B2FFF"))

    description = f"Compiled AI Reality: Synthesized custom system mapping the mathematical model: '{equation}'. Loaded {len(objects)} simulation elements."

    return {
        "objects": objects,
        "variables": variables,
        "equations": [
            {
                "id": make_id(),
                "latex": equation,
                "sympyExpr": equation,
                "description": theory,
                "variables": [v["symbol"] for v in variables],
                "isValid": True
            }
        ],
        "description": description
    }

def infer_equation_from_theory(theory: str) -> str:
    t = theory.lower()
    if "einstein" in t or "general relativity" in t or "curvature" in t:
        return "G_{\\mu\\nu} + \\Lambda g_{\\mu\\nu} = \\frac{8\\pi G}{c^4} T_{\\mu\\nu}"
    elif "gravity" in t or "newton" in t:
        return "F = \\frac{GMm}{r^2}"
    elif "quantum" in t or "schrodinger" in t or "schrödinger" in t:
        return "i\\hbar \\frac{\\partial \\psi}{\\partial t} = \\hat{H}\\psi"
    elif "maxwell" in t or "electromagnetic" in t or "electric" in t or "magnetic" in t:
        return "\\nabla \\times \\mathbf{B} = \\mu_0 \\mathbf{J} + \\mu_0\\varepsilon_0 \\frac{\\partial \\mathbf{E}}{\\partial t}"
    elif "hubble" in t or "cosmology" in t:
        return "H(z) = H_0 \\sqrt{\\Omega_m(1+z)^3 + \\Omega_\\Lambda}"
    return "E = mc^2"

def infer_theory_from_equation(equation: str) -> str:
    eq = equation.replace(" ", "")
    if "G_" in eq or "\\Lambda" in eq or "T_" in eq:
        return "Einstein General Relativity Spacetime Curvature"
    elif "F=" in eq or "GM" in eq or "r^2" in eq:
        return "Newtonian Gravitational Interaction"
    elif "\\psi" in eq or "\\hbar" in eq or "\\hat{H}" in eq:
        return "Time-Dependent Schrödinger Wave Equation"
    elif "nabla" in eq or "\\mathbf{E}" in eq or "\\mathbf{B}" in eq or "\\mu_0" in eq:
        return "Maxwell Electrodynamics Field Vector Equations"
    elif "H_" in eq or "z" in eq:
        return "Friedmann Cosmology Universe Expansion"
    return "Mass-Energy Equivalent Reality"
