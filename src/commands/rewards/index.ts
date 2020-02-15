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

    const live_season = await ctx.clubs.getLiveSeason();
    if (live_season === undefined || !live_season.isLive()) {
      return message.channel.send(consts.noActiveSeason);
    }

    const homeclub = await live_season.getClub();

    const season_rewards = await live_season.getClubSeasonRewards();
    const stages_rewards = await live_season.getClubStagesRewards();

    const embed = generateRewardsEmbed({
      homeclub,
      season_rewards,
      stages_rewards
    });

    return message.channel.send(embed);
  }
} as ICommand;
