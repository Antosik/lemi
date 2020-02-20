import { format as formatDate } from "date-fns";

import { ICommand } from "../../interfaces/ICommand";
import { consts } from "../../localization";
import { createPagedMessage } from "../../helpers/discord";

import { generateTopseasonEmbed, generateTopseasonTemplateEmbed } from "./embed";


module.exports = {
  name: "topseason",
  description: "Топ текущего сезона.",
  aliases: ["топсезона", "seasontop", "sst"],
  usage: "topseason/топсезона [количество позиций]",

  async execute(ctx, message, args) {
    if (!ctx.clubs) {
      throw new Error(consts.unexpectedError);
    }

    const count: number = Number(args[0]) || 10;

    const live_season = await ctx.clubs.getLiveSeason();
    if (live_season === undefined || !live_season.isLive()) {
      return message.channel.send(consts.noActiveSeason);
    }

    const now = formatDate(new Date(), "HH:mm:ss dd.MM.yyyy");
    const template = generateTopseasonTemplateEmbed(now, { live_season });

    let top10 = await live_season.getTopN(count);
    let result = generateTopseasonEmbed(template, top10);

    const top_message_r = await message.channel.send(result);
    const top_message = Array.isArray(top_message_r) ? top_message_r[0] : top_message_r;

    await createPagedMessage(
      top_message,
      async (page) => {
        top10 = await live_season.getTopN(count, page);
        result = generateTopseasonEmbed(template, top10);
        result.setFooter(`Страница ${page} • ${now}`);
        await top_message.edit(result);
      },
      {
        filter: (_, user) => user.id === message.author.id,
        pages_count: 10
      }
    );

    return;
  },
} as ICommand;
