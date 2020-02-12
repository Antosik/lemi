import { RichEmbed } from "discord.js";

import { ICommand } from "../interfaces/ICommand";

import { isValidURL } from "../helpers/functions";
import format, { consts } from "../localization";

module.exports = {
  name: "myclubmember",
  description: "Поиск по участникам клуба. Чем полнее ник, тем лучше.",
  aliases: ["участник", "member", "m1"],
  usage: "member/участник [никнейм]",

  async execute(ctx, message, args) {
    const name: string = args.join(" ").trim();
    if (!name) {
      return message.channel.send(consts.playerNameInvalid);
    }
    if (name.length < 3) {
      return message.channel.send(consts.playerNameLength);
    }

    const [live_season, homeclub] = await Promise.all([ctx.clubs.getLiveSeason(), ctx.clubs.getHomeClub()]);

    const stage = live_season.getStageIdByIndex();
    const members = await homeclub.getStageMembers(stage.id, homeclub.members_count);

    const searchRegExp = new RegExp(name, "i");
    const members_with_name = members.filter((member) => searchRegExp.test(member.summoner.summoner_name));

    if (!members_with_name.length) {
      return message.channel.send(consts.playerNotFound);
    } else if (members_with_name.length !== 1) {
      const result = new RichEmbed()
        .setColor("#0099ff")
        .setAuthor("Итоги поиска по участникам:")
        .setTitle(`Найдено ${format("participient", members_with_name.length)}`)
        .setFooter("Укажите точное имя для получения полной информации");

      members_with_name.forEach((member, i) => {
        result
          .addField(`${i + 1}. ${member.summoner.summoner_name}`, `${format("point", member.points)} | [op.gg](http://op.gg/summoner/userName=${member.summoner.summoner_name})`);
      });

      return message.channel.send(result);
    } else {
      const sorted_members = members.sort((a, b) => b.points - a.points);
      const [member] = members_with_name;

      const opgg_profile = `[op.gg](${encodeURI(`http://ru.op.gg/summoner/userName=${member.summoner.summoner_name}`)})`;
      const log_profile = `[leagueofgraphs](${encodeURI(`https://www.leagueofgraphs.com/ru/summoner/ru/${member.summoner.summoner_name}`)})`;
      const result = new RichEmbed()
        .setColor("#0099ff")
        .setTitle(`Участник клуба ${homeclub.name} - "${member.summoner.summoner_name}"`)
        .addField(`Очков за ${stage.number} этап`, `${format("point", member.points)} (#${sorted_members.indexOf(member) + 1} в клубе)`)
        .addField("Профиль", `${opgg_profile} • ${log_profile}`);

      if (isValidURL(member.summoner.avatar)) {
        result.setThumbnail(encodeURI(member.summoner.avatar));
      }

      return message.channel.send(result);
    }
  }
} as ICommand;
