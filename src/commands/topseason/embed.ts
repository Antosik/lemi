import { RichEmbed } from "discord.js";

import { ISeasonsClub } from "../../interfaces/IClub";
import format from "../../localization";

import { boldIF } from "../../helpers/functions";

export function generateTopseasonEmbed(embed: RichEmbed, clubs: ISeasonsClub[]): RichEmbed {
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