from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
from models import Client
from schemas import OverviewMetrics, PipelineStatus, MetricCount
from typing import List

router = APIRouter(prefix="/api/metrics", tags=["metrics"])


def _close_rate(closed: int, total: int) -> float:
    return round((closed / total) * 100, 1) if total > 0 else 0.0


@router.get("/status", response_model=PipelineStatus)
def pipeline_status(db: Session = Depends(get_db)):
    total = db.query(Client).count()
    categorized = db.query(Client).filter(Client.categorized == True).count()
    return PipelineStatus(
        total=total,
        categorized=categorized,
        pending=total - categorized,
        progress_pct=round((categorized / total) * 100, 1) if total > 0 else 0.0,
    )


@router.get("/overview", response_model=OverviewMetrics)
def overview(db: Session = Depends(get_db)):
    total = db.query(Client).count()
    categorized = db.query(Client).filter(Client.categorized == True).count()
    closed_total = db.query(Client).filter(Client.closed == 1).count()

    positive_total = db.query(Client).filter(Client.sentimiento == "positivo").count()
    positive_closed = db.query(Client).filter(Client.sentimiento == "positivo", Client.closed == 1).count()

    high_urgency = db.query(Client).filter(Client.urgencia == "alta").count()

    # Top objection
    top_obj_row = (
        db.query(Client.objecion_principal, func.count(Client.id).label("cnt"))
        .filter(Client.objecion_principal != None, Client.objecion_principal != "ninguna")
        .group_by(Client.objecion_principal)
        .order_by(func.count(Client.id).desc())
        .first()
    )
    top_objection = top_obj_row[0] if top_obj_row else "ninguna"

    return OverviewMetrics(
        total_clients=total,
        total_categorized=categorized,
        close_rate=_close_rate(closed_total, total),
        positive_close_rate=_close_rate(positive_closed, positive_total),
        high_urgency_rate=_close_rate(high_urgency, categorized),
        top_objection=top_objection,
    )


@router.get("/by-sentiment", response_model=List[MetricCount])
def by_sentiment(db: Session = Depends(get_db)):
    rows = (
        db.query(Client.sentimiento, func.count(Client.id), func.sum(Client.closed))
        .filter(Client.sentimiento != None)
        .group_by(Client.sentimiento)
        .all()
    )
    return [
        MetricCount(label=r[0], count=r[1], close_rate=_close_rate(r[2] or 0, r[1]))
        for r in rows
    ]


@router.get("/by-objection", response_model=List[MetricCount])
def by_objection(db: Session = Depends(get_db)):
    rows = (
        db.query(Client.objecion_principal, func.count(Client.id), func.sum(Client.closed))
        .filter(Client.objecion_principal != None)
        .group_by(Client.objecion_principal)
        .order_by(func.count(Client.id).desc())
        .all()
    )
    return [
        MetricCount(label=r[0], count=r[1], close_rate=_close_rate(r[2] or 0, r[1]))
        for r in rows
    ]


@router.get("/by-industry", response_model=List[MetricCount])
def by_industry(db: Session = Depends(get_db)):
    rows = (
        db.query(Client.industria, func.count(Client.id), func.sum(Client.closed))
        .filter(Client.industria != None)
        .group_by(Client.industria)
        .order_by(func.count(Client.id).desc())
        .all()
    )
    return [
        MetricCount(label=r[0], count=r[1], close_rate=_close_rate(r[2] or 0, r[1]))
        for r in rows
    ]


@router.get("/by-stage", response_model=List[MetricCount])
def by_stage(db: Session = Depends(get_db)):
    stage_order = ["descubrimiento", "evaluacion", "negociacion", "listo_para_cerrar"]
    rows = (
        db.query(Client.etapa_cliente, func.count(Client.id), func.sum(Client.closed))
        .filter(Client.etapa_cliente != None)
        .group_by(Client.etapa_cliente)
        .all()
    )
    result = {r[0]: MetricCount(label=r[0], count=r[1], close_rate=_close_rate(r[2] or 0, r[1])) for r in rows}
    return [result[s] for s in stage_order if s in result]


@router.get("/by-salesperson", response_model=List[MetricCount])
def by_salesperson(db: Session = Depends(get_db)):
    rows = (
        db.query(Client.vendedor, func.count(Client.id), func.sum(Client.closed))
        .filter(Client.vendedor != None)
        .group_by(Client.vendedor)
        .order_by(func.sum(Client.closed).desc())
        .all()
    )
    return [
        MetricCount(label=r[0], count=r[1], close_rate=_close_rate(r[2] or 0, r[1]))
        for r in rows
    ]


@router.get("/by-urgency", response_model=List[MetricCount])
def by_urgency(db: Session = Depends(get_db)):
    rows = (
        db.query(Client.urgencia, func.count(Client.id), func.sum(Client.closed))
        .filter(Client.urgencia != None)
        .group_by(Client.urgencia)
        .all()
    )
    return [
        MetricCount(label=r[0], count=r[1], close_rate=_close_rate(r[2] or 0, r[1]))
        for r in rows
    ]


@router.get("/by-product-fit", response_model=List[MetricCount])
def by_product_fit(db: Session = Depends(get_db)):
    fit_order = ["excelente", "bueno", "regular", "bajo"]
    rows = (
        db.query(Client.ajuste_producto, func.count(Client.id), func.sum(Client.closed))
        .filter(Client.ajuste_producto != None)
        .group_by(Client.ajuste_producto)
        .all()
    )
    result = {r[0]: MetricCount(label=r[0], count=r[1], close_rate=_close_rate(r[2] or 0, r[1])) for r in rows}
    return [result[s] for s in fit_order if s in result]


@router.get("/timeline")
def timeline(db: Session = Depends(get_db)):
    rows = (
        db.query(
            func.substr(Client.fecha_reunion, 1, 7).label("month"),
            func.count(Client.id).label("total"),
            func.sum(Client.closed).label("closed"),
        )
        .filter(Client.fecha_reunion != None)
        .group_by("month")
        .order_by("month")
        .all()
    )
    return [{"month": r[0], "total": r[1], "closed": r[2] or 0} for r in rows]


@router.get("/vendors")
def vendors(db: Session = Depends(get_db)):
    rows = db.query(Client.vendedor).distinct().filter(Client.vendedor != None).all()
    return [r[0] for r in rows]
