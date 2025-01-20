from fastapi import HTTPException, File, UploadFile, HTTPException, Form
import PyPDF2
from io import BytesIO

from app.db.supabase import supabase

async def get_chat_history():
    return{
        "chatHistory" : "Hi"
    }

async def handle_pdf(email: str = Form(...), file: UploadFile = File(...)):
    try:
        if not file.content_type == "application/pdf":
            raise HTTPException(status_code=400, detail="Only PDF files are allowed")

        contents = await file.read()
        pdf_file = BytesIO(contents)

        pdf_reader = PyPDF2.PdfReader(pdf_file)
        
        text_content = []
        for page in pdf_reader.pages:
            text_content.append(page.extract_text())

        response = {
            "email": email,
            "filename": file.filename,
            "pages": len(pdf_reader.pages),
            "content": text_content
        }

        return response

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred while processing the file: {str(e)}")
    
    finally:
        await file.close()
        pdf_file.close()