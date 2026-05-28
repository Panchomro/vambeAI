"""LLM categorization pipeline using Groq. Resumable — skips already-processed records."""
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

import json
import time
from groq import Groq
from dotenv import load_dotenv
from database import SessionLocal
from models import Client

load_dotenv()

GROQ_MODEL = "llama-3.3-70b-versatile"
# Groq free tier: 30 req/min → 1 call every 2.1s to stay safe
RATE_LIMIT_SLEEP = 2.1

SYSTEM_PROMPT = """Eres un analista experto en ventas B2B. Tu tarea es analizar transcripciones de reuniones de ventas en español y extraer dimensiones estratégicas para el equipo comercial.

Debes responder ÚNICAMENTE con un objeto JSON válido, sin texto adicional ni markdown."""

USER_TEMPLATE = """Analiza esta transcripción de reunión de ventas y extrae las dimensiones indicadas.

TRANSCRIPCIÓN:
{transcript}

Responde SOLO con este JSON (valores exactos indicados):
{{
  "sentimiento": "<positivo|neutral|negativo>",
  "urgencia": "<alta|media|baja>",
  "objecion_principal": "<precio|tiempo|necesidad|competencia|ninguna>",
  "ajuste_producto": "<excelente|bueno|regular|bajo>",
  "industria": "<retail|salud|ecommerce|restaurante|seguros|educacion|logistica|farmacia|fitness|otro>",
  "etapa_cliente": "<descubrimiento|evaluacion|negociacion|listo_para_cerrar>",
  "es_decisor": "<si|no|parcialmente>",
  "accion_seguimiento": "<demo|propuesta|llamada|contrato|ninguna>",
  "menciona_competencia": <true|false>,
  "puntos_dolor": ["<dolor1>", "<dolor2>"]
}}"""


def categorize_transcript(client: Groq, transcript: str) -> dict:
    response = client.chat.completions.create(
        model=GROQ_MODEL,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": USER_TEMPLATE.format(transcript=transcript[:3000])},
        ],
        response_format={"type": "json_object"},
        temperature=0.1,
        max_tokens=400,
    )
    raw = response.choices[0].message.content
    return json.loads(raw)


def run_pipeline(limit: int = None):
    groq_client = Groq(api_key=os.environ["GROQ_API_KEY"])
    db = SessionLocal()

    try:
        query = db.query(Client).filter(Client.categorized == False)
        if limit:
            query = query.limit(limit)

        pending = query.all()
        total = len(pending)
        print(f"Starting categorization of {total} records...")

        for i, client_record in enumerate(pending):
            try:
                result = categorize_transcript(groq_client, client_record.transcripcion)

                client_record.sentimiento = result.get("sentimiento")
                client_record.urgencia = result.get("urgencia")
                client_record.objecion_principal = result.get("objecion_principal")
                client_record.ajuste_producto = result.get("ajuste_producto")
                client_record.industria = result.get("industria")
                client_record.etapa_cliente = result.get("etapa_cliente")
                client_record.es_decisor = result.get("es_decisor")
                client_record.accion_seguimiento = result.get("accion_seguimiento")
                client_record.menciona_competencia = result.get("menciona_competencia", False)
                client_record.puntos_dolor = json.dumps(result.get("puntos_dolor", []), ensure_ascii=False)
                client_record.categorized = True

                db.commit()

                progress = ((i + 1) / total) * 100
                print(f"[{i+1}/{total}] {progress:.1f}% — {client_record.nombre}")

            except Exception as e:
                print(f"[{i+1}/{total}] ERROR for id={client_record.id}: {e}")
                db.rollback()

            if i < total - 1:
                time.sleep(RATE_LIMIT_SLEEP)

        print("Pipeline complete.")
    finally:
        db.close()


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--limit", type=int, default=None, help="Max records to process (default: all)")
    args = parser.parse_args()
    run_pipeline(limit=args.limit)
