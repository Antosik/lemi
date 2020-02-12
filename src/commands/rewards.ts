import { format as formatDate } from "date-fns";
import { RichEmbed } from "discord.js";

import { ICommand } from "../interfaces/ICommand";

import { consts } from "../localization";
import { boldIF, capitalizeFirstLetter } from "../helpers/functions";

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
    const stages = live_season.stages.map((stage) => stage.id);

    const [rewards_season, rewards_stages] = await Promise.all([homeclub.getRewardsSeason(), homeclub.getRewardsStages()]);

    const now = formatDate(new Date(), "HH:mm:ss dd.MM.yyyy");
    const template = new RichEmbed()
      .setColor("#0099ff")
      .setTitle(`Награды клуба "${homeclub.name}"`)
      .setDescription(`Сезон "${live_season.title}".`)
      .setFooter(now);

    if (rewards_season) {
      template.addField(boldIF("Сезон", !live_season.isEnded()), `• ${capitalizeFirstLetter(rewards_season.reason)} - ${rewards_season.count} шт.`);
    }

    if (rewards_stages) {
      for (const [stage_id, stage_rewards] of rewards_stages.entries()) {
        const stage_index = stages.indexOf(stage_id);
        const stage = boldIF(`Этап ${stage_index + 1}`, live_season.getStageIdByIndex(stage_index + 1)?.is_live || false);
        const rewards = stage_rewards.map((reward) => `• ${capitalizeFirstLetter(reward.reason)} - ${reward.count} шт.`);
        template.addField(stage, rewards);
      }
    }

    return message.channel.send(template);
  }
} as ICommand;
