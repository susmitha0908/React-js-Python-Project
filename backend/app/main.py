from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import router as commands_router

app = FastAPI(
    title="DevOps Command Explorer API",
    description="Backend API for browsing and saving DevOps commands",
    version="1.0.0"
)

# CORS configuration to allow connections from frontend dev server and build
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(commands_router)

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "DevOps Command Explorer API",
        "version": "1.0.0"
    }
