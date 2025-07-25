from fastapi import APIRouter
from config import logger

router = APIRouter()

@router.get("/")
async def root():
    """
    Ana endpoint - API'nin çalıştığını kontrol et.
    """
    logger.info("Root endpoint'e istek geldi")
    return {"message": "API is running"}
