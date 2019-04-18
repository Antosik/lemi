import { ICommand } from "../interfaces/ICommand";
import format, { consts } from "../localization";

module.exports = {
  name: "myclubcalcseason",
  description: "Количество игр, которые нужно выиграть участниками вашего клуба для достижения желаего места в сезоне.",
  aliases: ["расчетс", "calcseason", "calcss"],
  usage: "calcseason/расчетс [место в топе] [игроков в группе (2-5)] [aram]",

  async execute(ctx, message, args) {
    const top: number = Number(args[0]) || 1;
    const group_size: number = Number(args[1]) || 5;
    const mode: 0 | 1 = args[2] === "aram" ? 1 : 0;

    const [live_season, homeclub] = await Promise.all([ctx.clubs.getLiveSeason(), ctx.clubs.getHomeClub()]);
    if (live_season.isEnded()) {
      return message.channel.send(consts.noActiveSeason);
    }

    const { top: wanted, games_count, points_needed } = await homeclub.calculateSeason({ top, group_size, mode });
    if (!games_count) {
      return message.channel.send(consts.calcEnoughGames);
    }

    const result = `Чтобы достигнуть желаемого ${wanted} места в сезоне, нужно заработать ${format("point", points_needed)}, выиграв **${format("gameToPlay", games_count)}** (составом из ${format("player", group_size)})`;
    return message.channel.send(result);
  }
} as ICommand;
