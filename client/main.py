from fastapi import FastAPI
from .routers import transaction_router  # new file you'll create

app = FastAPI()
app.include_router(transaction_router.router)