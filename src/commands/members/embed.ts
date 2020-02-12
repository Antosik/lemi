import { RichEmbed } from "discord.js";

import { IStageSummoner } from "../../interfaces/ISummoner";
import format from "../../localization";

import { boldIF } from "../../helpers/functions";

export function generateMembersEmbed(embed: RichEmbed, summoners: IStageSummoner[], index_start = 1): RichEmbed {
  const res = new RichEmbed(embed);
  res.fields = [];

  summoners.forEach((member, i) => {
    const title = boldIF(`${i + index_start}. ${member.summoner.summoner_name}`, i + index_start < 4);
    const description = `${member.points}pt - ${format("game", member.games)}`;
    res.addField(title, description);
  });

  return res;
}