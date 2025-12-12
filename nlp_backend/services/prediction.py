
from typing import List, Dict
from nlp_backend.services.catalog import CatalogService, Pictogram

class PredictionService:
    _instance = None
    
    def __init__(self):
        self.catalog = CatalogService.get_instance()
        
    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def predict_next(self, current_sequence: List[Pictogram]) -> List[Dict[str, str]]:
        """
        Returns a list of suggested categories or search terms based on the last item's POS.
        Format: [{"label": "Acciones", "type": "category", "value": "verbs"}, ...]
        """
        suggestions = []
        
        if not current_sequence:
            # Start of sentence: Suggest Subjects (Pronouns) or Common Needs
            return [
                {"label": "Personas", "type": "category", "value": "personas"},
                {"label": "Necesidades", "type": "category", "value": "necesidades_básicas"},
                {"label": "Sentimientos", "type": "category", "value": "sentimientos"},
            ]
            
        last_item = current_sequence[-1]
        last_pos = last_item.pos
        
        # Simple Grammar Rules
        
        # 1. Subject (NOUN/PRON) -> Verb
        if last_pos in ["NOUN", "PRON", "PROPN"]:
            suggestions.append({"label": "Acciones", "type": "category", "value": "verbos"})
            suggestions.append({"label": "Quiero...", "type": "search", "value": "querer"})
            suggestions.append({"label": "Sentimientos", "type": "category", "value": "sentimientos"})
            
        # 2. Verb (VERB) -> Object (Noun)
        elif last_pos == "VERB":
            # Contextualize based on specific verbs?
            # For now, generic nouns
            suggestions.append({"label": "Alimentos", "type": "category", "value": "alimentos"})
            suggestions.append({"label": "Juguetes", "type": "category", "value": "juegos"})
            suggestions.append({"label": "Lugares", "type": "category", "value": "lugares"})
            suggestions.append({"label": "Ropa", "type": "category", "value": "ropa"})
            
        # 3. Adjective -> Noun? Or Noun -> Adjective
        # If Noun, we already suggested verb. Maybe also suggest Adjectives?
        if last_pos == "NOUN":
             suggestions.append({"label": "Cualidades", "type": "category", "value": "descriptivos"})

        # Fallback if no specific rule
        if not suggestions:
             suggestions.append({"label": "Acciones", "type": "category", "value": "verbos"})
             suggestions.append({"label": "Cosas", "type": "category", "value": "objetos"})

        return suggestions
