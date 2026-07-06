from fastapi import APIRouter
from pydantic import BaseModel
import numpy as np

router = APIRouter()

class SimulationState(BaseModel):
    positions: list[list[float]]  # List of [x, y, z]
    velocities: list[list[float]]  # List of [vx, vy, vz]
    masses: list[float]
    dt: float = 0.016  # 60fps tick

class OrbitalRequest(BaseModel):
    central_mass: float
    orbital_radius: float
    num_points: int = 100

class GravityFieldRequest(BaseModel):
    mass_positions: list[list[float]]
    mass_values: list[float]
    grid_size: float = 10.0
    resolution: int = 10

@router.post("/simulate")
def simulate_step(state: SimulationState):
    # Standard N-body gravitation solver using NumPy
    pos = np.array(state.positions)
    vel = np.array(state.velocities)
    mass = np.array(state.masses)
    dt = state.dt
    G = 1.0  # Normalized gravitational constant for visualization scale

    n = len(mass)
    if n == 0:
        return {"positions": [], "velocities": []}

    acc = np.zeros_like(pos)

    # Calculate pairwise gravitational force/acceleration
    for i in range(n):
        for j in range(n):
            if i == j:
                continue
            r_vec = pos[j] - pos[i]
            dist = np.linalg.norm(r_vec) + 0.1  # Softening factor to prevent infinity
            force = G * mass[j] / (dist ** 2)
            acc[i] += force * (r_vec / dist)

    # Symplectic Euler integration step
    new_vel = vel + acc * dt
    new_pos = pos + new_vel * dt

    return {
        "positions": new_pos.tolist(),
        "velocities": new_vel.tolist(),
        "accelerations": acc.tolist(),
    }

@router.post("/orbital")
def compute_orbital_trajectory(req: OrbitalRequest):
    # Newton's Keplerian orbit path points
    # Standard circle trajectory
    # v = sqrt(G*M/r)
    G = 1.0
    M = req.central_mass
    r = req.orbital_radius
    v = np.sqrt(G * M / r) if r > 0 else 0

    points = []
    for i in range(req.num_points):
        theta = (i / req.num_points) * 2 * np.PI
        x = r * np.cos(theta)
        z = r * np.sin(theta)
        points.append([x, 0.0, z])

    return {
        "velocity": float(v),
        "points": points,
    }

@router.post("/gravity")
def compute_gravity_field(req: GravityFieldRequest):
    # Compute field vector grid for visualization
    res = req.resolution
    size = req.grid_size
    xs = np.linspace(-size/2, size/2, res)
    ys = np.linspace(-size/2, size/2, res)

    grid_points = []
    vectors = []

    for x in xs:
        for y in ys:
            # Field vectors in x-z plane (y=0 in 3D workspace)
            px, pz = float(x), float(y)
            fx, fz = 0.0, 0.0
            
            for m_pos, mass in zip(req.mass_positions, req.mass_values):
                mx, mz = m_pos[0], m_pos[2]
                dx = mx - px
                dz = mz - pz
                dist = np.sqrt(dx*dx + dz*dz) + 0.5
                f = mass / (dist * dist)
                fx += f * (dx / dist)
                fz += f * (dz / dist)
            
            grid_points.append([px, 0.0, pz])
            vectors.append([fx, 0.0, fz])

    return {
        "points": grid_points,
        "vectors": vectors,
    }
