import { Router } from "express";
import { asyncHandler } from "../middleware/errorHandler.js";
import { playerInputSchema } from "../validation/schemas.js";
import { upsertPlayer } from "../services/playerService.js";

export const playersRouter = Router();

playersRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const input = playerInputSchema.parse(req.body);
    const player = await upsertPlayer(input.nickname);
    res.json(player);
  })
);
