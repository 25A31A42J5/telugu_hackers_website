from typing import List, Optional
from pydantic import BaseModel, Field, field_validator, model_validator

class FinancialGoal(BaseModel):
    description: str = Field(..., min_length=2, max_length=100, description="Goal name/description")
    estimated_amount: float = Field(..., ge=0, description="Future estimated amount in INR")
    target_years: int = Field(..., ge=1, le=50, description="Years from now when funds are needed")

class CustomerProfile(BaseModel):
    # Personal Profile
    age: int = Field(..., ge=18, le=75, description="Age in years (18 to 75)")
    employment_category: str = Field(..., description="salaried, self_employed, business_owner, or other")
    annual_gross_income: float = Field(..., ge=0, description="Annual gross income in INR")
    annual_household_expenses: float = Field(..., ge=0, description="Annual household living expenses in INR")
    dependents_count: int = Field(..., ge=0, le=20, description="Number of financial dependents")
    years_of_support_needed: int = Field(..., ge=1, le=50, description="Expected years of financial support required")
    risk_preference: str = Field(default="balanced", description="conservative, balanced, or aggressive")
    protection_preference: str = Field(default="pure_protection", description="pure_protection or protection_and_wealth")

    # Financial Obligations
    outstanding_liabilities: float = Field(default=0.0, ge=0, description="Home loans, auto loans, personal loans, credit card debt")
    existing_life_insurance: float = Field(default=0.0, ge=0, description="Current total life insurance coverage sum assured")
    current_savings: float = Field(default=0.0, ge=0, description="Total liquid savings and financial investments")
    eligible_assets_for_family: float = Field(default=0.0, ge=0, description="Assets dedicated strictly for family protection")
    other_obligations: float = Field(default=0.0, ge=0, description="Emergency buffer, immediate estate/funeral costs")
    future_goals: List[FinancialGoal] = Field(default_factory=list, description="Dynamic future milestone goals")

    # Budget & Preferences
    preferred_annual_premium_budget: float = Field(default=0.0, ge=0, description="Customer preferred annual premium budget in INR")
    desired_policy_duration: int = Field(default=30, ge=5, le=50, description="Desired coverage duration in years")
    preferred_category: Optional[str] = Field(default=None, description="Optional customer preferred product category")
    
    # Calculation assumptions
    discount_rate: float = Field(default=0.06, ge=0.0, le=0.20, description="Configurable discount/inflation-adjusted rate (0.00 to 0.20)")
    use_discounting: bool = Field(default=True, description="Whether to discount future expenses & goals to Present Value")
    assumed_retirement_age: int = Field(default=60, ge=45, le=75, description="Expected retirement age for HLV method")

    @field_validator("employment_category")
    @classmethod
    def validate_employment(cls, v: str) -> str:
        allowed = {"salaried", "self_employed", "business_owner", "other"}
        if v.lower() not in allowed:
            raise ValueError(f"Employment category must be one of {allowed}")
        return v.lower()

    @model_validator(mode="after")
    def validate_logical_consistency(self):
        if self.eligible_assets_for_family > self.current_savings and self.current_savings > 0:
            raise ValueError("Eligible assets for family protection cannot exceed total current savings")
        if self.annual_household_expenses > self.annual_gross_income and self.annual_gross_income > 0:
            # Not strictly an error in distress years, but we check expenses >= 0
            pass
        return self

class GoalBreakdown(BaseModel):
    description: str
    nominal_amount: float
    target_years: int
    present_value: float

class NetNeedsBreakdown(BaseModel):
    outstanding_liabilities: float
    income_replacement_nominal: float
    income_replacement_pv: float
    goals_nominal_total: float
    goals_pv_total: float
    goals_breakdown: List[GoalBreakdown]
    other_obligations: float
    gross_protection_resources_needed: float
    eligible_financial_resources: float
    existing_life_insurance_cover: float
    total_existing_coverage_and_resources: float
    net_additional_life_cover_required: float
    discount_rate_used: float
    is_discounted: bool

class HLVBreakdown(BaseModel):
    gross_annual_income: float
    personal_consumption_deduction_pct: float
    personal_consumption_deduction_amount: float
    net_annual_family_contribution: float
    remaining_working_years: int
    discount_rate_used: float
    gross_human_life_value: float
    existing_cover_and_resources_deducted: float
    hlv_additional_cover_needed: float

