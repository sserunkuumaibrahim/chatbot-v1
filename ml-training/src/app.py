from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Welcome to the ChatBot SaaS Platform ML Service"}

@app.get("/predict")
async def predict():
    return {"prediction": "This is a sample ML prediction"}