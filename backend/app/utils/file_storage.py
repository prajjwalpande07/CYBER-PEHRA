import os
import hashlib
from typing import Tuple
from fastapi import UploadFile, HTTPException
from app.core.config import settings

ALLOWED_EXTENSIONS = {".pdf", ".png", ".jpg", ".jpeg", ".txt", ".json", ".csv", ".pcap"}
MAX_FILE_SIZE_BYTES = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024

def calculate_sha256_bytes(data: bytes) -> str:
    sha256 = hashlib.sha256()
    sha256.update(data)
    return f"0x{sha256.hexdigest()}"

async def save_evidence_file(file: UploadFile, case_id: str) -> Tuple[str, str, int, str]:
    """
    Saves an uploaded file safely to the upload directory.
    Returns: (stored_filename, safe_rel_path, file_size, sha256_hash)
    """
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

    # Check extension
    filename = os.path.basename(file.filename)
    _, ext = os.path.splitext(filename)
    ext = ext.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"File extension '{ext}' is not permitted. Permitted extensions: {', '.join(sorted(ALLOWED_EXTENSIONS))}"
        )

    content = await file.read()
    file_size = len(content)

    if file_size > MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=400,
            detail=f"File size exceeds maximum permitted limit of {settings.MAX_UPLOAD_SIZE_MB}MB."
        )

    sha256_hash = calculate_sha256_bytes(content)

    # Generate safe unique filename
    safe_name = f"{case_id}_{sha256_hash[2:10]}_{filename}"
    file_path = os.path.join(settings.UPLOAD_DIR, safe_name)

    with open(file_path, "wb") as f:
        f.write(content)

    return filename, safe_name, file_size, sha256_hash
