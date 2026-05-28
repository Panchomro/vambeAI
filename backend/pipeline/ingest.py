"""Load CSV data into the database. Safe to re-run (skips existing records)."""
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

import pandas as pd
from database import engine, SessionLocal
from models import Client, Base

Base.metadata.create_all(bind=engine)


def ingest_csv(csv_path: str):
    df = pd.read_csv(csv_path, encoding="utf-8")
    df.columns = [c.strip() for c in df.columns]

    column_map = {
        "Nombre": "nombre",
        "Correo Electronico": "correo",
        "Numero de Telefono": "telefono",
        "Fecha de la Reunion": "fecha_reunion",
        "Vendedor asignado": "vendedor",
        "closed": "closed",
        "Transcripcion": "transcripcion",
    }
    df = df.rename(columns=column_map)

    required = list(column_map.values())
    missing = [c for c in required if c not in df.columns]
    if missing:
        raise ValueError(f"Missing columns in CSV: {missing}")

    db = SessionLocal()
    try:
        existing_count = db.query(Client).count()
        if existing_count > 0:
            print(f"Database already has {existing_count} records — skipping ingest.")
            return existing_count

        records = []
        for _, row in df.iterrows():
            records.append(Client(
                nombre=str(row["nombre"]),
                correo=str(row["correo"]),
                telefono=str(row["telefono"]),
                fecha_reunion=str(row["fecha_reunion"]),
                vendedor=str(row["vendedor"]),
                closed=int(row["closed"]),
                transcripcion=str(row["transcripcion"]),
                categorized=False,
            ))

        db.bulk_save_objects(records)
        db.commit()
        print(f"Ingested {len(records)} records.")
        return len(records)
    finally:
        db.close()


if __name__ == "__main__":
    from dotenv import load_dotenv
    load_dotenv()
    path = os.getenv("CSV_PATH", "../vambe_clients_10k.csv")
    ingest_csv(path)
