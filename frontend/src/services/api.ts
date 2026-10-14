import {
  CustomerProfile,
  CalculationResult,
  ProductItem,
  ProductRecommendation,
  ScenarioCustomizationResponse,
  AdvisorProfile,
  ConsultationBookingRequest,
  ConsultationBookingResponse,
  AdvisoryQuestionRequest,
  AdvisoryAnswerResponse
} from '../types';

const BASE_URL = '/api';

export async function fetchHealth() {
  const res = await fetch(`${BASE_URL}/health`);
  if (!res.ok) throw new Error('API health check failed');
  return res.json();
}

export async function fetchSampleProfile(): Promise<CustomerProfile> {
  const res = await fetch(`${BASE_URL}/sample-profile`);
  if (!res.ok) throw new Error('Failed to load sample profile');
  return res.json();
}

export async function calculateNeeds(profile: CustomerProfile): Promise<CalculationResult> {
  const res = await fetch(`${BASE_URL}/calculate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile)
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ detail: 'Calculation failed' }));
    throw new Error(errorData.detail || 'Calculation failed');
  }
  return res.json();
}

export async function fetchProducts(): Promise<ProductItem[]> {
  const res = await fetch(`${BASE_URL}/products`);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export async function fetchRecommendations(
  profile: CustomerProfile,
  calculatedGap: number
): Promise<ProductRecommendation[]> {
  const res = await fetch(`${BASE_URL}/recommend`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ profile, calculated_gap: calculatedGap })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Recommendation failed' }));
    throw new Error(err.detail || 'Recommendation failed');
  }
  return res.json();
}

export async function customizeScenario(
  profile: CustomerProfile,
  productId: string,
  customSumAssured: number,
  customTenure: number,
  customBudget?: number
): Promise<ScenarioCustomizationResponse> {
  const res = await fetch(`${BASE_URL}/customize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      profile,
      selected_product_id: productId,
      custom_sum_assured: customSumAssured,
      custom_tenure: customTenure,
      custom_premium_budget: customBudget
    })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Customization failed' }));
    throw new Error(err.detail || 'Customization failed');
  }
  return res.json();
}

export async function fetchAdvisors(): Promise<AdvisorProfile[]> {
  const res = await fetch(`${BASE_URL}/advisors`);
  if (!res.ok) throw new Error('Failed to load advisors');
  return res.json();
}

export async function bookConsultation(
  req: ConsultationBookingRequest
): Promise<ConsultationBookingResponse> {
  const res = await fetch(`${BASE_URL}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Booking request failed' }));
    throw new Error(err.detail || 'Booking failed');
  }
  return res.json();
}

export async function askAdvisoryAssistant(
  req: AdvisoryQuestionRequest
): Promise<AdvisoryAnswerResponse> {
  const res = await fetch(`${BASE_URL}/advisory-chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Assistant request failed' }));
    throw new Error(err.detail || 'Assistant request failed');
  }
  return res.json();
}
