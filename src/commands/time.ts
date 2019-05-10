import { formatDistance } from "date-fns";
import { ru } from "date-fns/locale";

import { ESeasonArgs, EStageArgs, isSeason, isStage } from "../interfaces/IArgument";
import { ICommand } from "../interfaces/ICommand";
import { consts } from "../localization";

module.exports = {
  name: "time",
  description: "Оставшееся время до конца сезона/этапа.",
  aliases: ["время", "t"],
  usage: "time/время [season/stage]",

  async execute(ctx, message, args) {
    let type: string = args[0] || EStageArgs.en;

    if (!isSeason(type) && !isStage(type)) {
      type = EStageArgs.en;
    }

    const live_season = await ctx.clubs.getLiveSeason();
    if (live_season.isEnded()) {
      if (isStage(type)) {
        return message.channel.send(consts.noActiveStage);
      }
      return message.channel.send(consts.noActiveSeason);
    }

    if (isStage(type)) {
      if (!live_season.current_stage) {
        return message.channel.send(consts.noActiveStage);
      }

      const end_date = live_season.current_stage.end_date;
      const distance = formatDistance(end_date, new Date(), {
        locale: ru
      });

      return message.channel.send(`${consts.timeToStageEnd}: **${distance}**`);
    } else {
      if (live_season.end_date < new Date()) {
        return message.channel.send(consts.noActiveSeason);
      }

      const end_date = live_season.end_date;
      const distance = formatDistance(end_date, new Date(), {
        locale: ru
      });

      return message.channel.send(`${consts.timeToSeasonEnd}: **${distance}**`);
    }
  }
} as ICommand;
