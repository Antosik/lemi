import { format as formatDate } from "date-fns";
import { RichEmbed } from "discord.js";

import { ISeasonsClubResponse } from "../../clubs-api/interfaces/IClub";

import { ISeasonEntity } from "../../interfaces/ISeason";
import format from "../../localization";
import { boldIF } from "../../helpers/functions";

export function generateTopseasonTemplateEmbed(
  now: string,
  { live_season }: { live_season: ISeasonEntity }
): RichEmbed {
  const start_date = formatDate(live_season.start_date, "dd.MM.yyyy");
  const end_date = formatDate(live_season.end_date, "dd.MM.yyyy");
  const template = new RichEmbed()
    .setColor("#0099ff")
    .setTitle("Рейтинг клубов")
    .setDescription(`Сезон "${live_season.title}" (${start_date} - ${end_date})`)
    .setFooter(`Страница 1 • ${now}`);

  return template;
}

export function generateTopseasonEmbed(embed: RichEmbed, clubs: ISeasonsClubResponse[]): RichEmbed {
  const res = new RichEmbed(embed);
  res.fields = [];

  clubs.forEach((club) => {
    const title = boldIF(`${club.rank}. ${club.club.lol_name}`, club.rank <= 3);
    const seasons_count = club.club.seasons_count ? format("season", club.club.seasons_count) : "новый клуб";
    const description = `${club.points}pt - ${format("player", club.club.members_count)}`;
    res.addField(`${title} (*${seasons_count}*)`, description);
  });

  return res;
}