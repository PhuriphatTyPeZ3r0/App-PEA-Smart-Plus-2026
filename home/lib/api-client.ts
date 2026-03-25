/**
 * Centralized API client for PEA Smart Plus.
 * This utility wraps the native fetch API to provide "Interceptor" like functionality,
 * such as automatic injection of Authorization headers and centralized error handling.
 */

const AUTH_TOKEN_KEY = "NEXT_PUBLIC_OUTAGE_AUTH_TOKEN";

export interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
}

/**
 * Main fetch wrapper with authentication.
 */
export async function apiClient<T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { params, headers, ...restOptions } = options;

  // 1. Construct URL with parameters if needed
  let url = endpoint;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, String(value));
    });
    const queryString = searchParams.toString();
    url += (url.includes("?") ? "&" : "?") + queryString;
  }

  // 2. Prepare Headers (Automatic Token Injection)
  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // Get token from localStorage (accessToken) or process.env (fallback)
  let token = undefined;
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('accessToken');
  }
  
  if (!token) {
    token = process.env.NEXT_PUBLIC_OUTAGE_AUTH_TOKEN;
  }

  if (token) {
    defaultHeaders["Authorization"] = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
  }

  const mergedHeaders = {
    ...defaultHeaders,
    ...headers,
  } as Record<string, string>;

  // 3. Perform Fetch
  try {
    const response = await fetch(url, {
      ...restOptions,
      headers: mergedHeaders,
    });

    // 4. Handle HTTP Errors (Defensive Programming)
    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = errorText;
      }
      
      console.error(`API Error [${response.status}] ${url}:`, errorData);
      throw {
        status: response.status,
        message: errorData?.message || `Server returned status ${response.status}`,
        data: errorData,
      };
    }

    // 5. Check Content-Type for JSON
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return (await response.json()) as T;
    }

    return (await response.text()) as any;
  } catch (error: any) {
    if (error.status) throw error; // Re-throw structured API errors
    
    console.error(`Network Error ${url}:`, error);
    throw {
      status: 0,
      message: error.message || "Network request failed",
      data: error,
    };
  }
}

/**
 * Convenience methods for HTTP verbs
 */
export const api = {
  get: <T>(url: string, options?: RequestOptions) => 
    apiClient<T>(url, { ...options, method: 'GET' }),
  
  post: <T>(url: string, body?: any, options?: RequestOptions) => 
    apiClient<T>(url, { ...options, method: 'POST', body: body ? JSON.stringify(body) : undefined }),
  
  put: <T>(url: string, body?: any, options?: RequestOptions) => 
    apiClient<T>(url, { ...options, method: 'PUT', body: body ? JSON.stringify(body) : undefined }),
  
  delete: <T>(url: string, options?: RequestOptions) => 
    apiClient<T>(url, { ...options, method: 'DELETE' }),
};
