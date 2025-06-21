// @/app/@left/(_public)/(_AUTH-FRACTAL)/(auth)/(_service)/(_actions)/guest-id.ts

const GUEST_ID_KEY = "guestId";

export function getGuestId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(GUEST_ID_KEY);
}

export function setGuestId(id: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(GUEST_ID_KEY, id);
}
