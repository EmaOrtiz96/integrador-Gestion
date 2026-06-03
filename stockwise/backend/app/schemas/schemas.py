from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum


class MovementType(str, Enum):
    entrada = "entrada"
    salida = "salida"
    ajuste = "ajuste"


# ── Category ──────────────────────────────────────────────
class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None

class CategoryCreate(CategoryBase):
    pass

class CategoryOut(CategoryBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True


# ── Product ───────────────────────────────────────────────
class ProductBase(BaseModel):
    name: str
    sku: str
    description: Optional[str] = None
    price: float = 0.0
    stock: int = 0
    stock_min: int = 5
    unit: str = "unidad"
    category_id: Optional[int] = None

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    stock_min: Optional[int] = None
    unit: Optional[str] = None
    category_id: Optional[int] = None

class ProductOut(ProductBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    category: Optional[CategoryOut] = None
    class Config:
        from_attributes = True


# ── StockMovement ─────────────────────────────────────────
class MovementCreate(BaseModel):
    product_id: int
    type: MovementType
    quantity: int = Field(gt=0)
    reason: Optional[str] = None

class MovementOut(BaseModel):
    id: int
    product_id: int
    type: MovementType
    quantity: int
    reason: Optional[str]
    stock_before: int
    stock_after: int
    created_at: datetime
    product: Optional[ProductOut] = None
    class Config:
        from_attributes = True


# ── Dashboard ─────────────────────────────────────────────
class DashboardStats(BaseModel):
    total_products: int
    total_stock_value: float
    low_stock_count: int
    out_of_stock_count: int
    movements_today: int
    top_products: List[dict]
    recent_movements: List[dict]
    stock_by_category: List[dict]
