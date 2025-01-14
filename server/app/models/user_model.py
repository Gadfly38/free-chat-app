from pydantic import BaseModel

class UserSignUpModel(BaseModel):
    email:str
    password:str

class UserSignInModel(BaseModel):
    email:str
    password:str