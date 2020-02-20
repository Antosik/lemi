import { ICommand } from "../../interfaces/ICommand";
import { consts } from "../../localization";

import { generateCalcStagePart, generateCalcStageNotPart } from "./text";

module.exports = {
  name: "myclubcalc",
  description: "Количество игр, которое нужно выиграть участниками вашего клуба для достижения желаемого места в этапе.",
  aliases: ["расчет", "calcstage", "расчетэ", "calcst"],
  usage: "calcstage/расчет [место в топе] [игроков в группе (2-5)] [aram]",

  async execute(ctx, message, args) {
    if (!ctx.clubs) {
      throw new Error(consts.unexpectedError);
    }

    const top: number = Number(args[0]) || 1;
    const group_size: number = Number(args[1]) || 5;
    const isARAM: boolean = args[2] === "aram";

    const live_season = await ctx.clubs.getLiveSeason();
    if (live_season === undefined || !live_season.isLive() || live_season.current_stage === undefined) {
      return message.channel.send(consts.noActiveStage);
    }

    const live_stage = live_season.current_stage;
    const { top: wanted_place, games_count, points_needed } = await live_stage.toGetTopN(top, { group_size, isARAM });

    if (!games_count) {
      return message.channel.send(consts.calcEnoughGames);
    }

    const result_message = wanted_place ?
      generateCalcStagePart({ wanted_place, games_count, group_size, points_needed }) :
      generateCalcStageNotPart({ points_needed, games_count, group_size });

    return message.channel.send(result_message);
  }
} as ICommand;
