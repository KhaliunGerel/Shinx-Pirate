import { Request, Response } from "express";
import { GameService } from "../services/GameService";

export const DungeonController = {
  async startGame(req: Request, res: Response) {
    const userId = (req as any).userId;
    const { level } = req.body;

    const run = await GameService.startGame(userId, level);
    res.json(run);
  },

  async finishGame(req: Request, res: Response) {
    const userId = (req as any).userId;

    const { gameCoinsEarned, record } = req.body;

    const run = await GameService.startGame(userId, 1);

    const result = await GameService.finishGame(
      userId,
      run.runId,
      gameCoinsEarned,
      record
    ).catch(console.log);

    res.json(result);
  },
};
