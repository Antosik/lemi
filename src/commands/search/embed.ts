import { RichEmbed } from "discord.js";

import { ISeasonsClubResponse, IStageClubResponse } from "../../clubs-api/interfaces/IClub";

import format from "../../localization";

export function generateFoundOneClubEmbed(
  { club_season, club_stage, stage_index  }: { club_season: ISeasonsClubResponse, club_stage: IStageClubResponse | undefined,  stage_index: number | undefined }
): RichEmbed {
  const { club } = club_season;


  const club_owner = club.owner?.summoner_name || "???";
  const seasons_count = club.seasons_count ? `${format("season", club.seasons_count)}` : "новый клуб";
  const description = `Владелец - ${club_owner} | ${format("participient", club.members_count)} | ${seasons_count}`;

  const points = `${club_season.points}pt`;
  const season_place = `#${club_season.rank} (${format("game", club_season.games)})`;

  const result = new RichEmbed()
    .setColor("#0099ff")
    .setTitle(`Клуб "${club.lol_name}"`)
    .setDescription(description)
    .addField("Общее количество очков", points)
    .addField("Место в сезоне", season_place, true);

  if (club_stage && stage_index) {
    const stage_place = club_stage.rank ? `#${club_stage.rank} (${format("game", club_stage.games)})` : `Недостаточно очков - ${club_stage.points}/1000`;
    result.addField(`Место в ${club_stage.stage} этапе`, stage_place, true);
  }

  return result;
}
export function generateFoundMultipleClubsEmbed(
  { query, clubs }: { query: string, clubs: ISeasonsClubResponse[] }
): RichEmbed {
  const result = new RichEmbed()
    .setColor("#0099ff")
    .setAuthor(`Итоги поиска по клубам ("${query}"):`)
    .setTitle(`Найдено ${format("club", clubs.length)}`)
    .setFooter("Укажите точное название для получения полной информации");

  clubs.forEach((club, i) => {
    const seasons_count = club.club.seasons_count ? `${format("season", club.club.seasons_count)}` : "новый клуб";
    result
      .addField(`${i + 1}. ${club.club.lol_name} (*${seasons_count}*)`, `#${club.rank} в сезоне, ${club.points}pt`);
  });

  return result;
}
