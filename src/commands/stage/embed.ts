import { RichEmbed } from "discord.js";

import { IStageClub } from "../../interfaces/IClub";
import format from "../../localization";

import { boldIF, underlineIF } from "../../helpers/functions";

export function generateStageEmbed(embed: RichEmbed, clubs: IStageClub[], homeClubId: number): RichEmbed {
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