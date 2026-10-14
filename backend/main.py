import os
from typing import List, Optional
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session

from models.schemas import (
    CustomerProfile,
    FinancialGoal,
    CalculationResult,
    ProductItem,
    ProductRecommendation,
    ScenarioCustomizationRequest,
    ScenarioCustomizationResponse,
    AdvisorProfile,
    ConsultationBookingRequest,
    ConsultationBookingResponse,
    AdvisoryQuestionRequest,
    AdvisoryAnswerResponse,
)
from models.database import init_db, get_db, BookingModel
from services.calculator import generate_financial_assessment
from services.recommender import (
    PRODUCT_CATALOGUE,
    generate_recommendations,
    customize_scenario,
)
from services.booking_service import (
    list_advisors,
    create_booking,
    list_all_bookings
)
from services.advisory import answer_advisory_query

# Initialize DB tables
init_db()

app = FastAPI(
    title="Insurance Mantra API",
    description="Understand Your Needs. Compare Your Options. Protect Your Future. — Developed by Telugu Hackers for AI Frontier Challenge 2026",
    version="1.0.0"
)

# CORS Middleware to allow requests from React Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class RecommendationRequest(BaseModel):
    profile: CustomerProfile
    calculated_gap: float

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "app": "Insurance Mantra",
        "tagline": "Understand Your Needs. Compare Your Options. Protect Your Future.",
        "team": "Telugu Hackers",
        "track": "AI Frontier Challenge 2026 — BFSI Track",
        "version": "1.0.0"
    }

@app.get("/api/sample-profile", response_model=CustomerProfile)
def get_sample_profile():
    """
    Provides a realistic, demonstrative Indian household profile for quick hackathon review.
    Salaried technology professional, age 32, married with 1 child, home loan liability and education goal.
    """
    return CustomerProfile(
        age=32,
        employment_category="salaried",
        annual_gross_income=1800000.0,      # ₹18 Lakhs / year
        annual_household_expenses=720000.0,  # ₹60,000 / month = ₹7.2 Lakhs / year
        dependents_count=2,                 # Spouse & 3-year-old child
        years_of_support_needed=22,         # Until child reaches age 25
        risk_preference="balanced",
        protection_preference="pure_protection",
        outstanding_liabilities=4500000.0,  # ₹45 Lakhs home loan balance
        existing_life_insurance=2500000.0,  # ₹25 Lakhs group/term cover
        current_savings=1600000.0,          # ₹16 Lakhs total liquid investments
        eligible_assets_for_family=1000000.0,# ₹10 Lakhs earmarked emergency/protection assets
        other_obligations=500000.0,         # ₹5 Lakhs immediate emergency buffer
        future_goals=[
            FinancialGoal(
                description="Child's Higher Education & Overseas College",
                estimated_amount=3500000.0,  # ₹35 Lakhs
                target_years=15
            ),
            FinancialGoal(
                description="Family Healthcare & Parental Emergency Reserve",
                estimated_amount=1000000.0,  # ₹10 Lakhs
                target_years=8
            )
        ],
        preferred_annual_premium_budget=35000.0,
        desired_policy_duration=30,
        preferred_category="term",
        discount_rate=0.06,
        use_discounting=True,
        assumed_retirement_age=60
    )

@app.post("/api/calculate", response_model=CalculationResult)
def calculate_needs(profile: CustomerProfile):
    try:
        return generate_financial_assessment(profile)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/products", response_model=List[ProductItem])
def get_products():
    return PRODUCT_CATALOGUE

@app.post("/api/recommend", response_model=List[ProductRecommendation])
def recommend_products(req: RecommendationRequest):
    try:
        return generate_recommendations(req.profile, req.calculated_gap)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/customize", response_model=ScenarioCustomizationResponse)
def customize_policy_scenario(req: ScenarioCustomizationRequest):
    try:
        return customize_scenario(req)
    except ValueError as ve:
        raise HTTPException(status_code=404, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/advisors", response_model=List[AdvisorProfile])
def get_advisors():
    return list_advisors()

@app.post("/api/bookings", response_model=ConsultationBookingResponse)
def book_consultation(req: ConsultationBookingRequest, db: Session = Depends(get_db)):
    try:
        return create_booking(db, req)
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Booking error: {str(e)}")

@app.get("/api/bookings")
def get_all_bookings(db: Session = Depends(get_db)):
    bookings = list_all_bookings(db)
    return [
        {
            "id": b.id,
            "booking_reference": b.booking_reference,
            "advisor_name": b.advisor_name,
            "customer_name": b.customer_name,
            "customer_email": b.customer_email,
            "customer_phone": b.customer_phone,
            "booking_date": b.booking_date,
            "time_slot": b.time_slot,
            "consultation_mode": b.consultation_mode,
            "recommended_product_category": b.recommended_product_category,
            "calculated_cover_gap": b.calculated_cover_gap,
            "status": b.status,
            "created_at": b.created_at.isoformat() if b.created_at else None
        }
        for b in bookings
    ]

@app.post("/api/advisory-chat", response_model=AdvisoryAnswerResponse)
def chat_with_advisor(req: AdvisoryQuestionRequest):
    try:
        return answer_advisory_query(req)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
