from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.connection import engine, Base
from app.routers import products, categories, movements, dashboard

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="StockWise API",
    description="Control de stock inteligente asistido por IA",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(products.router, prefix="/api/products", tags=["Productos"])
app.include_router(categories.router, prefix="/api/categories", tags=["Categorías"])
app.include_router(movements.router, prefix="/api/movements", tags=["Movimientos"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["Dashboard"])

@app.get("/")
def root():
    return {"message": "StockWise API funcionando ✅", "version": "1.0.0"}

@app.get("/health")
def health():
    return {"status": "ok"}
