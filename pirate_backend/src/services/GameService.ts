import { GameRunModel } from "../models/GameRunModel";
import { UserStatModel } from "../models/UserStatsModel";

export const GameService = {
  async startGame(userId: string, level: number) {
    if (!level || level < 1 || level > 100) {
      throw new Error("Invalid level");
    }

    const run = await GameRunModel.create(userId, level);

    return {
      runId: run.id,
      level,
      startedAt: run.created_at,
    };
  },

  async finishGame(
    userId: string,
    runId: string,
    game_coin_earned: number,
    record: number
  ) {
    const run = await GameRunModel.findById(runId);

    if (!run || run.user_id !== userId) throw new Error("Invalid game run");
    if (run.is_finished) throw new Error("Game already finished");

    await GameRunModel.finish(runId, game_coin_earned, record);

    // update player personal record
    await UserStatModel.updateStats(userId, game_coin_earned, record);
    //Give daily reward
    const dailyReward = 0;

    return {
      dailyReward,
    };
  },
};
