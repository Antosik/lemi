import { format as formatDate } from "date-fns";
import { RichEmbed } from "discord.js";

import { ISeasonsClub } from "../interfaces/IClub";
import { ICommand } from "../interfaces/ICommand";
import format, { consts } from "../localization";

import { createPagedMessage } from "../helpers/discord";
import { boldIF } from "../helpers/functions";

module.exports = {
  name: "topseason",
  description: "Топ текущего сезона.",
  aliases: ["топсезона", "seasontop", "sst"],
  usage: "topseason/топсезона [количество позиций]",

  async execute(ctx, message, args) {
    const count: number = Number(args[0]) || 10;

    const live_season = await ctx.clubs.getLiveSeason();

    const start_date = formatDate(live_season.start_date, "dd.MM.yyyy");
    const end_date = formatDate(live_season.end_date, "dd.MM.yyyy");
    const now = formatDate(new Date(), "HH:mm:ss dd.MM.yyyy");
    const template = new RichEmbed()
      .setColor("#0099ff")
      .setURL(`https://clubs.ru.leagueoflegends.com/rating?ssid=${live_season.id}&stid=0`)
      .setTitle(`Рейтинг клубов`)
      .setDescription(`Сезон "${live_season.title}" (${start_date} - ${end_date})`)
      .setFooter(`Страница 1 • ${now}`);

    let top10 = await live_season.getTopN(count);
    let result = formatTop(template, top10);

    const top_message_r = await message.channel.send(result);
    const top_message = Array.isArray(top_message_r) ? top_message_r[0] : top_message_r;

    await createPagedMessage(
      top_message,
      async (page, reaction) => {
        top10 = await live_season.getTopN(count, page);
        result = formatTop(template, top10);
        result.setFooter(`Страница ${page} • ${now}`);
        await top_message.edit(result);
      },
      {
        filter: (r, user) => user.id === message.author.id,
        pages_count: 10
      }
    );

    function formatTop(embed: RichEmbed, clubs: ISeasonsClub[]): RichEmbed {
      const res = new RichEmbed(embed);
      res.fields = [];

      clubs.forEach((club, i) => {
        const title = boldIF(`${club.rank}. ${club.club.lol_name}`, club.rank <= 3);
        const seasons_count = club.club.seasons_count ? format("season", club.club.seasons_count) : "новый клуб";
        const description = `${club.points}pt - ${format("player", club.club.members_count)}`;
        res.addField(`${title} (*${seasons_count}*)`, description);
      });

      return res;
    }
  },
} as ICommand;
