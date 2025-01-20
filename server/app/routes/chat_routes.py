from fastapi import APIRouter, Depends, File, UploadFile, Form
from datetime import datetime, timedelta

from app.controllers.chat_controller import get_chat_history, handle_pdf
from app.middleware.verify_token_middleware import check_jwt_token

router = APIRouter()

@router.get("/api/chat/get_chat_history", dependencies=[Depends(check_jwt_token)])
async def return_chat_history():
    return await get_chat_history()

@router.post("/api/document/upload_pdf", dependencies=[Depends(check_jwt_token)])
async def upload_pdf(email: str = Form(...), file: UploadFile = File(...)):
    return await handle_pdf(email, file)