import pytest
from pydantic import ValidationError
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from models.schemas import (
    CustomerProfile,
    FinancialGoal,
    ConsultationBookingRequest,
    ScenarioCustomizationRequest,
)
from models.database import Base
from services.calculator import (
    compute_net_needs,
    compute_human_life_value,
    generate_financial_assessment,
    calculate_annuity_pv,
)
from services.recommender import (
    generate_recommendations,
    customize_scenario,
    PRODUCT_CATALOGUE,
)
from services.booking_service import create_booking, DEMO_ADVISORS

# In-memory test database fixture
@pytest.fixture
def test_db():
    engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False})
    Base.metadata.create_all(bind=engine)
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()

# TEST CASE 1: Dependents, liabilities, future goals, and NO existing cover
def test_case_1_dependents_liabilities_goals_no_existing_cover():
    profile = CustomerProfile(
        age=30,
        employment_category="salaried",
        annual_gross_income=1200000.0,
        annual_household_expenses=480000.0,
        dependents_count=2,
        years_of_support_needed=20,
        outstanding_liabilities=3000000.0,
        existing_life_insurance=0.0,
        current_savings=500000.0,
        eligible_assets_for_family=0.0,
        other_obligations=200000.0,
        future_goals=[
            FinancialGoal(description="Child Education", estimated_amount=2000000.0, target_years=15)
        ],
        preferred_annual_premium_budget=25000.0,
        desired_policy_duration=25,
        discount_rate=0.06,
        use_discounting=True
    )
    res = generate_financial_assessment(profile)
    net = res.net_needs
    
    # Mathematical reconciliation
    expected_gross = round(
        net.outstanding_liabilities + net.income_replacement_pv + net.goals_pv_total + net.other_obligations, 2
    )
    assert abs(net.gross_protection_resources_needed - expected_gross) < 0.01
    assert net.total_existing_coverage_and_resources == 0.0
    assert net.net_additional_life_cover_required == net.gross_protection_resources_needed
    assert net.net_additional_life_cover_required > 5000000.0 # Significant cover needed

# TEST CASE 2: Customer with existing life cover and eligible financial resources deducted accurately
def test_case_2_existing_cover_and_resources_deducted_once():
    profile = CustomerProfile(
        age=35,
        employment_category="salaried",
        annual_gross_income=1500000.0,
        annual_household_expenses=600000.0,
        dependents_count=1,
        years_of_support_needed=15,
        outstanding_liabilities=2000000.0,
        existing_life_insurance=2500000.0,
        current_savings=1500000.0,
        eligible_assets_for_family=1000000.0,
        other_obligations=0.0,
        future_goals=[],
        discount_rate=0.06,
        use_discounting=True
    )
    net = compute_net_needs(profile)
    assert net.existing_life_insurance_cover == 2500000.0
    assert net.eligible_financial_resources == 1000000.0
    assert net.total_existing_coverage_and_resources == 3500000.0
    
    # Net gap must equal Gross minus 35 Lakhs
    expected_gap = max(0.0, round(net.gross_protection_resources_needed - 3500000.0, 2))
    assert net.net_additional_life_cover_required == expected_gap

# TEST CASE 3: Customer whose eligible resources already cover calculated need (Gap == 0 floor)
def test_case_3_resources_exceed_need_floor_of_zero():
    profile = CustomerProfile(
        age=45,
        employment_category="business_owner",
        annual_gross_income=2500000.0,
        annual_household_expenses=800000.0,
        dependents_count=1,
        years_of_support_needed=10,
        outstanding_liabilities=500000.0,
        existing_life_insurance=10000000.0, # ₹1 Crore existing cover
        current_savings=5000000.0,
        eligible_assets_for_family=4000000.0, # ₹40 Lakhs dedicated assets
        other_obligations=0.0,
        future_goals=[],
        discount_rate=0.06,
        use_discounting=True
    )
    net = compute_net_needs(profile)
    # Deductions are 1.4 Crores, which exceeds gross needs
    assert net.total_existing_coverage_and_resources > net.gross_protection_resources_needed
    assert net.net_additional_life_cover_required == 0.0

# TEST CASE 4: Customer with zero or very low income
def test_case_4_zero_or_low_income():
    profile = CustomerProfile(
        age=24,
        employment_category="other",
        annual_gross_income=0.0,
        annual_household_expenses=120000.0,
        dependents_count=1,
        years_of_support_needed=10,
        outstanding_liabilities=100000.0,
        existing_life_insurance=0.0,
        current_savings=50000.0,
        eligible_assets_for_family=20000.0,
        other_obligations=0.0,
        future_goals=[],
        discount_rate=0.06,
        use_discounting=True
    )
    assessment = generate_financial_assessment(profile)
    assert assessment.net_needs.net_additional_life_cover_required > 0
    # HLV should reflect zero or low economic earning power
    assert assessment.hlv.gross_annual_income == 0.0
    assert assessment.hlv.gross_human_life_value == 0.0

# TEST CASE 5: Invalid negative values and inconsistent inputs rejected
def test_case_5_invalid_negative_and_inconsistent_inputs():
    with pytest.raises(ValidationError):
        # Negative income must be rejected
        CustomerProfile(
            age=30,
            employment_category="salaried",
            annual_gross_income=-50000.0,
            annual_household_expenses=300000.0,
            dependents_count=1,
            years_of_support_needed=10
        )
        
    with pytest.raises(ValidationError):
        # Age under 18 must be rejected
        CustomerProfile(
            age=16,
            employment_category="salaried",
            annual_gross_income=500000.0,
            annual_household_expenses=300000.0,
            dependents_count=1,
            years_of_support_needed=10
        )
        
    with pytest.raises(ValidationError):
        # Dedicated protection assets cannot exceed total current savings
        CustomerProfile(
            age=35,
            employment_category="salaried",
            annual_gross_income=1000000.0,
            annual_household_expenses=400000.0,
            dependents_count=1,
            years_of_support_needed=15,
            current_savings=100000.0,
            eligible_assets_for_family=500000.0 # Exceeds 100000!
        )

