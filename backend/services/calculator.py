import math
from typing import List
from models.schemas import (
    CustomerProfile,
    GoalBreakdown,
    NetNeedsBreakdown,
    HLVBreakdown,
    CalculationResult
)

def calculate_annuity_pv(annual_amount: float, years: int, rate: float, use_discounting: bool) -> float:
    """
    Calculates Present Value of an ordinary annual annuity.
    If use_discounting is False or rate == 0, returns undiscounted sum (amount * years).
    """
    if annual_amount <= 0 or years <= 0:
        return 0.0
    if not use_discounting or rate <= 0:
        return float(annual_amount * years)
    
    # Formula: PV = PMT * [1 - (1 + r)^(-n)] / r
    pv = annual_amount * (1.0 - math.pow(1.0 + rate, -years)) / rate
    return round(pv, 2)

def calculate_single_goal_pv(nominal_amount: float, target_years: int, rate: float, use_discounting: bool) -> float:
    """
    Calculates Present Value of a single future cash outlay.
    If use_discounting is False or rate == 0, returns nominal amount.
    """
    if nominal_amount <= 0:
        return 0.0
    if not use_discounting or rate <= 0 or target_years <= 0:
        return float(nominal_amount)
    
    # Formula: PV = FV / (1 + r)^n
    pv = nominal_amount / math.pow(1.0 + rate, target_years)
    return round(pv, 2)

def compute_net_needs(profile: CustomerProfile) -> NetNeedsBreakdown:
    rate = profile.discount_rate if profile.use_discounting else 0.0
    
    # 1. Income replacement
    income_nominal = round(profile.annual_household_expenses * profile.years_of_support_needed, 2)
    income_pv = calculate_annuity_pv(
        profile.annual_household_expenses,
        profile.years_of_support_needed,
        rate,
        profile.use_discounting
    )
    
    # 2. Future Goals
    goals_nominal_sum = 0.0
    goals_pv_sum = 0.0
    breakdowns: List[GoalBreakdown] = []
    
    for g in profile.future_goals:
        nom = round(g.estimated_amount, 2)
        pv = calculate_single_goal_pv(nom, g.target_years, rate, profile.use_discounting)
        goals_nominal_sum += nom
        goals_pv_sum += pv
        breakdowns.append(GoalBreakdown(
            description=g.description,
            nominal_amount=nom,
            target_years=g.target_years,
            present_value=pv
        ))
    
    # 3. Gross Protection Resources Needed
    gross_needed = round(
        profile.outstanding_liabilities
        + income_pv
        + goals_pv_sum
        + profile.other_obligations,
        2
    )
    
    # 4. Total Existing Resources Available
    existing_cover = round(profile.existing_life_insurance, 2)
    eligible_resources = round(profile.eligible_assets_for_family, 2)
    total_deductions = round(existing_cover + eligible_resources, 2)
    
    # 5. Net Additional Cover Required (minimum floor of 0)
    net_gap = max(0.0, round(gross_needed - total_deductions, 2))
    
    return NetNeedsBreakdown(
        outstanding_liabilities=round(profile.outstanding_liabilities, 2),
        income_replacement_nominal=income_nominal,
        income_replacement_pv=income_pv,
        goals_nominal_total=round(goals_nominal_sum, 2),
        goals_pv_total=round(goals_pv_sum, 2),
        goals_breakdown=breakdowns,
        other_obligations=round(profile.other_obligations, 2),
        gross_protection_resources_needed=gross_needed,
        eligible_financial_resources=eligible_resources,
        existing_life_insurance_cover=existing_cover,
        total_existing_coverage_and_resources=total_deductions,
        net_additional_life_cover_required=net_gap,
        discount_rate_used=rate,
        is_discounted=profile.use_discounting
    )

