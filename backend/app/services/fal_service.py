import os
import fal_client


async def process_image(image_data_uri: str, target_width: int, target_height: int) -> dict:
    os.environ["FAL_KEY"] = os.getenv("FAL_KEY", "")

    result = await fal_client.run_async(
        "fal-ai/smart-resize",
        arguments={
            "image_url": image_data_uri,
            "target_width": target_width,
            "target_height": target_height,
        },
    )

    return result
