from fastapi import APIRouter, Depends, File, UploadFile, Form, HTTPException
from datetime import datetime
from io import BytesIO

from app.models.auth_model import EmailModel
from app.utils.chat_utils import upload_to_drive
from app.db.supabase import supabase

SCOPES = ['https://www.googleapis.com/auth/drive.file']
SERVICE_ACCOUNT_FILE = './free-chat-app-448413-5c3174e17295.json'

async def get_chat_history():
    return{
        "chatHistory" : "Hi"
    }

async def handle_pdf(email: str, file: UploadFile = File(...)):
    try:
        if not file.content_type == "application/pdf":
            raise HTTPException(status_code=400, detail="Only PDF files are allowed")

        contents = await file.read()
        
        drive_response = await upload_to_drive(BytesIO(contents), file.filename)
        
        # text_content = await read_pdf_from_drive(drive_response['file_id'])

        document_data = {
            "email": email,
            "file_name": file.filename,
            "file_id": drive_response['file_id'],
            "file_url": drive_response['view_link'],
        }

        result = supabase.table('documents').insert(document_data).execute()

        if result.data:
            return result.data[0]

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred while processing the file: {str(e)}")
    finally:
        await file.close()

async def get_documents(data: EmailModel):
    try:
        documents = supabase.table('documents').select("*").eq('email', data.email).execute()
        
        if not documents.data:
            raise HTTPException(status_code=400, detail={
                "message" : "No Exist"
            })
        
        return {
            "file_data" : documents.data
        }
         
    except HTTPException as he:
        raise he

    except Exception as e:
        raise HTTPException(status_code=500, detail={
            "message" : str(e)
        })