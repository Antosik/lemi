import { ICommand } from "../../interfaces/ICommand";
import { consts } from "../../localization";

import { generateSeasonEmbed } from "./embed";

module.exports = {
  name: "seasoninfo",
  description: "Общая информация о текущем сезоне.",
  aliases: ["сезон", "season", "ss"],
  usage: "season/сезон",

  async execute(ctx, message) {
    if (!ctx.clubs) {
      throw new Error(consts.unexpectedError);
    }

    const live_season = await ctx.clubs.getLiveSeason();
    if (live_season === undefined || !live_season.isLive()) {
      return message.channel.send(consts.noActiveSeason);
    }

    const embed = generateSeasonEmbed({
      live_season,
      stages: live_season.stages
    });

    return message.channel.send(embed);
  }
} as ICommand;
