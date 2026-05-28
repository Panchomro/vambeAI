from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine
from models import Base
from routers import clients, metrics

Base.metadata.create_all(bind=engine)

app = FastAPI(title="VambeAI Dashboard API", version="1.0.0")

import os

_origins_env = os.getenv("ALLOWED_ORIGINS", "")
allow_origins = _origins_env.split(",") if _origins_env else ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(clients.router)
app.include_router(metrics.router)


@app.get("/health")
def health():
    return {"status": "ok"}
