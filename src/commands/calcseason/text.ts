import format from "../../localization";

export function generateCalcseasonText(
  { wanted, games_count, points_needed, group_size }: { wanted: number, games_count: number, points_needed: number, group_size: number }
): string {
  return `Чтобы достигнуть желаемого ${wanted} места в сезоне, нужно заработать ${format("point", points_needed)}, выиграв **${format("gameToPlay", games_count)}** (составом из ${format("player", group_size)})`;
}
