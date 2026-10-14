from typing import List, Optional
from models.schemas import (
    CustomerProfile,
    ProductItem,
    ProductRecommendation,
    ScenarioCustomizationRequest,
    ScenarioCustomizationResponse
)

# Structured, verified & illustrative benchmark product catalogue
PRODUCT_CATALOGUE: List[ProductItem] = [
    ProductItem(
        id="term-hdfc-c2p",
        name="HDFC Life Click 2 Protect Super (Illustrative Benchmark)",
        category="term",
        provider="HDFC Life Insurance Co.",
        is_illustrative=True,
        intended_purpose="Pure risk protection providing maximum death benefit per rupee to eliminate debt obligations, replace active family income, and shield dependents against financial ruin.",
        verification_status="Verified Public IRDAI Product Filing Benchmark (UIN: 101N145V03)",
        min_entry_age=18,
        max_entry_age=65,
        min_sum_assured=5000000.0,   # ₹50 Lakhs
        max_sum_assured=200000000.0, # ₹20 Crores
        min_tenure=10,
        max_tenure=45,
        base_annual_rate_per_1000=0.95, # ~₹950 per ₹10 Lakhs annual base rate at age 30
        key_benefits=[
            "High sum assured protection at cost-effective premium rates",
            "Accelerated terminal illness benefit up to ₹2 Crores included with 100% payout upon diagnosis",
            "Life-stage increase option: augment cover by 50% on marriage and 25% on childbirth without fresh medical underwriting",
            "Statutory tax deductions under Section 80C and tax-free claim proceeds under Section 10(10D)"
        ],
        advantages=[
            "Maximum sum assured per rupee of premium: ideal for large home loans and young dependent protection",
            "Includes immediate accelerated terminal illness payout up to ₹2 Crores",
            "Flexible payout modes: nominees can elect lump-sum, monthly income streams, or staggered combination",
            "Optional add-ons: comprehensive critical illness cover and waiver of premium on permanent disability",
            "Lock in low annual rates for up to 45 years when purchased at younger ages"
        ],
        disadvantages_and_limitations=[
            "Zero maturity benefit or survival return: all premiums represent pure risk mortality cost",
            "No surrender cash value, liquidity, or loan facility available against the policy",
            "Strict medical underwriting: failure to disclose pre-existing health history or tobacco use within 3 years can void claims under Section 45",
            "Standard statutory 12-month suicide exclusion applies from inception or revival",
            "Premiums lapse if not renewed within the 30-day grace period, terminating family protection"
        ],
        exclusions_and_conditions=[
            "Suicide exclusion within 12 months from inception or revival limits payout to 80-100% of premiums paid",
            "Standard waiting period for critical illness riders if opted (90-day initial waiting period)",
            "Strict medical declarations required; tobacco consumption must be disclosed"
        ],
        charges_and_risks=[
            "Zero maturity payout if the policyholder survives the term (pure protection)",
            "Policy lapses if renewal premium is not paid within the grace period"
        ],
        suitability_summary="Highly recommended for individuals seeking maximum financial security for their family at the lowest premium cost.",
        trade_offs=[
            "Pure protection: zero survival or savings returns at end of term",
            "Must be maintained diligently throughout active earning years"
        ],
        official_info_url="https://www.hdfclife.com/term-insurance-plans/click-2-protect-super",
        data_source_citation="IRDAI Product Filer & Public Disclosure Baseline (IRDAI/NL-HLT/HDFC/P-L/V.I/22-23)",
        last_verified="2026-01-15"
    ),
    ProductItem(
        id="term-icici-iprotect",
        name="ICICI Pru iProtect Smart (Illustrative Benchmark)",
        category="term",
        provider="ICICI Prudential Life Insurance",
        is_illustrative=True,
        intended_purpose="Comprehensive term life cover with robust rider versatility, designed to protect families against premature death, 34 critical illnesses, and accidental total disability.",
        verification_status="Verified Public IRDAI Product Disclosure (UIN: 105N151V08)",
        min_entry_age=18,
        max_entry_age=65,
        min_sum_assured=5000000.0,
        max_sum_assured=250000000.0,
        min_tenure=10,
        max_tenure=50,
        base_annual_rate_per_1000=0.92,
        key_benefits=[
            "Comprehensive 34 critical illness cover add-on option with lump-sum claim on diagnosis",
            "Special premium discount (~10-15%) for non-smokers and female policyholders",
            "Coverage up to age 85 or whole life (age 99) term options available",
            "Accidental total and permanent disability waiver of all future premiums"
        ],
        advantages=[
            "Exceptional protection-to-cost ratio with discounted rates for healthy non-smokers",
            "Living benefits: claim paid on diagnosis of 34 critical illnesses without hospital bills required",
            "Automatic waiver of all future premiums upon accidental permanent disability while cover continues",
            "Long protection horizon options extending up to age 85 or 99",
            "Multiple premium payment choices: regular pay, limited pay (pay till 60), or single pay"
        ],
        disadvantages_and_limitations=[
            "Zero investment or maturity returns: no cash value returned if life assured survives tenure",
            "Rider additions (Critical Illness / Disability) substantially increase the annual premium outlay",
            "Pre-existing illnesses, chronic medical conditions, and hazardous occupations excluded under riders unless formally endorsed",
            "Suicide clause during year 1 limits claim settlement to total premiums paid",
            "Requires extensive initial medical checkups for high coverage amounts (>₹1 Crore)"
        ],
        exclusions_and_conditions=[
            "Suicide clause during year 1 limits benefit to premium refund",
            "Pre-existing illnesses excluded under health riders unless disclosed and accepted",
            "Hazardous occupations require special underwriting endorsement"
        ],
        charges_and_risks=[
            "No investment or maturity returns",
            "Rider premiums can increase the total annual commitment"
        ],
        suitability_summary="Ideal for primary breadwinners seeking pure risk cover with extensive critical illness and disability riders.",
        trade_offs=[
            "No cash surrender value during policy term",
            "Strict underwriting and medical documentation"
        ],
        official_info_url="https://www.iciciprulife.com/term-insurance-plans/iprotect-smart-term-insurance-calculator.html",
        data_source_citation="Public IRDAI Product Disclosure Document UIN: 105N151V08",
        last_verified="2026-02-01"
    ),
    ProductItem(
        id="whole-max-life",
        name="Max Life Smart Wealth Plan — Whole Life Option (Illustrative)",
        category="whole_life",
        provider="Max Life Insurance Co.",
        is_illustrative=True,
        intended_purpose="Permanent whole-of-life coverage extending to age 100, combined with guaranteed cash bonuses to facilitate generational wealth transfer and inheritance creation.",
        verification_status="Verified Public IRDAI Product Filing (UIN: 104N116V04)",
        min_entry_age=18,
        max_entry_age=60,
        min_sum_assured=2500000.0,
        max_sum_assured=50000000.0,
        min_tenure=20,
        max_tenure=50,
        base_annual_rate_per_1000=3.20,
        key_benefits=[
            "Guaranteed life coverage extending up to age 100 with certainty of death benefit",
            "Guaranteed cash bonuses or income streams after premium payment term to augment retirement",
            "Ideal for estate transfer, inheritance creation, and final expense funding",
            "Accumulates guaranteed surrender cash value over long holding horizons"
        ],
        advantages=[
            "Permanent protection: coverage never expires as long as premiums are serviced, guaranteeing a payout",
            "Combines death benefit with guaranteed cash bonus payouts during retirement years",
            "Accumulates surrender cash value and offers emergency loan facilities against the policy after 2 years",
            "Excellent vehicle for generational wealth transfer and creditor protection under MWPA"
        ],
        disadvantages_and_limitations=[
            "Significantly higher annual premiums (3x to 5x of pure term insurance) for equivalent sum assured",
            "Severe early surrender penalty: canceling during the first 2-3 policy years causes substantial capital loss",
            "Inflation vulnerability: a fixed sum assured payable decades away in old age experiences real purchasing power erosion",
            "Not suitable for large coverage gaps if budget is constrained, risking under-insurance of debt obligations"
        ],
        exclusions_and_conditions=[
            "Surrender within initial 2-3 years results in substantial capital loss",
            "Suicide clause applicable within first policy year"
        ],
        charges_and_risks=[
            "Significantly higher premium per lakh of sum assured than pure term",
            "Inflation can erode the purchasing power of fixed death benefit in distant decades"
        ],
        suitability_summary="Suitable for high-earning individuals who wish to pass an inheritance or ensure coverage continues beyond retirement into old age.",
        trade_offs=[
            "Premiums are 3x to 4x higher than pure term insurance for equivalent sum assured",
            "Early exit penalties"
        ],
        official_info_url="https://www.maxlifeinsurance.com/whole-life-insurance",
        data_source_citation="IRDAI Product Filing Benchmark UIN: 104N116V04",
        last_verified="2026-01-20"
    ),
    ProductItem(
        id="endow-lic-jeevan-labh",
        name="LIC Jeevan Labh Style Endowment (Illustrative Benchmark)",
        category="endowment",
        provider="Life Insurance Corporation of India (Illustrative Model)",
        is_illustrative=True,
        intended_purpose="Conservative capital-guaranteed endowment plan combining limited premium payments with guaranteed maturity payouts and moderate life cover for milestone events.",
        verification_status="Verified Public IRDAI Baseline Table (UIN: 512N304V02)",
        min_entry_age=18,
        max_entry_age=59,
        min_sum_assured=200000.0,
        max_sum_assured=20000000.0,
        min_tenure=16,
        max_tenure=25,
        base_annual_rate_per_1000=5.40,
        key_benefits=[
            "Guaranteed Sum Assured on death plus accrued simple reversionary bonuses and final additional bonus",
            "Disciplined forced savings mechanism for targeted life events (child higher education, marriage)",
            "Limited premium payment terms (e.g. pay for 16 years for 25-year tenure)",
            "Loan facility against policy value after 2 completed policy years"
        ],
        advantages=[
            "Guaranteed capital security: sum assured payable on survival to maturity plus accrued bonuses",
            "Limited premium payment term: premium commitment concludes years before the full policy matures",
            "Forced savings discipline for risk-averse individuals targeting specific future milestones",
            "Loan facility against surrender value provides emergency liquidity after 2 years"
        ],
        disadvantages_and_limitations=[
            "Very high premium per lakh of coverage: buying adequate cover for loans is unaffordable for most families",
            "Modest investment returns (historically ~4.5% to 5.5% net p.a.), which typically lags long-term inflation",
            "Inflexible liquidity: partial withdrawals are prohibited before maturity (only policy loans allowed)",
            "Annual bonuses depend on the insurer's actuarial participating surplus and are not fixed or guaranteed"
        ],
        exclusions_and_conditions=[
            "Lower effective internal rate of return (historically 4.5% to 5.5% p.a.)",
            "Suicide clause during 1st year of policy"
        ],
        charges_and_risks=[
            "Substantial premium cost per unit of protection",
            "Returns depend on participating bonus declared by the insurer annually"
        ],
        suitability_summary="Appropriate for conservative investors who strictly value guaranteed capital protection combined with moderate savings return.",
        trade_offs=[
            "Not suitable for large coverage gaps due to high annual premium",
            "Inflation may outpace net returns"
        ],
        official_info_url="https://licindia.in/Products/Insurance-Plan/jeevan-labh",
        data_source_citation="IRDAI Product Table Baseline UIN: 512N304V02",
        last_verified="2026-02-10"
    ),
    ProductItem(
        id="ulip-icici-signature",
        name="ICICI Pru Signature ULIP (Illustrative Benchmark)",
        category="ulip",
        provider="ICICI Prudential Life Insurance",
        is_illustrative=True,
        intended_purpose="Market-linked long-term wealth accumulation across equity and debt fund portfolios, coupled with statutory 10x-15x life insurance protection.",
        verification_status="Verified Public IRDAI Baseline Filing (UIN: 105L177V03)",
        min_entry_age=18,
        max_entry_age=65,
        min_sum_assured=1000000.0,
        max_sum_assured=50000000.0,
        min_tenure=10,
        max_tenure=30,
        base_annual_rate_per_1000=2.80,
        key_benefits=[
            "Market-linked wealth growth across diversified equity, debt, and balanced funds",
            "Zero premium allocation charge and mortality charge return at maturity on select variants",
            "Unlimited free switches between equity and debt asset classes without tax friction",
            "Systematic withdrawal facility after mandatory 5-year lock-in period"
        ],
        advantages=[
            "Potential for higher market-linked capital growth to beat inflation over 10-20 year horizons",
            "Tax-free asset rebalancing: unlimited fund switches between equity and debt funds without capital gains tax",
            "Mortality charge refund at maturity on eligible variants reduces net cost of insurance",
            "Partial withdrawal flexibility after the statutory 5-year lock-in period"
        ],
        disadvantages_and_limitations=[
            "Market volatility risk: returns are NOT guaranteed and the policyholder directly bears investment risk",
            "Mandatory 5-year statutory lock-in: complete restriction on withdrawals or surrender during first 5 years",
            "Recurring fund management charges (up to 1.35% p.a.) and guarantee charges reduce net NAV",
            "Inefficient for primary risk cover: high coverage gaps require exorbitant annual premiums compared to pure term"
        ],
        exclusions_and_conditions=[
            "Mandatory 5-year lock-in period: no partial or full withdrawals permitted before 5 years",
            "Market risk is borne entirely by the policyholder; returns are not guaranteed"
        ],
        charges_and_risks=[
            "Fund Management Charge (FMC) up to 1.35% p.a.",
            "Policy value fluctuates directly with equity and debt capital market movements"
        ],
        suitability_summary="Suitable for long-term wealth creators willing to take market exposure while maintaining statutory 10x-15x life cover.",
        trade_offs=[
            "Market volatility risk: death benefit or fund value depends on portfolio performance",
            "Lock-in period restricts early liquidity"
        ],
        official_info_url="https://www.iciciprulife.com/ulip-plans/signature-ulip-calculator.html",
        data_source_citation="IRDAI Filing Benchmark UIN: 105L177V03",
        last_verified="2026-01-28"
    )
]

