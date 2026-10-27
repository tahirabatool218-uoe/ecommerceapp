import "express-serve-static-core";

export type UserRole = "user" | "admin";

export interface AuthUser {
  id: string;
  role: UserRole;
}

declare module "express-serve-static-core" {
  interface Request {
    user?: AuthUser;
  }
}
