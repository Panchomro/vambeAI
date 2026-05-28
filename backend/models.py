from sqlalchemy import Column, Integer, String, Boolean, Text, DateTime
from database import Base


class Client(Base):
    __tablename__ = "clients"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, index=True)
    correo = Column(String, index=True)
    telefono = Column(String)
    fecha_reunion = Column(String, index=True)
    vendedor = Column(String, index=True)
    closed = Column(Integer, default=0)
    transcripcion = Column(Text)

    # LLM-extracted dimensions
    categorized = Column(Boolean, default=False)
    sentimiento = Column(String)
    urgencia = Column(String)
    objecion_principal = Column(String)
    ajuste_producto = Column(String)
    industria = Column(String)
    etapa_cliente = Column(String)
    es_decisor = Column(String)
    accion_seguimiento = Column(String)
    menciona_competencia = Column(Boolean)
    puntos_dolor = Column(Text)  # JSON array stored as string
