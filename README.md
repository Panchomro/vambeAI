# VambeAI — Sales Intelligence Dashboard

Aplicación que procesa transcripciones de reuniones de ventas, categoriza clientes automáticamente con LLM (Groq / Llama 3.3 70B) y visualiza métricas en un panel interactivo.

## Stack

| Capa | Tecnología |
|---|---|
| Backend API | Python 3.11 + FastAPI + SQLAlchemy |
| Base de datos | SQLite (local, cero configuración) |
| LLM | Groq API — Llama 3.3 70B Versatile |
| Frontend | Next.js 14 (App Router) + TypeScript + Tailwind CSS |
| Gráficos | Recharts |

## Requisitos previos

- Python 3.11+
- Node.js 18+
- API key de Groq (gratis en console.groq.com)

## Ejecución local

### 1. Clonar y preparar datos

```bash
git clone <repo-url>
cd vambeai
# Asegúrate de que vambe_clients_10k.csv está en la raíz del proyecto
```

### 2. Backend

```bash
cd backend

# Crear entorno virtual
python -m venv venv
.\venv\Scripts\activate        # Windows
# source venv/bin/activate     # Mac/Linux

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
# Edita .env con tu API key de Groq (ya incluida si clonaste el repo)

# Cargar CSV en la base de datos
python -m pipeline.ingest

# Iniciar API
uvicorn main:app --reload --port 8000
```

La API estará disponible en http://localhost:8000
Documentación interactiva: http://localhost:8000/docs

### 3. Categorización con LLM (pipeline)

```bash
# Desde el directorio backend, con el venv activado:

# Procesar primeros 200 registros (rápido, ~7 min)
python -m pipeline.categorize --limit 200

# Procesar todos los 10K registros (requiere ~6-7 horas, resumable)
python -m pipeline.categorize

# El pipeline es resumable: si lo interrumpes, al volver a correrlo
# continúa desde donde se quedó (salta registros ya categorizados).
```

### 4. Frontend

```bash
cd frontend
npm install
npm run dev
```

El dashboard estará en http://localhost:3000

## Arquitectura y decisiones clave

Ver [ARCHITECTURE.md](./ARCHITECTURE.md).

## Dimensiones extraídas por el LLM

| Dimensión | Valores posibles |
|---|---|
| Sentimiento | positivo / neutral / negativo |
| Urgencia | alta / media / baja |
| Objeción principal | precio / tiempo / necesidad / competencia / ninguna |
| Ajuste de producto | excelente / bueno / regular / bajo |
| Industria | retail / salud / ecommerce / restaurante / seguros / educación / logística / farmacia / fitness / otro |
| Etapa del cliente | descubrimiento / evaluación / negociación / listo_para_cerrar |
| Es decisor | sí / no / parcialmente |
| Acción de seguimiento | demo / propuesta / llamada / contrato / ninguna |
| Menciona competencia | true / false |
| Puntos de dolor | lista de 1-3 strings |

## Endpoints principales

```
GET /api/clients              Listado paginado con filtros
GET /api/clients/{id}         Detalle de cliente con transcripción
GET /api/metrics/overview     KPIs generales
GET /api/metrics/by-sentiment Distribución por sentimiento
GET /api/metrics/by-objection Objeciones y tasas de cierre
GET /api/metrics/by-industry  Distribución por industria
GET /api/metrics/by-stage     Embudo de etapas
GET /api/metrics/by-salesperson Rendimiento por vendedor
GET /api/metrics/timeline     Serie temporal de reuniones
GET /api/metrics/status       Progreso del pipeline LLM
```