def compute_human_life_value(profile: CustomerProfile) -> HLVBreakdown:
    """
    Human Life Value (HLV) Method:
    Capitalizes future economic earning power dedicated to dependents.
    """
    gross_income = round(profile.annual_gross_income, 2)
    remaining_years = max(1, profile.assumed_retirement_age - profile.age)
    
    # Personal consumption percentage based on dependents
    if profile.dependents_count == 0:
        personal_consumption_pct = 0.40
    elif profile.dependents_count == 1:
        personal_consumption_pct = 0.35
    elif profile.dependents_count == 2:
        personal_consumption_pct = 0.30
    else:
        personal_consumption_pct = 0.25
        
    personal_amount = round(gross_income * personal_consumption_pct, 2)
    net_family_contribution = max(0.0, round(gross_income - personal_amount, 2))
    
    rate = profile.discount_rate if profile.use_discounting else 0.0
    hlv_gross = calculate_annuity_pv(
        net_family_contribution,
        remaining_years,
        rate,
        profile.use_discounting
    )
    
    deductions = round(profile.existing_life_insurance + profile.eligible_assets_for_family, 2)
    hlv_net = max(0.0, round(hlv_gross - deductions, 2))
    
    return HLVBreakdown(
        gross_annual_income=gross_income,
        personal_consumption_deduction_pct=personal_consumption_pct,
        personal_consumption_deduction_amount=personal_amount,
        net_annual_family_contribution=net_family_contribution,
        remaining_working_years=remaining_years,
        discount_rate_used=rate,
        gross_human_life_value=round(hlv_gross, 2),
        existing_cover_and_resources_deducted=deductions,
        hlv_additional_cover_needed=round(hlv_net, 2)
    )

def generate_financial_assessment(profile: CustomerProfile) -> CalculationResult:
    net_needs = compute_net_needs(profile)
    hlv = compute_human_life_value(profile)
    
    # Suggested bounds
    ideal_cover = net_needs.net_additional_life_cover_required
    min_cover = max(0.0, round(ideal_cover * 0.80, 2))
    
    # Estimated benchmark annual premium for pure term insurance (approx ₹120-₹200 per ₹10,00,000 per month for standard age)
    # Typical term rates in India: ~₹0.80 to ₹1.50 per ₹1,000 sum assured annually for age 25-45
    age_factor = max(0.8, (profile.age - 20) * 0.05 + 0.8)
    est_annual_term_premium_min = round(max(2500.0, ideal_cover * 0.0008 * age_factor), 2)
    est_annual_term_premium_max = round(max(3500.0, ideal_cover * 0.0016 * age_factor), 2)
    
    assumptions = [
        f"Primary calculation uses the transparent Net Needs Approach with {'a ' + str(int(profile.discount_rate * 100)) + '% real discount rate' if profile.use_discounting else 'undiscounted nominal figures'}.",
        f"Family income support calculated for {profile.years_of_support_needed} years based on annual household expenses of ₹{profile.annual_household_expenses:,.0f}.",
        f"Existing life insurance cover (₹{profile.existing_life_insurance:,.0f}) and earmarked assets (₹{profile.eligible_assets_for_family:,.0f}) are subtracted once without double-counting.",
        f"Human Life Value comparison assumes retirement at age {profile.assumed_retirement_age} ({hlv.remaining_working_years} productive earning years remaining) with a {int(hlv.personal_consumption_deduction_pct * 100)}% personal consumption deduction."
    ]
    
    if net_needs.net_additional_life_cover_required == 0:
        summary_narrative = (
            f"Great news! Your existing life cover (₹{profile.existing_life_insurance:,.0f}) and earmarked financial resources "
            f"(₹{profile.eligible_assets_for_family:,.0f}) are sufficient to cover your family's gross protection requirements "
            f"of ₹{net_needs.gross_protection_resources_needed:,.0f}. You do not have an immediate coverage shortfall under these assumptions."
        )
    else:
        summary_narrative = (
            f"Based on your profile, your family requires ₹{net_needs.gross_protection_resources_needed:,.0f} in total financial protection resources. "
            f"After accounting for ₹{net_needs.total_existing_coverage_and_resources:,.0f} in existing cover and earmarked assets, "
            f"your estimated additional life cover requirement is ₹{net_needs.net_additional_life_cover_required:,.0f}."
        )

    return CalculationResult(
        net_needs=net_needs,
        hlv=hlv,
        summary_narrative=summary_narrative,
        key_assumptions=assumptions,
        suggested_minimum_cover=min_cover,
        suggested_ideal_cover=ideal_cover,
        suggested_annual_premium_budget_range={
            "min_annual": est_annual_term_premium_min,
            "max_annual": est_annual_term_premium_max,
            "min_monthly": round(est_annual_term_premium_min / 12, 2),
            "max_monthly": round(est_annual_term_premium_max / 12, 2)
        }
    )
