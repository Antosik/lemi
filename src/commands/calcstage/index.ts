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
    const mode: 0 | 1 = args[2] === "aram" ? 1 : 0;

    const [live_season, homeclub] = await Promise.all([ctx.clubs.getLiveSeason(), ctx.clubs.getHomeClub()]);
    if (live_season === undefined || live_season.isEnded() || live_season.current_stage === undefined) {
      return message.channel.send(consts.noActiveStage);
    }
    if (homeclub === undefined) {
      return message.channel.send(consts.clubNotSelected);
    }

    const { id: stage_id } = live_season.current_stage;
    const { top: wanted_place, games_count, points_needed } = await homeclub.calculateStage(stage_id, { top, group_size, mode });

    if (!games_count) {
      return message.channel.send(consts.calcEnoughGames);
    }

    const result_message = wanted_place ?
      generateCalcStagePart({ wanted_place, games_count, group_size, points_needed }) :
      generateCalcStageNotPart({ points_needed, games_count, group_size });

    return message.channel.send(result_message);
  }
} as ICommand;
