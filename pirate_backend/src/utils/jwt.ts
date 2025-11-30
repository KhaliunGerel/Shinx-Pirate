import jwt from "jsonwebtoken";
import { config } from "../config/env";

export function signToken(userId: string) {
  return jwt.sign({ userId }, config.JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string) {
  return jwt.verify(token, config.JWT_SECRET);
}
