import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.core.config import settings
from app.core.database import Base, engine, SessionLocal
from app.core.websocket_manager import manager
from app.ml.model_pipeline import ml_pipeline

# Import all models to ensure metadata registration
import app.models

# Import routers
from app.api.routes import (
    auth,
    dashboard,
    complaints,
    predictions,
    heatmap,
    locations,
    mule_network,
    alerts,
    investigations,
    banks,
    i4c,
    feedback,
    models as model_routes,
    data_fusion,
    audit,
    search,
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("cyberpehra")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing CYBER PEHRA database schemas...")
    Base.metadata.create_all(bind=engine)

    # Check and seed if database is empty
    db = SessionLocal()
    try:
        from seed.seed_data import seed_database_if_empty
        seed_database_if_empty(db)
    except Exception as e:
        logger.warning(f"Seed verification notice: {e}")
    finally:
        db.close()

    # Preload / verify ML model
    logger.info("Verifying prototype Machine Learning model...")
    ml_pipeline.load_or_train()

    yield
    logger.info("CYBER PEHRA backend shutting down.")

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Predictive Intelligence & Multi-Agency Cybercrime Intervention Grid for Indian Law Enforcement & Banks.",
    version="2.4.1",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1)(:\d+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount all REST API routers under prefix
api_prefix = settings.API_V1_PREFIX
app.include_router(auth.router, prefix=api_prefix)
app.include_router(dashboard.router, prefix=api_prefix)
app.include_router(complaints.router, prefix=api_prefix)
app.include_router(predictions.router, prefix=api_prefix)
app.include_router(heatmap.router, prefix=api_prefix)
app.include_router(locations.router, prefix=api_prefix)
app.include_router(mule_network.router, prefix=api_prefix)
app.include_router(alerts.router, prefix=api_prefix)
app.include_router(investigations.router, prefix=api_prefix)
app.include_router(banks.router, prefix=api_prefix)
app.include_router(i4c.router, prefix=api_prefix)
app.include_router(feedback.router, prefix=api_prefix)
app.include_router(model_routes.router, prefix=api_prefix)
app.include_router(data_fusion.router, prefix=api_prefix)
app.include_router(audit.router, prefix=api_prefix)
app.include_router(search.router, prefix=api_prefix)

# Real-time WebSocket for Alerts
@app.websocket("/ws/alerts")
async def websocket_alerts_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Keep connection alive; can receive heartbeat or client ack
            data = await websocket.receive_text()
            logger.debug(f"Received from WebSocket client: {data}")
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        logger.warning(f"WebSocket connection closed with error: {e}")
        manager.disconnect(websocket)

@app.get("/", tags=["Health"])
def root_endpoint():
    return {
        "project": settings.PROJECT_NAME,
        "status": "ONLINE",
        "version": "v2.4.1",
        "api_docs": "/docs",
        "websocket_endpoint": "/ws/alerts",
        "environment": settings.ENVIRONMENT,
    }

@app.get("/health", tags=["Health"])
def health_endpoint():
    return {
        "status": "HEALTHY",
        "active_ws_clients": len(manager.active_connections),
        "ml_model_version": ml_pipeline.current_version,
    }
