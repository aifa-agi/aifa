// @/lib/utils/get-next-auth-url.ts

export function getNextAuthUrl() {
  if (
    process.env.NODE_ENV === "development" &&
    process.env.NEXT_PUBLIC_NEXTAUTH_DEV_MODE_URL
  ) {
    // Добавляем http:// если не указано
    const url = process.env.NEXT_PUBLIC_NEXTAUTH_DEV_MODE_URL;
    return url.startsWith("http") ? url : `http://${url}`;
  }
  // В остальных случаях используем production URL
  if (process.env.NEXT_PUBLIC_NEXTAUTH_URL) {
    return process.env.NEXT_PUBLIC_NEXTAUTH_URL;
  }
  throw new Error(
    "NEXT_PUBLIC_NEXTAUTH_URL is not defined in environment variables"
  );
}
