# LifeWise AI — Intelligent Life Insurance Needs Finder & Digital Advisory Platform

> **AI Frontier Challenge 2026 — BFSI Track**  
> Developed by Team **Telugu Hackers**

---

## 🌟 Executive Summary

Life insurance buyers often face significant hurdles: confusing actuarial terminology, arbitrary rules-of-thumb (e.g. simply multiplying income by 10), opaque product comparisons, and aggressive marketing calls.

**LifeWise AI** is an intelligent, transparent financial-technology platform built to solve these challenges. It guides customers through a structured four-stage advisory journey:
1. **Stage 1 — Customer Financial Assessment:** Collects demographic data, household expenses, outstanding debt, earmarked protection assets, and dynamic milestone goals.
2. **Stage 2 — Financial Needs Calculation Engine:** Implements a mathematically sound, documented **Net Needs Approach** with a configurable real discount rate, floor at zero, and side-by-side **Human Life Value (HLV)** comparison.
3. **Stage 3 — Algorithmic Product Recommendation & Customization:** Ranks suitable product categories (Term Life, Whole Life, Endowment, ULIPs) using deterministic eligibility constraints, and provides real-time scenario sliders for custom sum assured, tenure, and premium budget recalculation.
4. **Stage 4 — Digital Advisory & Consultation Booking:** Features a context-aware AI assistant that answers questions using the customer's exact figures, paired with a simulated 1-on-1 advisor scheduler backed by persistent database storage.

---

## 🏗️ Technical Architecture

### 1. Frontend
- **Framework:** React 19 + TypeScript + Vite 8
- **Styling:** Vanilla Tailwind CSS with custom BFSI theme (Midnight Navy `#0A192F`, Royal Blue `#2563EB`, Turquoise `#0D9488`, Mint `#10B981`)
- **Icons & Delight:** Lucide React, Canvas Confetti
- **Typography:** Google Font *Plus Jakarta Sans*

### 2. Backend
- **Framework:** Python 3.14 + FastAPI + Uvicorn
- **Validation:** Pydantic v2 schemas with strict cross-field validation
- **Calculation Modules:**
  - `services/calculator.py`: Net Needs Approach & Human Life Value (HLV)
  - `services/recommender.py`: Product catalog, deterministic scoring & scenario customization
  - `services/advisory.py`: Context-aware advisory assistant with dynamic customer numbers
  - `services/booking_service.py`: Advisor profiles and appointment persistence

### 3. Database
- **Engine:** SQLite (`lifewise.db`) via SQLAlchemy ORM (with direct migration path to PostgreSQL)
- **Entities:** `ConsultationBooking` with unique reference codes (`LW-YYYYMM-XXXXXX`)

---

## 📐 Documented Financial Methodologies

### 1. Primary Method: Net Needs Approach

$$\text{Gross Protection Resources Required } (G) = L + PV(\text{Living Support}, n, r) + \sum_{i} PV(\text{Goal}_i, t_i, r) + O$$

Where:
- $L$ = Outstanding liabilities (loans, mortgages)
- $PV(\text{Living Support})$ = Discounted annuity of annual household expenses over $n$ support years at real discount rate $r$:
  $$PV = \text{Expenses} \times \frac{1 - (1 + r)^{-n}}{r}$$
- $PV(\text{Goal}_i)$ = Present value of future milestone goal $i$ due in $t_i$ years:
  $$PV_i = \frac{\text{Amount}_i}{(1 + r)^{t_i}}$$
- $O$ = Other obligations (emergency reserve, medical buffer)

$$\text{Estimated Additional Life Cover } (C) = \max\left(0, G - (\text{Existing Life Insurance} + \text{Dedicated Family Assets})\right)$$

> **Mathematical Safeguard:** Existing insurance and earmarked assets are subtracted once to eliminate double-charging, and a floor of zero is enforced.

### 2. Alternative Method: Human Life Value (HLV)

$$\text{HLV Gross} = (\text{Gross Income} \times (1 - \text{Personal Consumption } \%)) \times \frac{1 - (1 + r)^{-\text{Working Years}}}{r}$$

$$\text{HLV Additional Cover} = \max(0, \text{HLV Gross} - \text{Existing Cover \& Resources})$$

---

## 🚀 Quickstart & Setup Instructions

### Prerequisites
- Python 3.10+ (tested on Python 3.14)
- Node.js 18+ (tested on Node.js 24)

### 1. Clone & Enter Directory
```bash
git clone <repo-url>
cd "telugu hackers"
```

### 2. Start Backend API
```bash
# In first terminal:
cd backend
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```
- API Health Check: `http://127.0.0.1:8000/api/health`
- Swagger Interactive Docs: `http://127.0.0.1:8000/docs`

### 3. Start Frontend UI
```bash
# In second terminal:
cd frontend
npm install
npm run dev
```
- Access web application: `http://localhost:5173/`

---

## 🧪 Automated Test Suite

LifeWise AI includes 10 automated unit and integration tests covering:
1. Customer with dependents, liabilities, goals, and no existing cover
2. Customer with existing cover and dedicated assets deducted accurately
3. Customer whose resources exceed need (gap = 0 floor)
4. Customer with zero or low income
5. Invalid negative and inconsistent inputs rejected
6. Customer with tight premium budget
7. Customer exceeding product eligibility limits (age/tenure)
8. Interactive policy tenure and coverage scenario changes
9. Missing or optional defaults handled gracefully
10. Booking validation, slot collision prevention, and database storage

Run tests:
```bash
python -m pytest backend/tests/test_calculations.py -v
```

Output:
```text
============================= test session starts =============================
backend/tests/test_calculations.py::test_case_1_dependents_liabilities_goals_no_existing_cover PASSED [ 10%]
backend/tests/test_calculations.py::test_case_2_existing_cover_and_resources_deducted_once PASSED [ 20%]
backend/tests/test_calculations.py::test_case_3_resources_exceed_need_floor_of_zero PASSED [ 30%]
backend/tests/test_calculations.py::test_case_4_zero_or_low_income PASSED [ 40%]
backend/tests/test_calculations.py::test_case_5_invalid_negative_and_inconsistent_inputs PASSED [ 50%]
backend/tests/test_calculations.py::test_case_6_tight_premium_budget PASSED [ 60%]
backend/tests/test_calculations.py::test_case_7_ineligible_age_handling PASSED [ 70%]
backend/tests/test_calculations.py::test_case_8_scenario_customization PASSED [ 80%]
backend/tests/test_calculations.py::test_case_9_optional_defaults PASSED [ 90%]
backend/tests/test_calculations.py::test_case_10_booking_workflow_and_validation PASSED [100%]
============================== 10 passed in 0.43s ==============================
```

---

## 🛡️ Privacy, Security & Ethical Disclaimers

- **Zero PII Over-collection:** No government IDs (Aadhaar/PAN), passwords, or payment cards are requested or stored.
- **Actuarial Honesty:** All premium figures are clearly labeled as illustrative benchmark estimates based on IRDAI public filing tables.
- **Educational Prototype:** Built strictly as a decision-support and educational tool for the **AI Frontier Challenge 2026 — BFSI Track**. Not a licensed insurance intermediary.

---

**Developed with ❤️ by Telugu Hackers**
