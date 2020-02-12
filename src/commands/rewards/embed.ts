import { format as formatDate } from "date-fns";
import { RichEmbed } from "discord.js";

import { IRewardResult } from "../../interfaces/IReward";
import LiveSeason from "../../models/LiveSeason";
import HomeClub from "../../models/HomeClub";

import { boldIF, capitalizeFirstLetter } from "../../helpers/functions";

export function generateRewardsEmbed(
  { homeclub, stages_ids, live_season, rewards_season, rewards_stages }:
  { homeclub: HomeClub, stages_ids: number[], live_season: LiveSeason, rewards_season: IRewardResult | undefined, rewards_stages: Map<number, IRewardResult[]> | undefined }
): RichEmbed {
  const now = formatDate(new Date(), "HH:mm:ss dd.MM.yyyy");
  const result = new RichEmbed()
    .setColor("#0099ff")
    .setTitle(`Награды клуба "${homeclub.name}"`)
    .setDescription(`Сезон "${live_season.title}".`)
    .setFooter(now);

  if (rewards_season) {
    result.addField(boldIF("Сезон", !live_season.isEnded()), `• ${capitalizeFirstLetter(rewards_season.reason)} - ${rewards_season.count} шт.`);
  }

  if (rewards_stages) {
    for (const [stage_id, stage_rewards] of rewards_stages.entries()) {
      const stage_index = stages_ids.indexOf(stage_id);
      const stage = boldIF(`Этап ${stage_index + 1}`, live_season.getStageIdByIndex(stage_index + 1)?.is_live || false);
      const rewards = stage_rewards.map((reward) => `• ${capitalizeFirstLetter(reward.reason)} - ${reward.count} шт.`);
      result.addField(stage, rewards);
    }
  }

  return result;
}