import { RichEmbed } from "discord.js";

import { IStageSummoner } from "../../interfaces/ISummoner";
import format from "../../localization";

import { isValidURL } from "../../helpers/functions";

export function generateFoundManyMembersEmbed(
  members_list: IStageSummoner[]
): RichEmbed {
  const result = new RichEmbed()
    .setColor("#0099ff")
    .setAuthor("Итоги поиска по участникам:")
    .setTitle(`Найдено ${format("participient", members_list.length)}`)
    .setFooter("Укажите точное имя для получения полной информации");

  members_list.forEach((member, i) => {
    result
      .addField(`${i + 1}. ${member.summoner.summoner_name}`, `${format("point", member.points)} | [op.gg](http://op.gg/summoner/userName=${member.summoner.summoner_name})`);
  });

  return result;
}

export function generateFoundOneMemberEmbed(
  member: IStageSummoner,
  { stage_index, club_name, list_index }: { stage_index: number, club_name: string, list_index: number }
): RichEmbed {
  const opgg_profile = `[op.gg](${encodeURI(`http://ru.op.gg/summoner/userName=${member.summoner.summoner_name}`)})`;
  const log_profile = `[leagueofgraphs](${encodeURI(`https://www.leagueofgraphs.com/ru/summoner/ru/${member.summoner.summoner_name}`)})`;

  const result = new RichEmbed()
    .setColor("#0099ff")
    .setTitle(`Участник клуба ${club_name} - "${member.summoner.summoner_name}"`)
    .addField(`Очков за ${stage_index} этап`, `${format("point", member.points)} (#${list_index} в клубе)`)
    .addField("Профиль", `${opgg_profile} • ${log_profile}`);

  if (isValidURL(member.summoner.avatar)) {
    result.setThumbnail(encodeURI(member.summoner.avatar));
  }

  return result;
}