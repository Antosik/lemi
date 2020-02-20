import { format as formatDate } from "date-fns";
import { RichEmbed } from "discord.js";

import { IStageClubResponse } from "../../clubs-api/interfaces/IClub";
import { IStageSummonerResponse } from "../../clubs-api/interfaces/ISummoner";

import { IStageEntity } from "../../interfaces/IStage";
import { ISeasonEntity } from "../../interfaces/ISeason";
import format from "../../localization";
import { boldIF } from "../../helpers/functions";

export function generateFarmTemplateEmbed(
  points: number,
  now: string,
  { live_season, live_stage, homeclub }: { live_season: ISeasonEntity, live_stage: IStageEntity, homeclub: IStageClubResponse }
): RichEmbed {
  const start_date = formatDate(live_stage.start_date, "dd.MM.yyyy");
  const end_date = formatDate(live_stage.end_date, "dd.MM.yyyy");

  const template = new RichEmbed()
    .setColor("#0099ff")
    .setTitle(`Игроки клуба "${homeclub.club.lol_name}", не заработавшие ${points}pt`)
    .setDescription(`Сезон "${live_season.title}". Этап ${live_stage.index} (${start_date} - ${end_date})`)
    .setFooter(now);

  return template;
}

export function formatDeficiencyMembers(
  embed: RichEmbed,
  summoners: IStageSummonerResponse[],
  pointsNeeded: number,
  index_start = 1
): RichEmbed {
  const res = new RichEmbed(embed);
  res.fields = [];

  summoners
    .forEach((member, i) => {
      const title = boldIF(`${i + index_start}. ${member.summoner.summoner_name}`, i + index_start < 4);
      const description = `${member.points}pt - ${format("game", member.games)} (нужно еще ${pointsNeeded - member.points}pt)`;
      res.addField(title, description);
    });

  return res;
}