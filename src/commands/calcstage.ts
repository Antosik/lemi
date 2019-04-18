import { ICommand } from "../interfaces/ICommand";
import format, { consts } from "../localization";

module.exports = {
  name: "myclubcalc",
  description: "Количество игр, которые нужно выиграть участниками вашего клуба для достижения желаего места в этапе.",
  aliases: ["расчет", "calcstage", "расчетэ", "calcst"],
  usage: "calcstage/расчет [место в топе] [игроков в группе (2-5)] [aram]",
  async execute(ctx, message, args) {
    const top = Number(args[0]) || 1;
    const group_size = Number(args[1]) || 5;
    const mode = args[2] === "aram" ? 1 : 0;

    const [live_season, homeclub] = await Promise.all([ctx.clubs.getLiveSeason(), ctx.clubs.getHomeClub()]);
    if (live_season.isEnded()) {
      return message.channel.send(consts.noActiveStage);
    }

    const { current_stage: { id: stage_id } } = live_season;
    const { top: wanted, games_count, points_needed } = await homeclub.calculateStage(stage_id, { top, group_size, mode });

    if (!games_count) {
      return message.channel.send(consts.calcEnoughGames);
    }
    if (!wanted) {
      const result_not = `Ваш клуб не участвует в этапе.\nЧтобы участвовать, нужно заработать ${format("point", points_needed)}, выиграв **${format("gameToPlay", games_count)}** (составом из ${format("player", group_size)})`;
      return message.channel.send(result_not);
    }

    const result = `Чтобы достигнуть желаемого ${wanted} места в этапе, нужно заработать ${format("point", points_needed)}, выиграв **${format("gameToPlay", games_count)}** (составом из ${format("player", group_size)})`;
    return message.channel.send(result);
  }
} as ICommand;
