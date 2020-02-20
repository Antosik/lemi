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
    const isARAM: boolean = args[2] === "aram";

    const live_season = await ctx.clubs.getLiveSeason();
    if (live_season === undefined || !live_season.isLive()) {
      return message.channel.send(consts.noActiveSeason);
    }

    const { games_count, points_needed } = await live_season.toGetTopN(top, { group_size, isARAM });
    if (!games_count) {
      return message.channel.send(consts.calcEnoughGames);
    }

    const result_message = generateCalcseasonText({ wanted: top, points_needed, games_count, group_size });
    return message.channel.send(result_message);
  }
} as ICommand;