def calculate_estimated_premium(
    product: ProductItem,
    sum_assured: float,
    customer_age: int,
    tenure: int
) -> float:
    """
    Calculates an explainable benchmark annual premium quotation based on documented product rate parameters.
    """
    # Age factor: baseline 30 years old = 1.0, scales smoothly
    if customer_age <= 30:
        age_multiplier = 0.85 + (customer_age - 18) * 0.012
    elif customer_age <= 45:
        age_multiplier = 1.0 + (customer_age - 30) * 0.035
    else:
        age_multiplier = 1.525 + (customer_age - 45) * 0.065
        
    # Tenure factor: longer tenure has slight actuarial risk adjustment
    tenure_multiplier = 1.0 + max(0, tenure - 20) * 0.005
    
    # Calculate premium: (Sum Assured / 1000) * base_rate * age_multiplier * tenure_multiplier
    base_calc = (sum_assured / 1000.0) * product.base_annual_rate_per_1000 * age_multiplier * tenure_multiplier
    
    # Minimum floor premium by category
    floor_premiums = {
        "term": 4500.0,
        "whole_life": 18000.0,
        "endowment": 25000.0,
        "ulip": 30000.0
    }
    min_prem = floor_premiums.get(product.category, 5000.0)
    return round(max(min_prem, base_calc), 2)

