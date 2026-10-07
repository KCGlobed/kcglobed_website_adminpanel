import { BASE_URL } from "../utils/constants";
import { getToken } from "../utils/tokenStorage";
import tryRefreshToken from "./tokenService";

// The API reports failures in a few different shapes, e.g.
//   { message: "slug already exist" }
//   { detail: "Not found." }
//   { image: ["File extension “webp” is not allowed."] }
// Dig out the readable text instead of falling back to a generic message.
function extractErrorMessage(errorData: unknown): string {
  if (!errorData) return "";

  if (typeof errorData === "string") return errorData.trim();

  if (Array.isArray(errorData)) {
    return errorData.map(extractErrorMessage).filter(Boolean).join(" ");
  }

  if (typeof errorData === "object") {
    const record = errorData as Record<string, unknown>;

    // Prefer the keys used for a single top level message
    for (const key of ["message", "detail", "error"]) {
      const value = extractErrorMessage(record[key]);
      if (value) return value;
    }

    // Otherwise collect field level errors such as { image: [...] }
    return Object.values(record).map(extractErrorMessage).filter(Boolean).join(" ");
  }

  return "";
}

export async function apiRequest<T>(
  url: string,
  method: "GET" | "POST" | "PUT" | "DELETE",
  body?: any,
  retry: boolean = true
): Promise<T> {
  const token = getToken();

  const headers: HeadersInit = {
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  // Set Content-Type only if body is not FormData
  if (!(body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(BASE_URL + url, {
    method,
    headers,
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
  });

  // Token expired: attempt refresh and retry
  if (response.status === 401 && retry) {
    const refreshed = await tryRefreshToken();

    if (refreshed) {
      // Retry request once with the new token
      return apiRequest<T>(url, method, body, false);
    }
    else{
      console.error("Token refresh failed, please log in again.");
      localStorage.clear()
    }
  }

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      throw new Error("Unexpected API error");
    }
    throw new Error(extractErrorMessage(errorData) || "API error");
  }

  // Handle cases where response is not JSON (e.g., file blob)
  const contentType = response.headers.get("Content-Type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }

  // Return full response (for non-JSON types)
  return response as any;
}
