import { format as formatDate } from "date-fns";

import { ICommand } from "../../interfaces/ICommand";
import { consts } from "../../localization";
import { createPagedMessage } from "../../helpers/discord";

import { formatDeficiencyMembers, generateFarmTemplateEmbed } from "./embed";


module.exports = {
  name: "myclubfarm",
  description: "Выводит игроков, не заработавших заданное количество очков",
  aliases: ["фарм", "farm", "f"],
  usage: "farm/фарм [количество очков] [количество позиций]",

  async execute(ctx, message, args) {
    if (!ctx.clubs) {
      throw new Error(consts.unexpectedError);
    }

    const points: number = Number(args[0]) || 200;
    const count: number = Number(args[1]) || 10;

    const live_season = await ctx.clubs.getLiveSeason();
    if (live_season === undefined || !live_season.isLive() || live_season.current_stage === undefined) {
      return message.channel.send(consts.noActiveStage);
    }

    const live_stage = live_season.current_stage;
    const homeclub = await live_stage.getClubMe();

    const homeclub_members = await live_stage.getClubMembers(homeclub.club.members_count);

    const deficiency = homeclub_members.filter((member) => member.points < points).sort((a, b) => a.points - b.points);
    if (!deficiency.length) {
      return message.channel.send(consts.farmEnoughPoints);
    }

    const now = formatDate(new Date(), "HH:mm:ss dd.MM.yyyy");
    const template = generateFarmTemplateEmbed(points, now, { live_season, live_stage, homeclub });

    const pages_count = Math.ceil(deficiency.length / count);
    let deficiency_slice = deficiency.slice(0, count);
    let result = formatDeficiencyMembers(template, deficiency_slice, points);

    const deficiency_message_r = await message.channel.send(result);
    const deficiency_message = Array.isArray(deficiency_message_r) ? deficiency_message_r[0] : deficiency_message_r;

    if (pages_count > 1) {
      await createPagedMessage(
        deficiency_message,
        async (page) => {
          const index_start = (page - 1) * count + 1;

          deficiency_slice = deficiency.slice((page - 1) * count, page * count);
          result = formatDeficiencyMembers(template, deficiency_slice, points, index_start);
          result.setFooter(`Страница ${page} • ${now}`);

          await deficiency_message.edit(result);
        },
        {
          filter: (_, user) => user.id === message.author.id,
          pages_count
        }
      );
    }

    return;
  }
} as ICommand;
