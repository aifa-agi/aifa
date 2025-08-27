// @/app/config/user-roles.ts

export const ALL_ROLES: UserRole[] = [
  "guest",
  "admin",
  "editor",
  "authUser",
  "subscriber",
  "customer",
  "apiUser",
  "architect",
];

export type UserRole =
  | "guest"
  | "admin"
  | "editor"
  | "authUser"
  | "subscriber"
  | "customer"
  | "apiUser"
  | "architect";
