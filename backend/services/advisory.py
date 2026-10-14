import re
from typing import Optional, List
from models.schemas import (
    CustomerProfile,
    CalculationResult,
    AdvisoryQuestionRequest,
    AdvisoryAnswerResponse
)

def answer_advisory_query(req: AdvisoryQuestionRequest) -> AdvisoryAnswerResponse:
    q = req.question.lower().strip()
    profile: Optional[CustomerProfile] = req.profile
    calc: Optional[CalculationResult] = req.calculation_result
    
    # Context values if available
    gap_val = f"₹{calc.net_needs.net_additional_life_cover_required:,.0f}" if calc else "your estimated gap"
    gross_val = f"₹{calc.net_needs.gross_protection_resources_needed:,.0f}" if calc else "your gross financial obligations"
    deductions_val = f"₹{calc.net_needs.total_existing_coverage_and_resources:,.0f}" if calc else "existing insurance and dedicated assets"
    income_val = f"₹{profile.annual_gross_income:,.0f}" if profile else "your annual income"
    liabilities_val = f"₹{profile.outstanding_liabilities:,.0f}" if profile else "outstanding debt"
    expenses_val = f"₹{profile.annual_household_expenses:,.0f}" if profile else "household expenses"
    years_val = f"{profile.years_of_support_needed} years" if profile else "the required support horizon"
    hlv_val = f"₹{calc.hlv.gross_human_life_value:,.0f}" if calc else "your Human Life Value"
    
    # Topic matching
    if any(k in q for k in ["why do i need", "how much cover", "explain my coverage", "coverage gap", "why this amount"]):
        answer = (
            f"### Why You Need {gap_val} in Additional Life Cover\n\n"
            f"Your coverage requirement is determined using the **Net Needs Approach**, an actuarially sound methodology rather than an arbitrary income multiple:\n\n"
            f"1. **Gross Protection Resources Required ({gross_val})**:\n"
            f"   - **Family Income Support**: To replace living expenses of {expenses_val}/year for {years_val}.\n"
            f"   - **Debt Cancellation**: Outstanding liabilities of {liabilities_val} to ensure family is debt-free.\n"
            f"   - **Future Milestone Goals**: Preserving funded commitments for children's higher education or housing.\n\n"
            f"2. **Deductions Applied ({deductions_val})**:\n"
            f"   - We subtract your existing life policies and assets specifically earmarked for family protection.\n\n"
            f"3. **Resulting Net Gap**: **{gap_val}** is the exact net shortfall your family would face to maintain their standard of living without compromise."
        )
        related = [
            "What is the difference between total need and additional cover?",
            "What is Human Life Value (HLV) and why does it differ?",
            "What questions should I ask my insurance advisor?"
        ]
        
    elif any(k in q for k in ["total need", "additional cover", "difference between total"]):
        answer = (
            "### Total Financial Need vs. Additional Life Cover\n\n"
            "Understanding this distinction prevents both under-insurance and wasteful over-insurance:\n\n"
            f"- **Total Financial Need (Gross Need = {gross_val})**: This is the complete capital sum required to extinguish all liabilities, provide income replacement until dependents are financially independent, and fund future milestone goals.\n"
            f"- **Existing Resources & Cover ({deductions_val})**: Assets and life policies you already possess that can be immediately mobilized.\n"
            f"- **Additional Life Cover (Net Gap = {gap_val})**: This is the actual amount of *new* insurance you need to buy today. We deduct what you already have so you don't pay unnecessary premiums for double coverage!"
        )
        related = [
            "Why is Term Insurance recommended over ULIP or Endowment?",
            "How does discounting affect my calculation?",
            "What happens if my loans are repaid early?"
        ]
        
    elif any(k in q for k in ["hlv", "human life value", "differ from net needs", "alternative method"]):
        answer = (
            "### Human Life Value (HLV) vs. Net Needs Approach\n\n"
            "Both methods assess life insurance requirements, but from two different economic perspectives:\n\n"
            f"1. **Human Life Value (HLV = {hlv_val})**:\n"
            "   - **Philosophy**: Treats the primary breadwinner as an economic asset generating cash flows.\n"
            "   - **Calculation**: Takes gross income, deducts personal taxes and personal consumption (leaving the family's share), and discounts that net income over remaining working years to retirement.\n\n"
            f"2. **Net Needs Approach (Selected Method = {gap_val})**:\n"
            "   - **Philosophy**: Liability and goal-driven. Asks *'what specific bills, debts, and life milestones must the family fund if income ceases tomorrow?'*\n\n"
            "**Why they differ**: HLV looks at earning potential, whereas Net Needs looks at concrete family spending needs. When young with high future income and low expenses, HLV is often higher. As you build wealth and debt decreases, Net Needs becomes much more precise."
        )
        related = [
            "Why do I need this much cover?",
            "How does inflation affect my life cover?",
            "What questions should I ask my insurance advisor?"
        ]

    elif any(k in q for k in ["term vs", "ulip", "endowment", "whole life", "why term", "difference between"]):
        answer = (
            "### Comparison: Term vs. Endowment vs. ULIP vs. Whole Life\n\n"
            "| Feature | Term Life Insurance | Endowment Plan | ULIP | Whole Life |\n"
            "| :--- | :--- | :--- | :--- | :--- |\n"
            "| **Primary Goal** | Pure High Protection | Guaranteed Savings + Cover | Market Investment + Cover | Lifelong Cover & Legacy |\n"
            "| **Cost / Premium** | Very Low (Most Cost-Effective) | High per Lakh Cover | Moderate-High | High |\n"
            "| **Maturity Benefit** | Zero (unless TROP) | Guaranteed Sum + Bonus | Fund Value (Market-Linked) | Cash value / Death at 100 |\n"
            "| **Suitability** | Families with debt & dependents | Conservative forced saving | Long-term capital growth | Estate planning & inheritance |\n\n"
            "**Insurance Mantra Recommendation Guideline**: If your primary objective is shielding dependents against financial vulnerability, **pure term life** provides the largest sum assured per rupee spent."
        )
        related = [
            "What is the difference between Sum Assured and Premium?",
            "What are common exclusions and waiting periods?",
            "What questions should I ask my insurance advisor?"
        ]

    elif any(k in q for k in ["sum assured", "premium", "difference between sum assured"]):
        answer = (
            "### Sum Assured vs. Premium Explained\n\n"
            "- **Sum Assured (Death Benefit)**: The guaranteed capital amount that the insurer agrees to pay your designated beneficiaries if the life assured passes away during the policy term. For example, ₹1 Crore or ₹2 Crores.\n"
            "- **Premium**: The recurring payment (annual, half-yearly, or monthly) that you pay to the insurance company to keep that contract active. For example, ₹14,000 per year.\n\n"
            "> **Key Rule**: A higher sum assured does not require a proportionately huge premium in pure term plans — ₹1 Crore of cover for a healthy 30-year-old typically costs under ₹1,000 to ₹1,400 per month!"
        )
        related = [
            "What is the difference between total need and additional cover?",
            "What are common exclusions and waiting periods?",
            "What questions should I ask my insurance advisor?"
        ]

    elif any(k in q for k in ["exclusion", "waiting", "conditions", "claim rejection", "not covered"]):
        answer = (
            "### Important Policy Exclusions & Underwriting Conditions\n\n"
            "Transparency is critical when buying life insurance. Key clauses to review:\n\n"
            "1. **Suicide Clause**: Standard IRDAI clause: suicide within the first 12 months from inception or revival limits payout to 80-100% of premiums paid.\n"
            "2. **Non-Disclosure of Pre-Existing Conditions**: Under Section 45 of the Insurance Act, 1938, you must disclose past surgeries, chronic illnesses (diabetes, hypertension), tobacco/nicotine use, and family medical history truthfully. While policies cannot be contested after 3 years except for fraud, non-disclosure within 3 years can result in claim repudiation.\n"
            "3. **Hazardous Activities & War**: Engaging in dangerous aviation, extreme sports, or active war participation is excluded unless specifically endorsed.\n"
            "4. **Rider Waiting Periods**: Critical illness and disability riders usually carry a 90-day initial waiting period and a 14 to 30-day survival period."
        )
        related = [
            "What questions should I ask my insurance advisor?",
            "Why is Term Insurance recommended over ULIP or Endowment?",
            "How does inflation affect my life cover?"
        ]

    elif any(k in q for k in ["question", "ask my advisor", "advisor consultation", "prepare"]):
        answer = (
            "### Top 6 Questions to Ask Your Insurance Advisor\n\n"
            "When attending your advisory session, bring these strategic questions:\n\n"
            "1. *'Based on my Net Needs gap of " + gap_val + ", what is the recommended tenure so the policy does not expire before my home loan or child's graduation?'*\n"
            "2. *'What is the insurer's 3-year average Claim Settlement Ratio (CSR) by number of claims and by benefit amount?'*\n"
            "3. *'Are there specific medical tests required for my age and chosen sum assured?'*\n"
            "4. *'Should I add a Critical Illness or Accidental Disability Rider, and does it come with a Waiver of Premium benefit?'*\n"
            "5. *'Is a regular pay, limited pay (e.g. pay till 60), or single pay structure more tax-efficient for my income bracket?'*\n"
            "6. *'Can I add the Married Women’s Property Act (MWPA) endorsement to ensure the claim proceeds are protected from creditors and go solely to my spouse/children?'*"
        )
        related = [
            "What are common exclusions and waiting periods?",
            "Why do I need this much cover?",
            "What is the difference between Term and ULIP?"
        ]

    elif any(k in q for k in ["inflation", "discounting", "present value"]):
        answer = (
            "### How Inflation & Discounting Impact Your Life Insurance\n\n"
            "A household expense of ₹60,000/month today will require ₹1,53,000/month in 20 years at a 5% inflation rate. Here is how our model handles this:\n\n"
            "- **Discounting / Present Value**: Rather than simply multiplying today's expenses by 20 or 25 years (which ignores the time value of money and future investment yields), we discount future cash outflows at a configurable discount rate.\n"
            "- **The Safety Buffer**: The lump-sum death benefit payout can be invested by your family in safe debt instruments to generate income that tracks future inflation.\n"
            "- **Increasing Cover Option**: Some term policies offer an annual 5% or 10% step-up in sum assured to naturally keep pace with inflation without repeated medical checkups."
        )
        related = [
            "Why do I need this much cover?",
            "What is Human Life Value (HLV) and why does it differ?",
            "What questions should I ask my insurance advisor?"
        ]

    else:
        # General intelligent advisory fallback
        answer = (
            f"### Insurance Mantra Advisory Guidance\n\n"
            f"Regarding your query on *'{req.question}'*:\n\n"
            f"In life insurance planning, the paramount principle is **protection adequacy first, wealth creation second**.\n\n"
            f"- Your currently identified additional coverage gap is **{gap_val}**.\n"
            f"- For this coverage size, a comprehensive **Pure Term Life policy** provides the highest capital security with the lowest strain on your monthly cash flow.\n"
            f"- If you are exploring wealth accumulation alongside insurance, consider separating investment (via low-cost mutual funds or PPF) from pure protection to avoid high mortality drag.\n\n"
            f"Would you like to explore how adjusting your policy tenure, sum assured, or retirement age influences these recommendations?"
        )
        related = [
            "Why do I need this much cover?",
            "What is the difference between total need and additional cover?",
            "What questions should I ask my insurance advisor?"
        ]

    disclaimer = (
        "Educational advisory provided by Insurance Mantra. This analysis is based on mathematical models and benchmark IRDAI filings. "
        "It does not constitute an official insurance solicitation or underwriting commitment."
    )
    
    return AdvisoryAnswerResponse(
        question=req.question,
        answer=answer,
        related_topics=related,
        disclaimer=disclaimer
    )
