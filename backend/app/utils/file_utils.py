import base64
from PIL import Image
import io


def image_to_data_uri(image_bytes: bytes, mime_type: str = "image/jpeg") -> str:
    encoded = base64.b64encode(image_bytes).decode("utf-8")
    return f"data:{mime_type};base64,{encoded}"


def get_image_dimensions(image_bytes: bytes) -> tuple[int, int]:
    img = Image.open(io.BytesIO(image_bytes))
    return img.size  # (width, height)


def validate_image(image_bytes: bytes) -> bool:
    try:
        Image.open(io.BytesIO(image_bytes)).verify()
        return True
    except Exception:
        return False
