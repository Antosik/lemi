import { RichEmbed } from "discord.js";

import { ISeasonsClub } from "../../interfaces/IClub";
import HomeClub from "../../models/HomeClub";
import format, { consts } from "../../localization";

export function generateClubEmbed(
  { homeclub, homeclub_season, stage_data }: { homeclub: HomeClub, homeclub_season: ISeasonsClub, stage_data: { number: number, place: string } | undefined }
): RichEmbed {
  const seasons_count = homeclub.seasons_count ? `${format("season", homeclub.seasons_count)}` : "новый клуб";
  const description = `Владелец - ${homeclub.owner_name} | ${format("participient", homeclub.members_count)} | ${seasons_count}`;
  const points = `${homeclub_season.points}pt`;
  const season_place = homeclub_season.rank ? `#${homeclub_season.rank}` : consts.noPlaceInTop;

  const result = new RichEmbed()
    .setColor("#0099ff")
    .setTitle(`Клуб "${homeclub.name}"`)
    .setDescription(description)
    .addField("Общее количество очков", points)
    .addField("Место в сезоне", season_place, true);

  if (stage_data) {
    result.addField(`Место в ${stage_data.number} этапе`, stage_data.place, true);
  }

  return result;
}