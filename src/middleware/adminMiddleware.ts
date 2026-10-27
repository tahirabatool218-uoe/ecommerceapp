import type { NextFunction, Request, Response } from "express";

const admin = (req: Request, res: Response, next: NextFunction): void => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({
      message: "Access denied. Admin only."
    });
  }
};

export default admin;
