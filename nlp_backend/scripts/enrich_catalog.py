
import json
import os
import spacy
from tqdm import tqdm

def enrich_catalog():
    # Paths
    input_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data', 'arasaac_catalog.jsonl')
    output_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data', 'arasaac_catalog_enriched.jsonl')

    if not os.path.exists(input_path):
        print(f"Error: Input file not found at {input_path}")
        return

    print("Loading SpaCy model...")
    try:
        nlp = spacy.load("es_core_news_sm")
    except OSError:
        print("Error: SpaCy model 'es_core_news_sm' not found. Please run 'python -m spacy download es_core_news_sm'")
        return

    print("Processing catalog...")
    
    enriched_count = 0
    with open(input_path, 'r', encoding='utf-8') as fin, \
         open(output_path, 'w', encoding='utf-8') as fout:
        
        lines = fin.readlines()
        for line in tqdm(lines, desc="Enriching pictograms"):
            if not line.strip():
                continue
                
            try:
                data = json.loads(line)
                
                # Get the main Spanish label
                labels = data.get('labels', {})
                es_label = labels.get('es')
                
                if es_label:
                    # Process with SpaCy
                    doc = nlp(es_label)
                    
                    # Heuristic: Take the POS of the root token or the first meaningful token
                    # Ideally, single words are easy. Multi-word phrases need more care.
                    # For a SAAC system, we care if it acts as a NOUN, VERB, ADJ, etc.
                    
                    main_token = None
                    if len(doc) == 1:
                        main_token = doc[0]
                    else:
                        # For phrases like "lavarse los dientes", root is "lavarse" (VERB)
                        for token in doc:
                            if token.dep_ == "ROOT":
                                main_token = token
                                break
                                
                    if main_token:
                        pos = main_token.pos_
                        # Simplify POS tags for our frontend logic
                        # PROPN -> NOUN
                        if pos == "PROPN":
                            pos = "NOUN"
                        
                        data['pos'] = pos
                    else:
                        data['pos'] = "UNKNOWN"
                        
                else:
                    data['pos'] = "UNKNOWN"

                # Write enriched data
                fout.write(json.dumps(data, ensure_ascii=False) + '\n')
                enriched_count += 1
                
            except json.JSONDecodeError:
                continue

    print(f"Finished. Enriched {enriched_count} pictograms.")
    print(f"Output saved to {output_path}")

if __name__ == "__main__":
    enrich_catalog()
