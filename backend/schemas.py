from pydantic import BaseModel
from typing import Optional, List, Any


class ClientBase(BaseModel):
    id: int
    nombre: str
    correo: str
    telefono: str
    fecha_reunion: str
    vendedor: str
    closed: int
    categorized: bool

    sentimiento: Optional[str] = None
    urgencia: Optional[str] = None
    objecion_principal: Optional[str] = None
    ajuste_producto: Optional[str] = None
    industria: Optional[str] = None
    etapa_cliente: Optional[str] = None
    es_decisor: Optional[str] = None
    accion_seguimiento: Optional[str] = None
    menciona_competencia: Optional[bool] = None
    puntos_dolor: Optional[List[str]] = None

    model_config = {"from_attributes": True}


class ClientDetail(ClientBase):
    transcripcion: str


class PaginatedClients(BaseModel):
    total: int
    page: int
    limit: int
    data: List[ClientBase]


class MetricCount(BaseModel):
    label: str
    count: int
    close_rate: Optional[float] = None


class OverviewMetrics(BaseModel):
    total_clients: int
    total_categorized: int
    close_rate: float
    positive_close_rate: float
    high_urgency_rate: float
    top_objection: str


class PipelineStatus(BaseModel):
    total: int
    categorized: int
    pending: int
    progress_pct: float
