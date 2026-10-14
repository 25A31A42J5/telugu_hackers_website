export interface FinancialGoal {
  description: string;
  estimated_amount: number;
  target_years: number;
}

export interface CustomerProfile {
  age: number;
  employment_category: string;
  annual_gross_income: number;
  annual_household_expenses: number;
  dependents_count: number;
  years_of_support_needed: number;
  risk_preference: string;
  protection_preference: string;
  outstanding_liabilities: number;
  existing_life_insurance: number;
  current_savings: number;
  eligible_assets_for_family: number;
  other_obligations: number;
  future_goals: FinancialGoal[];
  preferred_annual_premium_budget: number;
  desired_policy_duration: number;
  preferred_category?: string | null;
  discount_rate: number;
  use_discounting: boolean;
  assumed_retirement_age: number;
}

export interface GoalBreakdown {
  description: string;
  nominal_amount: number;
  target_years: number;
  present_value: number;
}

export interface NetNeedsBreakdown {
  outstanding_liabilities: number;
  income_replacement_nominal: number;
  income_replacement_pv: number;
  goals_nominal_total: number;
  goals_pv_total: number;
  goals_breakdown: GoalBreakdown[];
  other_obligations: number;
  gross_protection_resources_needed: number;
  eligible_financial_resources: number;
  existing_life_insurance_cover: number;
  total_existing_coverage_and_resources: number;
  net_additional_life_cover_required: number;
  discount_rate_used: number;
  is_discounted: boolean;
}

export interface HLVBreakdown {
  gross_annual_income: number;
  personal_consumption_deduction_pct: number;
  personal_consumption_deduction_amount: number;
  net_annual_family_contribution: number;
  remaining_working_years: number;
  discount_rate_used: number;
  gross_human_life_value: number;
  existing_cover_and_resources_deducted: number;
  hlv_additional_cover_needed: number;
}

export interface CalculationResult {
  net_needs: NetNeedsBreakdown;
  hlv: HLVBreakdown;
  summary_narrative: string;
  key_assumptions: string[];
  suggested_minimum_cover: number;
  suggested_ideal_cover: number;
  suggested_annual_premium_budget_range: {
    min_annual: number;
    max_annual: number;
    min_monthly: number;
    max_monthly: number;
  };
}

export interface ProductItem {
  id: string;
  name: string;
  category: string;
  provider: string;
  is_illustrative: boolean;
  intended_purpose: string;
  verification_status: string;
  min_entry_age: number;
  max_entry_age: number;
  min_sum_assured: number;
  max_sum_assured: number;
  min_tenure: number;
  max_tenure: number;
  base_annual_rate_per_1000: number;
  key_benefits: string[];
  advantages: string[];
  disadvantages_and_limitations: string[];
  exclusions_and_conditions: string[];
  charges_and_risks: string[];
  suitability_summary: string;
  trade_offs: string[];
  official_info_url: string;
  data_source_citation: string;
  last_verified: string;
}

export interface ProductRecommendation {
  product: ProductItem;
  category_label: string;
  fit_score: number;
  is_eligible: boolean;
  eligibility_notes: string[];
  match_reasons: string[];
  
  // Plan Overview
  intended_purpose: string;
  recommended_coverage_amount: number;
  recommended_tenure: number;
  estimated_annual_premium: number;
  estimated_monthly_premium: number;
  premium_verification_status: string;
  
  // Advantages and Disadvantages
  advantages: string[];
  disadvantages_and_limitations: string[];
  
  is_budget_affordable: boolean;
  affordability_notes: string;
  coverage_gap_addressed_pct: number;
  trade_offs: string[];
}

export interface ScenarioCustomizationResponse {
  product_id: string;
  product_name: string;
  category: string;
  custom_sum_assured: number;
  custom_tenure: number;
  estimated_annual_premium: number;
  estimated_monthly_premium: number;
  is_eligible: boolean;
  eligibility_messages: string[];
  remaining_coverage_gap: number;
  coverage_adequacy_pct: number;
  budget_fit: string;
  affordability_ratio_pct: number;
  disclaimer: string;
}

export interface AdvisorProfile {
  id: string;
  name: string;
  title: string;
  specialization: string;
  experience_years: number;
  languages: string[];
  rating: number;
  available_slots: string[];
  image_url: string;
  is_demo: boolean;
}

export interface ConsultationBookingRequest {
  advisor_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  booking_date: string;
  time_slot: string;
  consultation_mode: string;
  notes_or_concerns?: string;
  recommended_product_category?: string;
  calculated_cover_gap?: number;
}

export interface ConsultationBookingResponse {
  booking_reference: string;
  status: string;
  advisor_name: string;
  advisor_title: string;
  customer_name: string;
  scheduled_datetime: string;
  consultation_mode: string;
  summary_of_needs: string;
  is_demo: boolean;
  message: string;
}

export interface AdvisoryQuestionRequest {
  question: string;
  profile?: CustomerProfile;
  calculation_result?: CalculationResult;
  selected_category?: string;
}

export interface AdvisoryAnswerResponse {
  question: string;
  answer: string;
  related_topics: string[];
  disclaimer: string;
}
