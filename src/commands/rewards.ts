import { format as formatDate } from "date-fns";
import { RichEmbed } from "discord.js";

import { ICommand } from "../interfaces/ICommand";

import { boldIF, capitalizeFirstLetter } from "../helpers/functions";

module.exports = {
  name: "rewards",
  description: "Награды, полученные в ходе сезона",
  aliases: ["награды", "r"],
  usage: "rewards/награды",

  async execute(ctx, message, args) {
    const [live_season, homeclub] = await Promise.all([ctx.clubs.getLiveSeason(), ctx.clubs.getHomeClub()]);
    const stages = live_season.stages.map((stage) => stage.id);

    const rewards_season = await homeclub.getRewardsSeason();
    const rewards_stages = await homeclub.getRewardsStages();

    const now = formatDate(new Date(), "HH:mm:ss dd.MM.yyyy");
    const template = new RichEmbed()
      .setColor("#0099ff")
      .setURL(`https://clubs.ru.leagueoflegends.com/progress`)
      .setTitle(`Награды клуба "${homeclub.name}"`)
      .setDescription(`Сезон "${live_season.title}".`)
      .setFooter(now);

    template.addField(boldIF("Сезон", !live_season.isEnded()), `• ${capitalizeFirstLetter(rewards_season.reason)} - ${rewards_season.count} шт.`);
    for (const [stage_id, stage_rewards] of rewards_stages.entries()) {
      const stage_index = stages.indexOf(stage_id);
      const stage = boldIF(`Этап ${stage_index + 1}`, live_season.getStageIdByIndex(stage_index + 1).is_live);
      const rewards = stage_rewards.map((reward) => `• ${capitalizeFirstLetter(reward.reason)} - ${reward.count} шт.`);
      template.addField(stage, rewards);
    }

    return message.channel.send(template);
  }
} as ICommand;