# TEST CASE 6: Customer with a tight premium budget
def test_case_6_tight_premium_budget():
    profile = CustomerProfile(
        age=30,
        employment_category="salaried",
        annual_gross_income=600000.0,
        annual_household_expenses=300000.0,
        dependents_count=1,
        years_of_support_needed=15,
        outstanding_liabilities=1000000.0,
        preferred_annual_premium_budget=8000.0, # Very tight ₹8,000 / year
        desired_policy_duration=25
    )
    recs = generate_recommendations(profile, calculated_gap=4000000.0)
    # Term insurance should rank highest because endowment / ULIP premiums are way beyond budget
    assert recs[0].product.category == "term"
    # Products with annual premium > 8000 must flag is_budget_affordable == False
    for r in recs:
        if r.estimated_annual_premium > 8000.0:
            assert r.is_budget_affordable is False

# TEST CASE 7: Customer who does not meet a product's documented eligibility rules
def test_case_7_ineligible_age_handling():
    profile = CustomerProfile(
        age=68, # Above 65 max entry age for term products
        employment_category="other",
        annual_gross_income=800000.0,
        annual_household_expenses=300000.0,
        dependents_count=1,
        years_of_support_needed=5,
        desired_policy_duration=10
    )
    recs = generate_recommendations(profile, calculated_gap=2000000.0)
    # The term products with max_entry_age=65 must be marked is_eligible == False and have fit_score == 0
    ineligible_terms = [r for r in recs if r.product.category == "term"]
    for it in ineligible_terms:
        assert it.is_eligible is False
        assert it.fit_score == 0
        assert any("age" in note.lower() for note in it.eligibility_notes)

# TEST CASE 8: Changes to policy tenure or desired coverage update calculations
def test_case_8_scenario_customization():
    profile = CustomerProfile(
        age=32,
        employment_category="salaried",
        annual_gross_income=1500000.0,
        annual_household_expenses=600000.0,
        dependents_count=2,
        years_of_support_needed=20,
        outstanding_liabilities=2000000.0
    )
    req1 = ScenarioCustomizationRequest(
        profile=profile,
        selected_product_id="term-hdfc-c2p",
        custom_sum_assured=5000000.0,
        custom_tenure=20,
        custom_premium_budget=20000.0
    )
    res1 = customize_scenario(req1)
    
    req2 = ScenarioCustomizationRequest(
        profile=profile,
        selected_product_id="term-hdfc-c2p",
        custom_sum_assured=10000000.0, # Double sum assured
        custom_tenure=20,
        custom_premium_budget=20000.0
    )
    res2 = customize_scenario(req2)
    
    # Premium must increase with higher sum assured
    assert res2.estimated_annual_premium > res1.estimated_annual_premium
    # Remaining gap must be lower with higher coverage
    assert res2.remaining_coverage_gap < res1.remaining_coverage_gap

# TEST CASE 9: Missing or incomplete optional information handled with defaults
def test_case_9_optional_defaults():
    # Only supply mandatory fields
    profile = CustomerProfile(
        age=28,
        employment_category="salaried",
        annual_gross_income=900000.0,
        annual_household_expenses=400000.0,
        dependents_count=1,
        years_of_support_needed=18
    )
    # Optional fields default to 0.0 or sensible bounds
    assert profile.outstanding_liabilities == 0.0
    assert profile.existing_life_insurance == 0.0
    assert profile.eligible_assets_for_family == 0.0
    assert profile.future_goals == []
    assert profile.discount_rate == 0.06
    assert profile.use_discounting is True
    
    res = generate_financial_assessment(profile)
    assert res.net_needs.net_additional_life_cover_required > 0.0

# TEST CASE 10: Booking attempt validation and collision prevention
def test_case_10_booking_workflow_and_validation(test_db):
    advisor = DEMO_ADVISORS[0]
    valid_slot = advisor.available_slots[0]
    
    req = ConsultationBookingRequest(
        advisor_id=advisor.id,
        customer_name="Rahul Verma",
        customer_email="rahul.verma@example.com",
        customer_phone="9876543210",
        booking_date="2026-11-15",
        time_slot=valid_slot,
        consultation_mode="video",
        notes_or_concerns="Reviewing term cover for home loan",
        recommended_product_category="term",
        calculated_cover_gap=7500000.0
    )
    
    # 1. First booking succeeds and is stored in test database
    res = create_booking(test_db, req)
    assert res.status == "CONFIRMED"
    assert res.booking_reference.startswith("IM-")
    assert res.advisor_name == advisor.name
    
    # 2. Second booking with the exact same slot and date must raise conflict
    with pytest.raises(ValueError, match="already booked"):
        create_booking(test_db, req)
        
    # 3. Invalid advisor ID must be rejected
    invalid_adv_req = req.model_copy(update={"advisor_id": "non-existent-id"})
    with pytest.raises(ValueError, match="not found"):
        create_booking(test_db, invalid_adv_req)
        
    # 4. Invalid slot must be rejected
    invalid_slot_req = req.model_copy(update={"time_slot": "03:00 AM - 03:30 AM"})
    with pytest.raises(ValueError, match="not an available slot"):
        create_booking(test_db, invalid_slot_req)
