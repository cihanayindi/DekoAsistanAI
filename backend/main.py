from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings, setup_logging, logger
from models import DesignRequestModel, DesignResponseModel
from exceptions import setup_exception_handlers
from routers import design_router, health_router

# Logging'i başlat
setup_logging()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan event handler."""
    # Startup
    logger.info("Starting Deko Assistant AI API...")
    yield
    # Shutdown
    logger.info("Shutting down Deko Assistant AI API...")

app = FastAPI(
    title=settings.APP_TITLE,
    description=settings.APP_DESCRIPTION,
    version=settings.APP_VERSION,
    lifespan=lifespan,
)

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Setup exception handlers
setup_exception_handlers(app)

# Include routers
app.include_router(health_router, tags=["Health"])
app.include_router(design_router, prefix="/api", tags=["Design"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",  # Import string formatında
        host=settings.host,      # Environment'a göre otomatik
        port=settings.port,      # Environment'a göre otomatik  
        reload=settings.reload   # Environment'a göre otomatik
    )