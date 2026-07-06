from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import sympy as sp
from sympy.parsing.sympy_parser import parse_expr
from pint import UnitRegistry

router = APIRouter()
ureg = UnitRegistry()

class ParseRequest(BaseModel):
    equation: str

class SimplifyRequest(BaseModel):
    expr: str

class DifferentiateRequest(BaseModel):
    expr: str
    var: str = "x"

class SolveRequest(BaseModel):
    equation: str
    var: str

class UnitCheckRequest(BaseModel):
    expr1: str
    expr2: str

@router.post("/parse")
def parse_equation(req: ParseRequest):
    try:
        # Basic parsing check using SymPy
        parsed = sp.sympify(req.equation)
        return {
            "success": True,
            "parsed": str(parsed),
            "latex": sp.latex(parsed),
            "free_symbols": [str(s) for s in parsed.free_symbols]
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse equation: {str(e)}")

@router.post("/simplify")
def simplify_expression(req: SimplifyRequest):
    try:
        expr = sp.sympify(req.expr)
        simplified = sp.simplify(expr)
        return {
            "success": True,
            "original": req.expr,
            "simplified": str(simplified),
            "latex": sp.latex(simplified)
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to simplify expression: {str(e)}")

@router.post("/differentiate")
def differentiate_expression(req: DifferentiateRequest):
    try:
        expr = sp.sympify(req.expr)
        var = sp.Symbol(req.var)
        diff = sp.diff(expr, var)
        return {
            "success": True,
            "expression": req.expr,
            "variable": req.var,
            "derivative": str(diff),
            "latex": sp.latex(diff)
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to differentiate: {str(e)}")

@router.post("/solve")
def solve_equation(req: SolveRequest):
    try:
        # Solve equation (assumed to be expr = 0)
        expr = sp.sympify(req.equation)
        var = sp.Symbol(req.var)
        solutions = sp.solve(expr, var)
        return {
            "success": True,
            "equation": req.equation,
            "variable": req.var,
            "solutions": [str(sol) for sol in solutions],
            "latex_solutions": [sp.latex(sol) for sol in solutions]
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to solve equation: {str(e)}")

@router.post("/check-units")
def check_units(req: UnitCheckRequest):
    try:
        u1 = ureg(req.expr1)
        u2 = ureg(req.expr2)
        compatible = u1.compatibility(u2)
        return {
            "success": True,
            "compatible": compatible,
            "expr1_dimensionality": str(u1.dimensionality),
            "expr2_dimensionality": str(u2.dimensionality)
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed unit check: {str(e)}")
