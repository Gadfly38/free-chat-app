from fastapi import APIRouter, Depends, File, UploadFile, Form, HTTPException
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseUpload, MediaIoBaseDownload
from google.oauth2 import service_account
import os
from datetime import datetime
import PyPDF2
from io import BytesIO

SCOPES = ['https://www.googleapis.com/auth/drive.file']
SERVICE_ACCOUNT_FILE = './free-chat-app-448413-5c3174e17295.json'

def get_google_drive_service():
    try:
        credentials = service_account.Credentials.from_service_account_file(
            SERVICE_ACCOUNT_FILE, scopes=SCOPES
        )
        return build('drive', 'v3', credentials=credentials)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to initialize Google Drive service: {str(e)}")

async def upload_to_drive(file_content: BytesIO, filename: str):
    try:
        service = get_google_drive_service()
        
        file_metadata = {
            'name': filename,
        }

        media = MediaIoBaseUpload(
            file_content,
            mimetype='application/pdf',
            resumable=True
        )

        file = service.files().create(
            body=file_metadata,
            media_body=media,
            fields='id, webViewLink'
        ).execute()

        permission = {
            'type': 'anyone',
            'role': 'reader'
        }
        service.permissions().create(
            fileId=file['id'],
            body=permission
        ).execute()

        return {
            'file_id': file['id'],
            'view_link': file['webViewLink']
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload to Google Drive: {str(e)}")

async def read_pdf_from_drive(file_id: str):
    try:
        service = get_google_drive_service()
        
        file_content = BytesIO()
        
        request = service.files().get_media(fileId=file_id)
        downloader = MediaIoBaseDownload(file_content, request)
        
        done = False
        while not done:
            status, done = downloader.next_chunk()
        
        file_content.seek(0)
        
        pdf_reader = PyPDF2.PdfReader(file_content)
        text_content = []
        for page in pdf_reader.pages:
            text_content.append(page.extract_text())
            
        return text_content

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to read PDF from Drive: {str(e)}")
    finally:
        file_content.close()

async def get_pdf_content(file_id: str):
    try:
        text_content = await read_pdf_from_drive(file_id)
        return {
            "status": "success",
            "data": {
                "content": text_content
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get PDF content: {str(e)}")