const SITE_PASSWORD = "#B4r#12@@";

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function verifyPassword(password: string): Promise<boolean> {
  const hash = await hashPassword(password);
  const storedHash = process.env.NEXT_PUBLIC_SITE_PASSWORD_HASH;
  return hash === storedHash;
}

export function getSessionToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("bia_co_session");
}

export function setSessionToken(token: string): void {
  localStorage.setItem("bia_co_session", token);
}

export function clearSessionToken(): void {
  localStorage.removeItem("bia_co_session");
}

export async function login(password: string): Promise<boolean> {
  const isValid = await verifyPassword(password);
  if (isValid) {
    const token = await hashPassword(password + Date.now().toString());
    setSessionToken(token);
    return true;
  }
  return false;
}

export function logout(): void {
  clearSessionToken();
}

export function isAuthenticated(): boolean {
  return getSessionToken() !== null;
}
