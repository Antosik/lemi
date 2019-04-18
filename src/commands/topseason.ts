import { format as formatDate } from "date-fns";
import { RichEmbed } from "discord.js";

import { ICommand } from "../interfaces/ICommand";
import format, { consts } from "../localization";

import { boldIF } from "../helpers";

module.exports = {
  name: "topseason",
  description: "Топ сезона.",
  aliases: ["топсезона", "seasontop", "st"],
  usage: "topseason/топсезона [количество мест]",
  async execute(ctx, message, args) {
    const live_season = await ctx.clubs.getLiveSeason();
    if (!live_season) {
      return message.channel.send(consts.noActiveSeason);
    }

    const count = Number(args[0]) || 10;
    const top10 = await live_season.getTopN(count);

    const start_date = formatDate(live_season.start_date, "dd.MM.yyyy");
    const end_date = formatDate(live_season.end_date, "dd.MM.yyyy");
    const now = formatDate(new Date(), "HH:mm:ss dd.MM.yyyy");

    const result = new RichEmbed()
      .setColor("#0099ff")
      .setURL(`https://clubs.ru.leagueoflegends.com/rating?ssid=${live_season.id}&stid=0`)
      .setTitle(`Рейтинг клубов`)
      .setDescription(`Сезон "${live_season.title}" (${start_date} - ${end_date})`)
      .setFooter(now);

    top10.forEach((club) => {
      const title = boldIF(`${club.rank}. ${club.club.lol_name}`, club.rank <= 3);
      const description = `${club.points}pt - ${format("player", club.club.members_count)}`;
      result.addField(title, description);
    });

    await message.channel.send(result);
  },
} as ICommand;
