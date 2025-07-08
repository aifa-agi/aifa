export function extractSubFromJWT(token: string): string | null {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(
      Buffer.from(payload, "base64").toString("utf-8")
    );
    return decoded.sub || null;
  } catch {
    return null;
  }
}
