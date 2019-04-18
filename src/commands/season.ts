import { format as formatDate } from "date-fns";
import { RichEmbed } from "discord.js";

import { ICommand } from "../interfaces/ICommand";
import { consts } from "../localization";

import { boldIF } from "../helpers";

module.exports = {
  name: "seasoninfo",
  description: "Общая информация о текущем сезоне.",
  aliases: ["сезон", "season", "ss"],
  usage: "season/сезон",

  async execute(ctx, message, args) {
    const live_season = await ctx.clubs.getLiveSeason();
    if (!live_season) {
      return message.channel.send(consts.noActiveSeason);
    }

    const stages = await live_season.getStages();

    const start_date = formatDate(live_season.start_date, "dd.MM.yyyy");
    const end_date = formatDate(live_season.end_date, "dd.MM.yyyy");

    const result = new RichEmbed()
      .setColor("#0099ff")
      .setURL(`https://clubs.ru.leagueoflegends.com/rating?ssid=${live_season.id}&stid=0`)
      .setTitle(`Информация о сезоне "${live_season.title}"`);

    if (live_season.isEnded()) {
      result.setDescription(`**Сезон окончен!** (Даты сезона: ${start_date} - ${end_date})`);
    } else {
      result.setDescription(`Даты сезона: ${start_date} - ${end_date}`);
    }

    stages.forEach((stage) => {
      const stage_start_date = formatDate(stage.start_date, "dd.MM.yyyy");
      const stage_end_date = formatDate(stage.end_date, "dd.MM.yyyy");

      const title = boldIF(`Этап ${stage.number}`, stage.is_live);
      const description = boldIF(`${stage_start_date} - ${stage_end_date}`, stage.is_live);

      result.addField(title, description);
    });

    await message.channel.send(result);
  }
} as ICommand;
