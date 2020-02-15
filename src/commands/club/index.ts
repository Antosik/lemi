import { ICommand } from "../../interfaces/ICommand";
import { consts } from "../../localization";

import { generateClubEmbed } from "./embed";

module.exports = {
  name: "myclub",
  description: "Информация о вашем клубе.",
  aliases: ["клуб", "club", "c"],
  usage: "club/клуб",

  async execute(ctx, message, args) {
    if (!ctx.clubs) {
      throw new Error(consts.unexpectedError);
    }

    const stage_index: number | undefined = Number(args[0]) || undefined;

    const live_season = await ctx.clubs.getLiveSeason();
    if (live_season === undefined || !live_season.isLive()) {
      return message.channel.send(consts.noActiveSeason);
    }

    const homeclub_season = await live_season.getClub();

    const stage = live_season.getStageByIndex(stage_index);
    const homeclub_stage = await stage?.getClubMe();

    const embed = generateClubEmbed({
      homeclub_season,
      homeclub_stage,
      stage_index: stage?.index
    });
    return message.channel.send(embed);
  }
} as ICommand;