class CalculationResult(BaseModel):
    net_needs: NetNeedsBreakdown
    hlv: HLVBreakdown
    summary_narrative: str
    key_assumptions: List[str]
    suggested_minimum_cover: float
    suggested_ideal_cover: float
    suggested_annual_premium_budget_range: dict

class ProductItem(BaseModel):
    id: str
    name: str
    category: str  # term, whole_life, endowment, ulip
    provider: str
    is_illustrative: bool = True
    intended_purpose: str
    verification_status: str = "Verified Public IRDAI Product Filing Benchmark"
    min_entry_age: int
    max_entry_age: int
    min_sum_assured: float
    max_sum_assured: float
    min_tenure: int
    max_tenure: int
    base_annual_rate_per_1000: float
    key_benefits: List[str]
    advantages: List[str]
    disadvantages_and_limitations: List[str]
    exclusions_and_conditions: List[str]
    charges_and_risks: List[str]
    suitability_summary: str
    trade_offs: List[str]
    official_info_url: str
    data_source_citation: str
    last_verified: str

class ProductRecommendation(BaseModel):
    product: ProductItem
    category_label: str
    fit_score: int  # 0 to 100
    is_eligible: bool
    eligibility_notes: List[str]
    match_reasons: List[str]
    
    # Plan Overview fields
    intended_purpose: str
    recommended_coverage_amount: float
    recommended_tenure: int
    estimated_annual_premium: float
    estimated_monthly_premium: float
    premium_verification_status: str
    
    # Comprehensive Advantages and Disadvantages
    advantages: List[str]
    disadvantages_and_limitations: List[str]
    
    is_budget_affordable: bool
    affordability_notes: str
    coverage_gap_addressed_pct: float
    trade_offs: List[str]

class ScenarioCustomizationRequest(BaseModel):
    profile: CustomerProfile
    selected_product_id: str
    custom_sum_assured: float = Field(..., gt=0)
    custom_tenure: int = Field(..., ge=5, le=50)
    custom_premium_budget: Optional[float] = Field(default=None, ge=0)

class ScenarioCustomizationResponse(BaseModel):
    product_id: str
    product_name: str
    category: str
    custom_sum_assured: float
    custom_tenure: int
    estimated_annual_premium: float
    estimated_monthly_premium: float
    is_eligible: bool
    eligibility_messages: List[str]
    remaining_coverage_gap: float
    coverage_adequacy_pct: float
    budget_fit: str
    affordability_ratio_pct: float
    disclaimer: str

class AdvisorProfile(BaseModel):
    id: str
    name: str
    title: str
    specialization: str
    experience_years: int
    languages: List[str]
    rating: float
    available_slots: List[str]
    image_url: str
    is_demo: bool = True

class ConsultationBookingRequest(BaseModel):
    advisor_id: str
    customer_name: str = Field(..., min_length=2, max_length=80)
    customer_email: str = Field(..., min_length=5, max_length=100)
    customer_phone: str = Field(..., min_length=10, max_length=15)
    booking_date: str = Field(..., min_length=8, max_length=12) # YYYY-MM-DD
    time_slot: str = Field(..., min_length=4, max_length=30)
    consultation_mode: str = Field(..., description="video, phone, or in_person")
    notes_or_concerns: Optional[str] = Field(default=None, max_length=500)
    recommended_product_category: Optional[str] = None
    calculated_cover_gap: Optional[float] = None

class ConsultationBookingResponse(BaseModel):
    booking_reference: str
    status: str
    advisor_name: str
    advisor_title: str
    customer_name: str
    scheduled_datetime: str
    consultation_mode: str
    summary_of_needs: str
    is_demo: bool = True
    message: str

class AdvisoryQuestionRequest(BaseModel):
    question: str = Field(..., min_length=2, max_length=500)
    profile: Optional[CustomerProfile] = None
    calculation_result: Optional[CalculationResult] = None
    selected_category: Optional[str] = None

class AdvisoryAnswerResponse(BaseModel):
    question: str
    answer: str
    related_topics: List[str]
    disclaimer: str
