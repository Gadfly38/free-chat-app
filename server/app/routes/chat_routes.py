from fastapi import APIRouter, Depends, File, UploadFile, Form
from datetime import datetime, timedelta

from app.controllers.chat_controller import get_chat_history, handle_pdf, get_documents
from app.middleware.verify_token_middleware import check_jwt_token
from app.models.auth_model import EmailModel

router = APIRouter()

@router.get("/api/chat/get_chat_history", dependencies=[Depends(check_jwt_token)])
async def return_chat_history():
    return await get_chat_history()

@router.post("/api/document/upload_pdf", dependencies=[Depends(check_jwt_token)])
async def upload_pdf(email: str = Form(...), file: UploadFile = File(...)):
    return await handle_pdf(email, file)

@router.post("/api/documents", dependencies=[Depends(check_jwt_token)])
async def documents(data: EmailModel):
    return await get_documents(data)