import { format as formatDate } from "date-fns";
import { RichEmbed } from "discord.js";

import { IParticipatingClubResponse } from "../../clubs-api/interfaces/IClub";

import { IStageRewardEntity, ISeasonRewardEntity } from "../../interfaces/IReward";
import { boldIF, capitalizeFirstLetter } from "../../helpers/functions";

export function generateRewardsEmbed(
  { homeclub, season_rewards, stages_rewards }:
  { homeclub: IParticipatingClubResponse, season_rewards: ISeasonRewardEntity, stages_rewards: IStageRewardEntity[] }
): RichEmbed {
  const now = formatDate(new Date(), "HH:mm:ss dd.MM.yyyy");
  const result = new RichEmbed()
    .setColor("#0099ff")
    .setTitle(`Награды клуба "${homeclub.club.lol_name}"`)
    .setDescription(`Сезон "${season_rewards.season.title}".`)
    .setFooter(now);

  if (season_rewards.reward) {
    result.addField(boldIF("Сезон", !season_rewards.season.is_closed), `• ${capitalizeFirstLetter(season_rewards.reward.reason)} - ${season_rewards.reward.count} шт.`);
  }

  if (stages_rewards.length) {
    for (const { reward, stage } of stages_rewards) {
      const stage_text = boldIF(`Этап ${stage.index}`, !stage.is_closed);
      const rewards_text = `• ${capitalizeFirstLetter(reward.reason)} - ${reward.count} шт.`;
      result.addField(stage_text, rewards_text);
    }
  }

  return result;
}