from fastapi import APIRouter, UploadFile, File, Form
from typing import Optional
from config import logger
from models import DesignResponseModel

router = APIRouter()

@router.post("/test", response_model=DesignResponseModel)
async def test_endpoint(
    oda_tipi: str = Form(...),
    tasarim_stili: str = Form(...),
    notlar: str = Form(...),
    oda_fotografi: Optional[UploadFile] = File(None)
):
    """
    Test endpoint - main.py'daki gibi form verilerini alıp geri döndür.
    """
    logger.info("Test endpoint'e istek alındı:")
    logger.info(f"Oda Tipi: {oda_tipi}")
    logger.info(f"Tasarım Stili: {tasarim_stili}")
    logger.info(f"Notlar: {notlar}")
    logger.info(f"Yüklenen Fotoğraf: {oda_fotografi.filename if oda_fotografi else 'Yok'}")
    
    return {
        "oda_tipi": oda_tipi,
        "tasarim_stili": tasarim_stili,
        "notlar": notlar,
        "foto_yuklendi": oda_fotografi.filename if oda_fotografi else None
    }
