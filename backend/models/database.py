import os
from datetime import datetime, timezone
from sqlalchemy import create_engine, Column, Integer, String, Float, Text, DateTime
from sqlalchemy.orm import declarative_base, sessionmaker

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./lifewise.db")

engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class BookingModel(Base):
    __tablename__ = "consultation_bookings"

    id = Column(Integer, primary_key=True, index=True)
    booking_reference = Column(String(50), unique=True, index=True, nullable=False)
    advisor_id = Column(String(50), nullable=False)
    advisor_name = Column(String(100), nullable=False)
    customer_name = Column(String(100), nullable=False)
    customer_email = Column(String(120), nullable=False)
    customer_phone = Column(String(20), nullable=False)
    booking_date = Column(String(20), nullable=False)
    time_slot = Column(String(50), nullable=False)
    consultation_mode = Column(String(30), nullable=False)
    notes_or_concerns = Column(Text, nullable=True)
    recommended_product_category = Column(String(50), nullable=True)
    calculated_cover_gap = Column(Float, nullable=True)
    status = Column(String(30), default="CONFIRMED")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

def init_db():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
