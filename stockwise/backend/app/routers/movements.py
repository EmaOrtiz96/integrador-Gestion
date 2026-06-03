from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database.connection import get_db
from app.models.models import Product, StockMovement
from app.schemas.schemas import MovementCreate, MovementOut, MovementType

router = APIRouter()


@router.get("/", response_model=List[MovementOut])
def get_movements(
    skip: int = 0,
    limit: int = 50,
    product_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    query = db.query(StockMovement).order_by(StockMovement.created_at.desc())
    if product_id:
        query = query.filter(StockMovement.product_id == product_id)
    return query.offset(skip).limit(limit).all()


@router.post("/", response_model=MovementOut, status_code=201)
def create_movement(movement: MovementCreate, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == movement.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Producto no encontrado")

    stock_before = product.stock

    if movement.type == MovementType.entrada:
        product.stock += movement.quantity
    elif movement.type == MovementType.salida:
        if product.stock < movement.quantity:
            raise HTTPException(status_code=400, detail="Stock insuficiente")
        product.stock -= movement.quantity
    elif movement.type == MovementType.ajuste:
        product.stock = movement.quantity

    stock_after = product.stock

    db_movement = StockMovement(
        product_id=movement.product_id,
        type=movement.type,
        quantity=movement.quantity,
        reason=movement.reason,
        stock_before=stock_before,
        stock_after=stock_after,
    )
    db.add(db_movement)
    db.commit()
    db.refresh(db_movement)
    return db_movement
