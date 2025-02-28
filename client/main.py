from fastapi import FastAPI
from .routers import transaction_router
from fastapi.responses import RedirectResponse
import json

app = FastAPI()
app.include_router(transaction_router.router)

@app.get("/")
async def redirect_docs():
    return RedirectResponse(url="/docs")

# Add this after your FastAPI app is fully configured (after all routes are added)
openapi_schema = app.openapi()

# Save it to a file
with open("openapi.json", "w") as f:
    json.dump(openapi_schema, f, indent=2)