import { RichEmbed } from "discord.js";

import { ISeasonsClubResponse, IStageClubResponse } from "../../clubs-api/interfaces/IClub";

import format, { consts } from "../../localization";

export function generateClubEmbed(
  { homeclub_season, homeclub_stage, stage_index }: { homeclub_season: ISeasonsClubResponse, homeclub_stage: IStageClubResponse | undefined,  stage_index: number | undefined }
): RichEmbed {
  const { club: homeclub } = homeclub_season;

  const seasons_count = homeclub.seasons_count ? `${format("season", homeclub.seasons_count)}` : "новый клуб";
  const description = `Владелец - ${homeclub.owner.summoner_name} | ${format("participient", homeclub.members_count)} | ${seasons_count}`;

  const points = `${homeclub_season.points}pt`;
  const season_place = homeclub_season.rank ? `#${homeclub_season.rank}` : consts.noPlaceInTop;

  const result = new RichEmbed()
    .setColor("#0099ff")
    .setTitle(`Клуб "${homeclub.lol_name}"`)
    .setDescription(description)
    .addField("Общее количество очков", points)
    .addField("Место в сезоне", season_place, true);

  if (homeclub_stage && stage_index) {
    const stage_place = homeclub_stage.rank ? `#${homeclub_stage.rank} (${format("game", homeclub_stage.games)})` : `Недостаточно очков - ${homeclub_stage.points}/1000`;
    result.addField(`Место в ${stage_index} этапе`, stage_place, true);
  }

  return result;
}