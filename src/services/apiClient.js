// AquaGuard API Client
// Designed for seamless transition from Local Simulated Mode to AWS Cloud API (API Gateway + Lambda)
//
// ENVIRONMENT CONFIGURATION:
// - VITE_USE_AWS_API: 'true' | 'false' (defaults to false for local prototype demo)
// - VITE_AWS_API_BASE_URL: e.g. https://xyz123.execute-api.us-east-1.amazonaws.com/prod
// - VITE_AWS_API_KEY: Optional API Gateway key (placeholder only; NEVER commit secrets)

const USE_AWS_API = import.meta.env.VITE_USE_AWS_API === 'true';
const BASE_URL = import.meta.env.VITE_AWS_API_BASE_URL || 'https://api-placeholder.aquaguard.aws/v1';
const API_KEY = import.meta.env.VITE_AWS_API_KEY || '';

/**
 * Common request wrapper with AWS-ready authorization headers.
 * In local prototype mode, this is bypassed in favor of local simulated data in waterDataService.js.
 */
export async function apiRequest(endpoint, options = {}) {
  if (!USE_AWS_API) {
    throw new Error('Local simulated mode is active. AWS API calls are redirected to waterDataService.js');
  }

  const url = `${BASE_URL.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(API_KEY ? { 'x-api-key': API_KEY } : {}),
    ...(options.headers || {})
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`AWS API error [${response.status}]: ${errorBody || response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`[AquaGuard API Client] Request failed for ${endpoint}:`, error);
    throw error;
  }
}

export const isAwsIntegrationActive = () => USE_AWS_API;
export const getApiBaseUrl = () => BASE_URL;
