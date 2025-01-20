from pydantic import BaseModel
from fastapi import File, UploadFile

class UserSignUpModel(BaseModel):
    email:str
    password:str

class TokenModel(BaseModel):
    token:str

class EmailModel(BaseModel):
    email:str

class UserSignInModel(BaseModel):
    email:str
    password:str
    rememberMe:bool=False