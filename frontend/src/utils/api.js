/**
 * Centralized API utility functions
 * Provides consistent error handling and response parsing
 */

/**
 * Makes an API request with consistent error handling
 * @param {string} url - API endpoint
 * @param {object} options - Fetch options
 * @returns {Promise<{data: any, error: string|null}>}
 */
export async function apiRequest(url, options = {}) {
  const token = localStorage.getItem('token');
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    }
  };

  try {
    const res = await fetch(url, { ...defaultOptions, ...options });
    
    // Try to parse JSON response
    let data;
    try {
      data = await res.json();
    } catch {
      // If not JSON, get text
      const text = await res.text();
      data = text ? { error: text } : {};
    }

    if (!res.ok) {
      const errorMsg = data.error || data.message || `Request failed (${res.status})`;
      return { data: null, error: errorMsg };
    }

    return { data, error: null };
  } catch (err) {
    console.error('API request error:', err);
    return { 
      data: null, 
      error: err.message || 'Network error. Please check your connection.' 
    };
  }
}

/**
 * Makes an authenticated API request
 */
export async function authenticatedRequest(url, options = {}) {
  const token = localStorage.getItem('token');
  if (!token) {
    return { data: null, error: 'Login required' };
  }
  return apiRequest(url, options);
}

/**
 * Shows success alert
 */
export function showSuccess(message) {
  alert(`✅ ${message}`);
}

/**
 * Shows error alert
 */
export function showError(message) {
  alert(`❌ ${message}`);
}

