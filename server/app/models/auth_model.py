from pydantic import BaseModel

class UserSignUpModel(BaseModel):
    email:str
    password:str

class TokenModel(BaseModel):
    token:str

class UserSignInModel(BaseModel):
    email:str
    password:str
    rememberMe:bool=False
