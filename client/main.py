from fastapi import FastAPI
from .routers import transaction_router
from fastapi.responses import RedirectResponse

app = FastAPI()
app.include_router(transaction_router.router)

@app.get("/")
async def redirect_docs():
    return RedirectResponse(url="/docs")