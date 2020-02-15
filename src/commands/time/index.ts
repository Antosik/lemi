

import { EStageArgs, isSeason, isStage } from "../../interfaces/IArgument";
import { ICommand } from "../../interfaces/ICommand";
import { consts } from "../../localization";

import { generateSeasonTime, generateStageTime } from "./text";

module.exports = {
  name: "time",
  description: "Оставшееся время до конца сезона/этапа.",
  aliases: ["время", "t"],
  usage: "time/время [season/stage]",

  async execute(ctx, message, args) {
    if (!ctx.clubs) {
      throw new Error(consts.unexpectedError);
    }

    let type: string = args[0] || EStageArgs.en;

    if (!isSeason(type) && !isStage(type)) {
      type = EStageArgs.en;
    }

    const live_season = await ctx.clubs.getLiveSeason();

    const result_text = isStage(type)
      ? generateStageTime(live_season?.current_stage)
      : generateSeasonTime(live_season);

    message.channel.send(result_text);
  }
} as ICommand;
