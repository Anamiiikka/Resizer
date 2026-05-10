import io
from PIL import Image


def get_image_dimensions(image_bytes: bytes) -> tuple[int, int]:
    img = Image.open(io.BytesIO(image_bytes))
    return img.size  # (width, height)


def validate_image(image_bytes: bytes) -> bool:
    try:
        Image.open(io.BytesIO(image_bytes)).verify()
        return True
    except Exception:
        return False
