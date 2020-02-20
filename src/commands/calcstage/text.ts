import format from "../../localization";

export function generateCalcStageNotPart(
  { points_needed, games_count, group_size }: { points_needed: number, games_count: number, group_size: number }
): string {
  return `Ваш клуб не участвует в этапе.
Чтобы участвовать, нужно заработать ${format("point", points_needed)}, выиграв **${format("gameToPlay", games_count)}** (составом из ${format("player", group_size)})`;
}

export function generateCalcStagePart(
  { wanted_place, points_needed, games_count, group_size }: { wanted_place: number, points_needed: number, games_count: number, group_size: number }
): string {
  return `Чтобы достигнуть желаемого ${wanted_place} места в этапе, нужно заработать ${format("point", points_needed)}, выиграв **${format("gameToPlay", games_count)}** (составом из ${format("player", group_size)})`;
}