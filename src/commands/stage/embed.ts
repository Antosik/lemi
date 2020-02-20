import { format as formatDate } from "date-fns";
import { RichEmbed } from "discord.js";

import { IStageClubResponse } from "../../clubs-api/interfaces/IClub";

import { ISeasonEntity } from "../../interfaces/ISeason";
import { IStageEntity } from "../../interfaces/IStage";
import format from "../../localization";
import { boldIF, underlineIF } from "../../helpers/functions";

export function generateStageTemplateEmbed(
  now: string,
  { stage, live_season }: { stage: IStageEntity, live_season: ISeasonEntity }
): RichEmbed {
  const start_date = formatDate(stage.start_date, "dd.MM.yyyy");
  const end_date = formatDate(stage.end_date, "dd.MM.yyyy");

  const template = new RichEmbed()
    .setColor("#0099ff")
    .setTitle("Рейтинг клубов")
    .setDescription(`Сезон "${live_season.title}". Этап ${stage.index} (${start_date} - ${end_date})`)
    .setFooter(now);

  return template;
}

export function generateStageEmbed(embed: RichEmbed, clubs: IStageClubResponse[], homeClubId: number): RichEmbed {
  const res = new RichEmbed(embed);
  res.fields = [];

  clubs.forEach((club) => {
    const title = underlineIF(boldIF(`${club.rank}. ${club.club.lol_name}`, club.rank <= 3), homeClubId === club.club.id);
    const seasons_count = club.club.seasons_count ? format("season", club.club.seasons_count) : "новый клуб";
    const description = `${club.points}pt - ${format("player", club.club.members_count)}`;
    res.addField(`${title} (*${seasons_count}*)`, description);
  });

  return res;
}