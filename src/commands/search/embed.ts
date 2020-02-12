import { RichEmbed } from "discord.js";

import { ISeasonsClub } from "../../interfaces/IClub";
import format from "../../localization";

export function generateFoundOneClubEmbed(
  { club, stage_data }: { club: ISeasonsClub, stage_data: { number: number, place: string } | undefined }
): RichEmbed {
  const club_owner = club.club.owner?.summoner_name || "???";

  const seasons_count = club.club.seasons_count ? `${format("season", club.club.seasons_count)}` : "новый клуб";
  const description = `Владелец - ${club_owner} | ${format("participient", club.club.members_count)} | ${seasons_count}`;
  const points = `${club.points}pt`;
  const season_place = `#${club.rank} (${format("game", club.games)})`;

  const result = new RichEmbed()
    .setColor("#0099ff")
    .setTitle(`Клуб "${club.club.lol_name}"`)
    .setDescription(description)
    .addField("Общее количество очков", points)
    .addField("Место в сезоне", season_place, true);

  if (stage_data) {
    result.addField(`Место в ${stage_data.number} этапе`, stage_data.place, true);
  }

  return result;
}
export function generateFoundMultipleClubsEmbed(
  { query, clubs }: { query: string, clubs: ISeasonsClub[] }
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
