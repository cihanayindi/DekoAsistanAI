from pydantic import BaseModel, Field


class DesignRequestModel(BaseModel):
    """
    Tasarım isteği için model - main.py'dan taşındı.
    """
    oda_tipi: str = Field(..., example="Salon")
    tasarim_stili: str = Field(..., example="Modern")
    notlar: str = Field(..., example="Geniş bir kitaplık ve rahat bir okuma koltuğu istiyorum...")


class DesignResponseModel(BaseModel):
    """
    Tasarım cevabı için model - fotoğraf özelliği kaldırıldı.
    """
    oda_tipi: str
    tasarim_stili: str
    notlar: str
