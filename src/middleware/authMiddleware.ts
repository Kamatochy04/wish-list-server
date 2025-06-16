import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import redisClient from "../config/redis";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({ error: "No token provided" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: number;
    };
    const storedToken = await redisClient.get(`session:${decoded.userId}`);
    if (storedToken !== token) {
      res.status(401).json({ error: "Invalid token" });
      return;
    }

    req.user = { id: decoded.userId };
    next();
  } catch (error) {
    res.status(401).json({ error: "Unauthorized" });
  }
};

declare global {
  namespace Express {
    interface Request {
      user?: { id: number };
    }
  }
}
