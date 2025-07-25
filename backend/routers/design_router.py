from fastapi import APIRouter, Form
from config import logger
from models import DesignResponseModel

router = APIRouter()

@router.post("/test", response_model=DesignResponseModel)
async def design_request_endpoint(
    oda_tipi: str = Form(...),
    tasarim_stili: str = Form(...),
    notlar: str = Form(...)
):
    """
    Ana tasarım istek endpoint'i - frontend'den gelen verileri işler.
    Fotoğraf yükleme özelliği kaldırıldı.
    """
    logger.info("Tasarım isteği alındı:")
    logger.info(f"Oda Tipi: {oda_tipi}")
    logger.info(f"Tasarım Stili: {tasarim_stili}")
    logger.info(f"Notlar: {notlar}")
    
    # Burada AI/tasarım logic'inizi çalıştırabilirsiniz
    # Örnek: notlar'dan oda boyutlarını parse etmek, tasarım önerisi oluşturmak vs.
    
    return {
        "oda_tipi": oda_tipi,
        "tasarim_stili": tasarim_stili,
        "notlar": notlar
    }