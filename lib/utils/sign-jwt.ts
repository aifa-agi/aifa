// @/lib/utils/sign-jwt.ts
import { sign } from "jsonwebtoken";

export function signApiUserJwt(payload: object) {
  return sign(payload, process.env.NEXTAUTH_SECRET!, {
    expiresIn: "4h",
    algorithm: "HS256",
  });
}