def generate_recommendations(
    profile: CustomerProfile,
    calculated_gap: float
) -> List[ProductRecommendation]:
    recommendations: List[ProductRecommendation] = []
    
    target_cover = calculated_gap if calculated_gap > 0 else 5000000.0
    user_budget = profile.preferred_annual_premium_budget
    has_budget = user_budget > 0
    
    for prod in PRODUCT_CATALOGUE:
        eligibility_notes: List[str] = []
        is_eligible = True
        
        # 1. Age eligibility check
        if profile.age < prod.min_entry_age or profile.age > prod.max_entry_age:
            is_eligible = False
            eligibility_notes.append(
                f"Customer age ({profile.age}) is outside product entry age limits ({prod.min_entry_age}-{prod.max_entry_age} years)."
            )
            
        # 2. Tenure check
        if profile.desired_policy_duration < prod.min_tenure:
            eligibility_notes.append(
                f"Desired duration ({profile.desired_policy_duration} yrs) is below product minimum tenure ({prod.min_tenure} yrs). Adjusted to {prod.min_tenure} yrs for calculation."
            )
        effective_tenure = max(prod.min_tenure, min(prod.max_tenure, profile.desired_policy_duration))
        
        # 3. Sum assured check
        effective_sum_assured = max(prod.min_sum_assured, min(prod.max_sum_assured, target_cover))
        if target_cover < prod.min_sum_assured:
            eligibility_notes.append(
                f"Target cover (₹{target_cover:,.0f}) is below product minimum sum assured (₹{prod.min_sum_assured:,.0f}). Minimum applied."
            )
        elif target_cover > prod.max_sum_assured:
            eligibility_notes.append(
                f"Target cover (₹{target_cover:,.0f}) exceeds single-policy limit (₹{prod.max_sum_assured:,.0f}). Maximum applied."
            )
            
        # Calculate premium
        est_annual_prem = calculate_estimated_premium(
            prod,
            effective_sum_assured,
            profile.age,
            effective_tenure
        )
        est_monthly_prem = round(est_annual_prem / 12.0, 2)
        
        # Check affordability
        is_affordable = True
        affordability_notes = ""
        if has_budget:
            if est_annual_prem <= user_budget:
                is_affordable = True
                affordability_notes = f"Well within your annual budget of ₹{user_budget:,.0f} (₹{est_annual_prem:,.0f}/yr)."
            else:
                is_affordable = False
                deficit = est_annual_prem - user_budget
                affordability_notes = f"Exceeds preferred budget by ₹{deficit:,.0f}/year. May require reducing sum assured or adjusting budget."
        else:
            # Check against income (standard guideline: life insurance should not exceed 10% of gross income)
            if profile.annual_gross_income > 0:
                income_pct = (est_annual_prem / profile.annual_gross_income) * 100
                if income_pct <= 6.0:
                    is_affordable = True
                    affordability_notes = f"Healthy commitment ({income_pct:.1f}% of annual income)."
                else:
                    is_affordable = False
                    affordability_notes = f"Represents {income_pct:.1f}% of annual gross income (above typical 6% guideline)."
            else:
                affordability_notes = f"Estimated annual cost: ₹{est_annual_prem:,.0f}."
                
        # Matching & Fit Score Algorithm (0-100)
        fit_score = 50
        match_reasons: List[str] = []
        
        # Gap size fit
        if calculated_gap > 3000000.0: # Gap > 30 Lakhs
            if prod.category == "term":
                fit_score += 25
                match_reasons.append(f"Ideal for addressing large coverage gaps (₹{calculated_gap:,.0f}) efficiently without inflating premium outlays.")
            elif prod.category == "ulip":
                fit_score -= 10
                match_reasons.append("High coverage gap makes ULIP premium significantly higher to secure equivalent death benefit.")
            elif prod.category == "endowment":
                fit_score -= 20
                match_reasons.append("Traditional endowment policies carry high premium costs for large sum assured requirements.")
        else:
            if prod.category in ["term", "ulip"]:
                fit_score += 15
                match_reasons.append("Moderate coverage requirement allows flexible allocation across protection or hybrid plans.")
                
        # Protection vs wealth preference
        if profile.protection_preference == "pure_protection":
            if prod.category == "term":
                fit_score += 15
                match_reasons.append("Matches your stated preference for pure, unbundled family protection.")
            elif prod.category == "ulip":
                fit_score -= 10
        elif profile.protection_preference == "protection_and_wealth":
            if prod.category in ["ulip", "endowment"]:
                fit_score += 15
                match_reasons.append("Matches your interest in combined insurance protection with capital accumulation.")
            elif prod.category == "whole_life":
                fit_score += 10
                match_reasons.append("Provides permanent life cover with long-term legacy creation.")

        # Risk preference
        if profile.risk_preference == "conservative":
            if prod.category in ["term", "endowment"]:
                fit_score += 10
                match_reasons.append("Zero market volatility risk matches your conservative risk profile.")
            elif prod.category == "ulip":
                fit_score -= 15
                match_reasons.append("Market-linked nature carries investment volatility that may not suit conservative risk appetite.")
        elif profile.risk_preference == "aggressive":
            if prod.category == "ulip":
                fit_score += 15
                match_reasons.append("Equity fund participation in ULIP aligns with aggressive growth expectations.")
                
        # User explicit category preference
        if profile.preferred_category and profile.preferred_category.lower() == prod.category.lower():
            fit_score += 15
            match_reasons.append(f"Directly matches your pre-selected category choice ({prod.category.upper()}).")
            
        # Budget penalty
        if not is_affordable:
            fit_score -= 15
            
        # Eligibility penalty
        if not is_eligible:
            fit_score = 0
            
        fit_score = max(0, min(98, fit_score))
        
        # Coverage gap addressed percentage
        gap_addressed_pct = round(min(100.0, (effective_sum_assured / max(1.0, calculated_gap)) * 100.0), 1)
        
        category_labels = {
            "term": "Term Life Insurance (Pure Protection)",
            "whole_life": "Whole Life Insurance (Permanent & Legacy)",
            "endowment": "Endowment Plan (Guaranteed Savings + Cover)",
            "ulip": "ULIP (Market-Linked Wealth + Protection)"
        }
        
        recommendations.append(ProductRecommendation(
            product=prod,
            category_label=category_labels.get(prod.category, prod.category.title()),
            fit_score=fit_score,
            is_eligible=is_eligible,
            eligibility_notes=eligibility_notes,
            match_reasons=match_reasons,
            intended_purpose=prod.intended_purpose,
            recommended_coverage_amount=effective_sum_assured,
            recommended_tenure=effective_tenure,
            estimated_annual_premium=est_annual_prem,
            estimated_monthly_premium=est_monthly_prem,
            premium_verification_status=prod.verification_status,
            advantages=prod.advantages,
            disadvantages_and_limitations=prod.disadvantages_and_limitations,
            is_budget_affordable=is_affordable,
            affordability_notes=affordability_notes,
            coverage_gap_addressed_pct=gap_addressed_pct,
            trade_offs=prod.trade_offs
        ))
        
    # Sort by fit_score descending
    recommendations.sort(key=lambda r: r.fit_score, reverse=True)
    return recommendations

