from fastapi import FastAPI
from .routers import transactions  # new file you'll create

app = FastAPI()
app.include_router(transactions.router)