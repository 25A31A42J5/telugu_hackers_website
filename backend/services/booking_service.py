import uuid
from typing import List, Optional
from datetime import datetime
from sqlalchemy.orm import Session
from models.schemas import AdvisorProfile, ConsultationBookingRequest, ConsultationBookingResponse
from models.database import BookingModel

DEMO_ADVISORS: List[AdvisorProfile] = [
    AdvisorProfile(
        id="adv-srinivas",
        name="Srinivas Rao, CFP®",
        title="Senior BFSI Protection & Estate Planning Specialist",
        specialization="High Sum Assured Term Cover & Family Goal Structuring",
        experience_years=14,
        languages=["English", "Telugu", "Hindi"],
        rating=4.94,
        available_slots=["10:00 AM - 10:45 AM", "02:00 PM - 02:45 PM", "04:30 PM - 05:15 PM", "06:00 PM - 06:45 PM"],
        image_url="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=160&auto=format&fit=crop&q=80",
        is_demo=True
    ),
    AdvisorProfile(
        id="adv-ananya",
        name="Ananya Sharma, ChFC",
        title="Chartered Financial Consultant & Retirement Advisory",
        specialization="Salaried Professionals & Children Higher Education Hedging",
        experience_years=11,
        languages=["English", "Hindi", "Marathi"],
        rating=4.89,
        available_slots=["11:00 AM - 11:45 AM", "01:30 PM - 02:15 PM", "03:30 PM - 04:15 PM", "05:00 PM - 05:45 PM"],
        image_url="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&auto=format&fit=crop&q=80",
        is_demo=True
    ),
    AdvisorProfile(
        id="adv-ramesh",
        name="Dr. Ramesh Varma, Fellow (III)",
        title="Underwriting & Medical Risk Consultant",
        specialization="Self-Employed, Business Owners & Pre-Existing Condition Underwriting",
        experience_years=18,
        languages=["English", "Telugu", "Tamil"],
        rating=4.97,
        available_slots=["09:30 AM - 10:15 AM", "12:00 PM - 12:45 PM", "04:00 PM - 04:45 PM"],
        image_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80",
        is_demo=True
    )
]

def list_advisors() -> List[AdvisorProfile]:
    return DEMO_ADVISORS

def create_booking(db: Session, req: ConsultationBookingRequest) -> ConsultationBookingResponse:
    # 1. Validate advisor existence
    advisor = next((a for a in DEMO_ADVISORS if a.id == req.advisor_id), None)
    if not advisor:
        raise ValueError(f"Advisor with ID '{req.advisor_id}' not found.")
        
    # 2. Check if requested slot is valid for this advisor
    if req.time_slot not in advisor.available_slots:
        raise ValueError(f"Requested time slot '{req.time_slot}' is not an available slot for {advisor.name}.")
        
    # 3. Check for existing booking on that date and slot
    existing = db.query(BookingModel).filter(
        BookingModel.advisor_id == req.advisor_id,
        BookingModel.booking_date == req.booking_date,
        BookingModel.time_slot == req.time_slot
    ).first()
    
    if existing:
        raise ValueError(
            f"The slot '{req.time_slot}' on {req.booking_date} with {advisor.name} is already booked. Please choose an alternate slot."
        )
        
    from datetime import timezone
    ref_code = f"IM-{datetime.now(timezone.utc).strftime('%Y%m')}-{uuid.uuid4().hex[:6].upper()}"
    
    # 5. Persist in database
    booking_record = BookingModel(
        booking_reference=ref_code,
        advisor_id=advisor.id,
        advisor_name=advisor.name,
        customer_name=req.customer_name,
        customer_email=req.customer_email,
        customer_phone=req.customer_phone,
        booking_date=req.booking_date,
        time_slot=req.time_slot,
        consultation_mode=req.consultation_mode,
        notes_or_concerns=req.notes_or_concerns,
        recommended_product_category=req.recommended_product_category,
        calculated_cover_gap=req.calculated_cover_gap,
        status="CONFIRMED"
    )
    db.add(booking_record)
    db.commit()
    db.refresh(booking_record)
    
    # Summary of needs text
    gap_str = f"₹{req.calculated_cover_gap:,.0f}" if req.calculated_cover_gap is not None else "Needs assessment in progress"
    category_str = req.recommended_product_category.upper() if req.recommended_product_category else "Comprehensive Protection"
    summary = f"Identified Coverage Gap: {gap_str} | Primary Focus: {category_str} | Mode: {req.consultation_mode.replace('_', ' ').title()}"
    
    return ConsultationBookingResponse(
        booking_reference=ref_code,
        status="CONFIRMED",
        advisor_name=advisor.name,
        advisor_title=advisor.title,
        customer_name=req.customer_name,
        scheduled_datetime=f"{req.booking_date} at {req.time_slot}",
        consultation_mode=req.consultation_mode.replace('_', ' ').title(),
        summary_of_needs=summary,
        is_demo=True,
        message=f"Consultation successfully confirmed! Reference #{ref_code}. (Note: This is an interactive hackathon demonstration booking stored in the local SQLite database)."
    )

def list_all_bookings(db: Session) -> List[BookingModel]:
    return db.query(BookingModel).order_by(BookingModel.id.desc()).all()
