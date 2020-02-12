import { ICommand } from "../../interfaces/ICommand";
import { consts } from "../../localization";

import { generateRewardsEmbed } from "./embed";

module.exports = {
  name: "rewards",
  description: "Награды, полученные в ходе сезона",
  aliases: ["награды", "r"],
  usage: "rewards/награды",

  async execute(ctx, message) {
    if (!ctx.clubs) {
      throw new Error(consts.unexpectedError);
    }

    const [live_season, homeclub] = await Promise.all([ctx.clubs.getLiveSeason(), ctx.clubs.getHomeClub()]);
    if (live_season === undefined) {
      return message.channel.send(consts.noActiveSeason);
    }
    if (homeclub === undefined) {
      return message.channel.send(consts.clubNotSelected);
    }

    const stages_ids = live_season.stages.map((stage) => stage.id);
    const [rewards_season, rewards_stages] = await Promise.all([homeclub.getRewardsSeason(), homeclub.getRewardsStages()]);

    const embed = generateRewardsEmbed({
      homeclub,
      live_season,
      stages_ids,
      rewards_season,
      rewards_stages
    });

    return message.channel.send(embed);
  }
} as ICommand;
