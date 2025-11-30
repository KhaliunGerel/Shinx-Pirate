import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";

export const AuthController = {
  async register(req: Request, res: Response) {
    const { username } = req.body;
    const result = await AuthService.register(username);
    res.json(result);
  },

  async login(req: Request, res: Response) {
    const { username } = req.body;
    const result = await AuthService.login(username);
    res.json(result);
  },
};
