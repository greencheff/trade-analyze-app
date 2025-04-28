import inspect
import app.indicators as indicators
from fastapi import APIRouter

router = APIRouter()

@router.get("/indicators")
async def list_indicators():
    indicator_list = [
        name for name, func in inspect.getmembers(indicators, inspect.isfunction)
        if name.startswith("calculate_")
    ]
    return {"indicators": indicator_list}
