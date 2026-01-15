/**
 * Centralized API utility functions
 * Provides consistent error handling and response parsing
 */

/**
 * Gets the API base URL based on the current environment
 * @returns {string} API base URL
 */
export function getApiBaseUrl() {
  // In development, use relative URL (Vite proxy handles it)
  if (import.meta.env.DEV) {
    return '';
  }
  
  // In production, check if we're on the same domain or need absolute URL
  // If the current origin matches the expected domain, use relative URL
  // Otherwise, you might need to set VITE_API_URL environment variable
  const apiUrl = import.meta.env.VITE_API_URL;
  if (apiUrl) {
    return apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
  }
  
  // Default: use relative URL (works when frontend and backend are on same domain)
  return '';
}

/**
 * Makes an API request with consistent error handling
 * @param {string} url - API endpoint (can be relative or absolute)
 * @param {object} options - Fetch options
 * @returns {Promise<{data: any, error: string|null}>}
 */
export async function apiRequest(url, options = {}) {
  const token = localStorage.getItem('token');
  
  // Ensure URL is absolute if needed
  const baseUrl = getApiBaseUrl();
  const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    }
  };

  try {
    const res = await fetch(fullUrl, { ...defaultOptions, ...options });
    
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
    // Provide more specific error messages
    let errorMessage = 'Network error. Please check your connection.';
    if (err.message === 'Failed to fetch') {
      errorMessage = 'Unable to connect to server. Please check your internet connection and try again.';
    } else if (err.message) {
      errorMessage = err.message;
    }
    return { 
      data: null, 
      error: errorMessage
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

