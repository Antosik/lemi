import { ICommand } from "../../interfaces/ICommand";
import { consts } from "../../localization";

import { generateCalcseasonText } from "./text";

module.exports = {
  name: "myclubcalcseason",
  description: "Количество игр, которое нужно выиграть участниками вашего клуба для достижения желаемого места в сезоне.",
  aliases: ["расчетс", "calcseason", "calcss"],
  usage: "calcseason/расчетс [место в топе] [игроков в группе (2-5)] [aram]",

  async execute(ctx, message, args) {
    if (!ctx.clubs) {
      throw new Error(consts.unexpectedError);
    }

    const top: number = Number(args[0]) || 1;
    const group_size: number = Number(args[1]) || 5;
    const mode: 0 | 1 = args[2] === "aram" ? 1 : 0;

    const [live_season, homeclub] = await Promise.all([ctx.clubs.getLiveSeason(), ctx.clubs.getHomeClub()]);
    if (live_season === undefined || live_season.isEnded()) {
      return message.channel.send(consts.noActiveSeason);
    }
    if (homeclub === undefined) {
      return message.channel.send(consts.clubNotSelected);
    }

    const { top: wanted, games_count, points_needed } = await homeclub.calculateSeason({ top, group_size, mode });
    if (!games_count) {
      return message.channel.send(consts.calcEnoughGames);
    }

    const result_message = generateCalcseasonText({ wanted, points_needed, games_count, group_size });
    return message.channel.send(result_message);
  }
} as ICommand;
