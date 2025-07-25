from pydantic import BaseModel, Field
from typing import Optional


class DesignRequestModel(BaseModel):
    """
    Tasarım isteği için model - main.py'dan taşındı.
    """
    oda_tipi: str = Field(..., example="Salon")
    tasarim_stili: str = Field(..., example="Modern")
    notlar: str = Field(..., example="Geniş bir kitaplık ve rahat bir okuma koltuğu istiyorum...")


class DesignResponseModel(BaseModel):
    """
    Tasarım cevabı için model - gelecekte kullanılacak.
    """
    oda_tipi: str
    tasarim_stili: str
    notlar: str
    foto_yuklendi: Optional[str] = None
