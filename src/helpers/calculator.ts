import { consts } from "../localization";

export interface IPointsCalculatorParams {
  group_size?: number;
  isARAM?: boolean;
}

export function pointsCalculator(current_points: number, wanted_points: number, params: IPointsCalculatorParams): { points_needed: number, games_count: number } {
  const { group_size, isARAM } = { group_size: 5, isARAM: false, ...params };

  if (group_size < 2 || group_size > 5) {
    throw new Error(consts.invalidPlayerCount);
  }

  const points_per_game = !isARAM ? group_size * group_size * 10 : 5 * (group_size - 1) * group_size;

  if (wanted_points <= current_points) {
    return { games_count: 0, points_needed: 0 };
  }

  const points_needed = wanted_points - current_points;
  const games_count = Math.ceil(points_needed / points_per_game);

  return { games_count, points_needed };
}