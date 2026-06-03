from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, cast, Date
from datetime import date
from app.database.connection import get_db
from app.models.models import Product, StockMovement, Category
from app.schemas.schemas import DashboardStats

router = APIRouter()


@router.get("/stats", response_model=DashboardStats)
def get_stats(db: Session = Depends(get_db)):
    total_products = db.query(Product).count()

    total_value = db.query(
        func.sum(Product.stock * Product.price)
    ).scalar() or 0.0

    low_stock = db.query(Product).filter(
        Product.stock <= Product.stock_min,
        Product.stock > 0
    ).count()

    out_of_stock = db.query(Product).filter(Product.stock == 0).count()

    today = date.today()
    movements_today = db.query(StockMovement).filter(
        cast(StockMovement.created_at, Date) == today
    ).count()

    top_products = db.query(Product).order_by(Product.stock.desc()).limit(5).all()
    top_list = [
        {"id": p.id, "name": p.name, "stock": p.stock, "sku": p.sku}
        for p in top_products
    ]

    recent_movements = db.query(StockMovement).order_by(
        StockMovement.created_at.desc()
    ).limit(8).all()
    recent_list = [
        {
            "id": m.id,
            "type": m.type,
            "quantity": m.quantity,
            "stock_after": m.stock_after,
            "reason": m.reason,
            "created_at": m.created_at.isoformat() if m.created_at else None,
            "product_name": m.product.name if m.product else "—",
        }
        for m in recent_movements
    ]

    categories = db.query(Category).all()
    stock_by_cat = []
    for cat in categories:
        total = sum(p.stock for p in cat.products)
        stock_by_cat.append({"category": cat.name, "total_stock": total})

    return DashboardStats(
        total_products=total_products,
        total_stock_value=round(float(total_value), 2),
        low_stock_count=low_stock,
        out_of_stock_count=out_of_stock,
        movements_today=movements_today,
        top_products=top_list,
        recent_movements=recent_list,
        stock_by_category=stock_by_cat,
    )
