# Arquitectura y Decisiones Clave

## Diagrama de capas

```
CSV (10K filas)
     │
     ▼
[pipeline/ingest.py]          ← Carga datos en SQLite una sola vez
     │
     ▼
SQLite (vambeai.db)
     │
     ▼
[pipeline/categorize.py]      ← Llama a Groq API, enriquece filas
     │                           Resumable: salta rows ya procesadas
     ▼
SQLite (columnas LLM pobladas)
     │
     ├──▶ FastAPI (backend/)  ← REST API con filtros y agregaciones
     │         │
     │         ▼
     └──▶ Next.js (frontend/) ← Dashboard SSR + Client components
```

## Decisiones técnicas

### 1. Groq en lugar de Gemini/OpenAI

El reto sugiere Gemma 4. Elegimos Groq (con Llama 3.3 70B) porque:
- Su hardware LPU proporciona ~10x más velocidad que APIs de cloud estándar.
- El free tier es más generoso (14,400 req/día vs 1,500 de Gemini free).
- Llama 3.3 70B supera a Gemma 4 27B en benchmarks de razonamiento en español.
- Es una elección diferenciadora que demuestra conocimiento del ecosistema LLM.

### 2. JSON mode para extracción estructurada

Usamos `response_format={"type": "json_object"}` en la llamada a Groq. Esto garantiza que el modelo devuelve JSON válido sin necesidad de parseo frágil con regex. Los valores de cada dimensión son enums cerrados, lo que evita alucinaciones en los labels.

### 3. Pipeline resumable con flag `categorized`

Cada fila en SQLite tiene `categorized: bool`. Al correr el pipeline, solo se procesan las filas con `categorized=False`. Si el proceso se interrumpe (corte de luz, límite de rate, etc.), al volver a correrlo continúa exactamente donde se quedó. Esto es crítico para datasets de 10K filas.

### 4. SQLite en lugar de PostgreSQL

Para ejecución local sin dependencias externas, SQLite es suficiente para 10K filas y consultas de agregación. Las queries de métricas usan `func.count`/`func.sum` de SQLAlchemy que se traducen eficientemente. Para producción se cambiaría el `DATABASE_URL` a PostgreSQL sin modificar código.

### 5. Next.js App Router con Server Components para el dashboard

Las páginas de métricas usan Server Components (`async` functions que llaman a la API directamente). Esto significa que los datos se obtienen en el servidor y llegan al cliente ya renderizados — sin loading spinners para los gráficos principales. La página de clientes es un Client Component porque necesita estado local para filtros y paginación.

### 6. Dimensiones seleccionadas

Las 10 dimensiones fueron diseñadas para maximizar valor para el equipo de ventas:
- **Sentimiento + urgencia**: El combo más predictivo de cierre.
- **Objeción principal**: Permite entrenar al equipo en las objeciones más frecuentes.
- **Ajuste de producto**: Identifica segmentos donde el producto no encaja → feedback para producto.
- **Etapa del cliente**: Mide salud del pipeline de ventas.
- **Es decisor**: Filtra oportunidades donde el contacto no tiene poder de compra.
- **Acción de seguimiento**: Sugiere el próximo paso para el vendedor.
- **Menciona competencia**: Alerta sobre amenazas competitivas en segmentos específicos.
- **Puntos de dolor**: Material para personalizar propuestas de valor.