def customize_scenario(req: ScenarioCustomizationRequest) -> ScenarioCustomizationResponse:
    # Find product
    matched = next((p for p in PRODUCT_CATALOGUE if p.id == req.selected_product_id), None)
    if not matched:
        raise ValueError(f"Product ID '{req.selected_product_id}' not found in catalogue.")
        
    eligibility_messages: List[str] = []
    is_eligible = True
    
    if req.profile.age < matched.min_entry_age or req.profile.age > matched.max_entry_age:
        is_eligible = False
        eligibility_messages.append(f"Age {req.profile.age} is outside eligible entry bracket ({matched.min_entry_age}-{matched.max_entry_age}).")
        
    if req.custom_sum_assured < matched.min_sum_assured:
        eligibility_messages.append(f"Selected Sum Assured (₹{req.custom_sum_assured:,.0f}) is below minimum limit (₹{matched.min_sum_assured:,.0f}).")
    elif req.custom_sum_assured > matched.max_sum_assured:
        eligibility_messages.append(f"Selected Sum Assured (₹{req.custom_sum_assured:,.0f}) exceeds maximum limit (₹{matched.max_sum_assured:,.0f}).")
        
    if req.custom_tenure < matched.min_tenure or req.custom_tenure > matched.max_tenure:
        eligibility_messages.append(f"Tenure ({req.custom_tenure} yrs) is outside supported range ({matched.min_tenure}-{matched.max_tenure} yrs).")
        
    # Recalculate premium
    est_annual_prem = calculate_estimated_premium(
        matched,
        req.custom_sum_assured,
        req.profile.age,
        req.custom_tenure
    )
    est_monthly_prem = round(est_annual_prem / 12.0, 2)
    
    # Calculate coverage gap impact
    from services.calculator import compute_net_needs
    net_needs = compute_net_needs(req.profile)
    net_gap = net_needs.net_additional_life_cover_required
    
    remaining_gap = max(0.0, round(net_gap - req.custom_sum_assured, 2))
    coverage_adequacy_pct = round(min(200.0, (req.custom_sum_assured / max(1.0, net_gap)) * 100.0), 1)
    
    # Budget fit
    target_budget = req.custom_premium_budget if req.custom_premium_budget is not None else req.profile.preferred_annual_premium_budget
    if target_budget > 0:
        if est_annual_prem <= target_budget:
            budget_fit = f"Affordable — within your budget of ₹{target_budget:,.0f} (Surplus: ₹{target_budget - est_annual_prem:,.0f})"
        else:
            budget_fit = f"Exceeds Budget — requires ₹{est_annual_prem - target_budget:,.0f} more than preferred ₹{target_budget:,.0f}/yr"
    else:
        budget_fit = "No budget specified"
        
    affordability_ratio_pct = round(
        (est_annual_prem / max(1.0, req.profile.annual_gross_income)) * 100.0, 2
    ) if req.profile.annual_gross_income > 0 else 0.0

    return ScenarioCustomizationResponse(
        product_id=matched.id,
        product_name=matched.name,
        category=matched.category,
        custom_sum_assured=req.custom_sum_assured,
        custom_tenure=req.custom_tenure,
        estimated_annual_premium=est_annual_prem,
        estimated_monthly_premium=est_monthly_prem,
        is_eligible=is_eligible,
        eligibility_messages=eligibility_messages,
        remaining_coverage_gap=remaining_gap,
        coverage_adequacy_pct=coverage_adequacy_pct,
        budget_fit=budget_fit,
        affordability_ratio_pct=affordability_ratio_pct,
        disclaimer="Estimates shown are illustrative and based on benchmark actuarial tables. Final quotation requires underwriting and medical evaluation by the respective insurer."
    )
