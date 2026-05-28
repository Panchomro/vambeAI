import json
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import Optional
from database import get_db
from models import Client
from schemas import ClientBase, ClientDetail, PaginatedClients

router = APIRouter(prefix="/api/clients", tags=["clients"])


def _serialize(c: Client) -> dict:
    d = {
        "id": c.id,
        "nombre": c.nombre,
        "correo": c.correo,
        "telefono": c.telefono,
        "fecha_reunion": c.fecha_reunion,
        "vendedor": c.vendedor,
        "closed": c.closed,
        "categorized": c.categorized,
        "sentimiento": c.sentimiento,
        "urgencia": c.urgencia,
        "objecion_principal": c.objecion_principal,
        "ajuste_producto": c.ajuste_producto,
        "industria": c.industria,
        "etapa_cliente": c.etapa_cliente,
        "es_decisor": c.es_decisor,
        "accion_seguimiento": c.accion_seguimiento,
        "menciona_competencia": c.menciona_competencia,
        "puntos_dolor": json.loads(c.puntos_dolor) if c.puntos_dolor else [],
    }
    return d


@router.get("", response_model=PaginatedClients)
def list_clients(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = None,
    vendedor: Optional[str] = None,
    closed: Optional[int] = None,
    sentimiento: Optional[str] = None,
    urgencia: Optional[str] = None,
    objecion_principal: Optional[str] = None,
    ajuste_producto: Optional[str] = None,
    industria: Optional[str] = None,
    etapa_cliente: Optional[str] = None,
    es_decisor: Optional[str] = None,
    accion_seguimiento: Optional[str] = None,
    menciona_competencia: Optional[bool] = None,
    fecha_desde: Optional[str] = None,
    fecha_hasta: Optional[str] = None,
    db: Session = Depends(get_db),
):
    q = db.query(Client)

    if search:
        term = f"%{search}%"
        q = q.filter(or_(Client.nombre.ilike(term), Client.correo.ilike(term), Client.vendedor.ilike(term)))
    if vendedor:
        q = q.filter(Client.vendedor == vendedor)
    if closed is not None:
        q = q.filter(Client.closed == closed)
    if sentimiento:
        q = q.filter(Client.sentimiento == sentimiento)
    if urgencia:
        q = q.filter(Client.urgencia == urgencia)
    if objecion_principal:
        q = q.filter(Client.objecion_principal == objecion_principal)
    if ajuste_producto:
        q = q.filter(Client.ajuste_producto == ajuste_producto)
    if industria:
        q = q.filter(Client.industria == industria)
    if etapa_cliente:
        q = q.filter(Client.etapa_cliente == etapa_cliente)
    if es_decisor:
        q = q.filter(Client.es_decisor == es_decisor)
    if accion_seguimiento:
        q = q.filter(Client.accion_seguimiento == accion_seguimiento)
    if menciona_competencia is not None:
        q = q.filter(Client.menciona_competencia == menciona_competencia)
    if fecha_desde:
        q = q.filter(Client.fecha_reunion >= fecha_desde)
    if fecha_hasta:
        q = q.filter(Client.fecha_reunion <= fecha_hasta)

    total = q.count()
    offset = (page - 1) * limit
    rows = q.offset(offset).limit(limit).all()

    return PaginatedClients(
        total=total,
        page=page,
        limit=limit,
        data=[ClientBase(**_serialize(c)) for c in rows],
    )


@router.get("/{client_id}", response_model=ClientDetail)
def get_client(client_id: int, db: Session = Depends(get_db)):
    c = db.query(Client).filter(Client.id == client_id).first()
    if not c:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Client not found")
    d = _serialize(c)
    d["transcripcion"] = c.transcripcion
    return ClientDetail(**d)
