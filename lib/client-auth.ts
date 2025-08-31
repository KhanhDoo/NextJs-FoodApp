// lib/client-auth.ts
export const TOKEN_KEY = "access_token";

export function setToken(token: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function clearToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
}

// Function để decode JWT token và lấy thông tin user
export function getUserFromToken(): {
  id: string;
  role: "user" | "admin";
} | null {
  if (typeof window === "undefined") return null;

  const token = getToken();
  if (!token) return null;

  try {
    // JWT token có format: header.payload.signature
    const payload = token.split(".")[1];
    if (!payload) return null;

    // Decode base64 payload
    const decodedPayload = JSON.parse(atob(payload));
    return {
      id: decodedPayload.id,
      role: decodedPayload.role,
    };
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}
