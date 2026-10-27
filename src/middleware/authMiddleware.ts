import type { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import type { AuthUser } from "../types/express";

const protect = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        message: "Not authorized, token required"
      });
      return;
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload & AuthUser;

    req.user = decoded;

    next();
  } catch (error) {
    res.status(401).json({
      message: "Not authorized, invalid or expired token"
    });
  }
};

export default protect;
