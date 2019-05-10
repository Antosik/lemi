import { RichEmbed } from "discord.js";

import { ICommand } from "../interfaces/ICommand";
import format, { consts } from "../localization";

module.exports = {
  name: "searchclub",
  description: "Поиск по клубам (Топ-500 сезона). Чем полнее название, тем лучше.",
  aliases: ["поиск", "search", "se"],
  usage: "search/поиск [название]",

  async execute(ctx, message, args) {
    const name: string = args.join(" ").trim();
    if (!name) {
      return message.channel.send(consts.clubNameInvalid);
    }
    if (name.length < 3) {
      return message.channel.send(consts.clubNameLength);
    }

    const live_season = await ctx.clubs.getLiveSeason();
    const clubs = await live_season.findClub(name);
    if (!clubs.length) {
      return message.channel.send(consts.clubNotFound);
    }

    if (clubs.length === 1) {
      const [club] = clubs;

      const seasons_count = club.club.seasons_count ? `${format("season", club.club.seasons_count)}` : "новый клуб";
      const description = `Владелец - ${club.club.owner.summoner_name} | ${format("participient", club.club.members_count)} | ${seasons_count}`;
      const points = `${club.points}pt`;
      const season_place = `#${club.rank} (${format("game", club.games)})`;

      const result = new RichEmbed()
        .setColor("#0099ff")
        .setTitle(`Клуб "${club.club.lol_name}"`)
        .setDescription(description)
        .addField(`Общее количество очков`, points)
        .addField(`Место в сезоне`, season_place, true);

      return message.channel.send(result);
    } else {
      const result = new RichEmbed()
        .setColor("#0099ff")
        .setAuthor(`Итоги поиска по клубам ("${name}"):`)
        .setTitle(`Найдено ${format("club", clubs.length)}`)
        .setFooter(`Укажите точное название для получения полной информации`);

      clubs.forEach((club, i) => {
        const seasons_count = club.club.seasons_count ? `${format("season", club.club.seasons_count)}` : "новый клуб";
        result
          .addField(`${i + 1}. ${club.club.lol_name} (*${seasons_count}*)`, `#${club.rank} в сезоне, ${club.points}pt`);
      });

      return message.channel.send(result);
    }
  }
} as ICommand;
