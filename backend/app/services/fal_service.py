import os
import io
import fal_client
from PIL import Image


async def process_image(image_bytes: bytes, target_width: int, target_height: int) -> dict:
    os.environ["FAL_KEY"] = os.getenv("FAL_KEY", "")

    pil_image = Image.open(io.BytesIO(image_bytes))

    # Upload image to Fal CDN; returns a stable https:// URL
    image_url = await fal_client.upload_image_async(pil_image, format="png")

    result = await fal_client.subscribe_async(
        "fal-ai/smart-resize",
        arguments={
            "image_url": image_url,
            "target_sizes": [f"{target_width}x{target_height}"],
        },
    )

    return result
