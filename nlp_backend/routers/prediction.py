
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from nlp_backend.services.catalog import CatalogService, Pictogram
from nlp_backend.services.prediction import PredictionService

router = APIRouter()

class PictoItem(BaseModel):
    id: int
    labels: dict
    image_urls: dict
    pos: Optional[str] = None

class PredictionRequest(BaseModel):
    sequence: List[PictoItem]

class Suggestion(BaseModel):
    label: str
    type: str # 'category' or 'search'
    value: str

class PredictionResponse(BaseModel):
    suggestions: List[Suggestion]

@router.post("/predict-next", response_model=PredictionResponse)
async def predict_next(request: PredictionRequest):
    service = PredictionService.get_instance()
    catalog = CatalogService.get_instance()
    
    # Convert input dicts back to Pictogram objects to use in service (if needed)
    # Actually service uses them as dicts mostly or we re-construct
    # Let's reconstruct to ensure we have 'pos' if client didn't send it but we have it in DB?
    # Client might send just ID? 
    # For now, trust client sends what it has, but ideally we look up by ID.
    
    real_sequence = []
    for item in request.sequence:
        # Try to look up in catalog to get fresh POS
        cached = catalog.get_by_id(item.id)
        if cached:
            real_sequence.append(cached)
        else:
            # Fallback to client data
            real_sequence.append(Pictogram(**item.dict()))
            
    suggestions = service.predict_next(real_sequence)
    
    return {"suggestions": suggestions}
