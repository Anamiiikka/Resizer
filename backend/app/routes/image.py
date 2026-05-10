from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse

from app.services.fal_service import process_image
from app.utils.file_utils import image_to_data_uri, get_image_dimensions, validate_image

router = APIRouter()

SUPPORTED_TYPES = {"image/jpeg", "image/png", "image/webp"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB


@router.post("/process")
async def process_image_endpoint(
    file: UploadFile = File(...),
    target_width: int = Form(...),
    target_height: int = Form(...),
):
    if file.content_type not in SUPPORTED_TYPES:
        raise HTTPException(status_code=400, detail="Unsupported file type. Use JPEG, PNG, or WebP.")

    image_bytes = await file.read()

    if len(image_bytes) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File too large. Max size is 10MB.")

    if not validate_image(image_bytes):
        raise HTTPException(status_code=400, detail="Invalid image file.")

    if target_width < 64 or target_height < 64:
        raise HTTPException(status_code=400, detail="Target dimensions must be at least 64x64.")

    if target_width > 4096 or target_height > 4096:
        raise HTTPException(status_code=400, detail="Target dimensions cannot exceed 4096x4096.")

    mime_type = file.content_type
    data_uri = image_to_data_uri(image_bytes, mime_type)

    try:
        result = await process_image(data_uri, target_width, target_height)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Fal API error: {str(e)}")

    return JSONResponse(content={"output_url": result.get("image", {}).get("url", ""), "result": result})


@router.post("/dimensions")
async def get_dimensions_endpoint(file: UploadFile = File(...)):
    image_bytes = await file.read()
    try:
        width, height = get_image_dimensions(image_bytes)
        return {"width": width, "height": height}
    except Exception:
        raise HTTPException(status_code=400, detail="Could not read image dimensions.")
