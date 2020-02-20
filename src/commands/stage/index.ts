import { format as formatDate } from "date-fns";

import { ICommand } from "../../interfaces/ICommand";
import { consts } from "../../localization";
import { createPagedMessage } from "../../helpers/discord";

import { generateCalcStageNotPart } from "../calcstage/text";
import { generateStageEmbed, generateStageTemplateEmbed } from "./embed";

module.exports = {
  name: "myclubstage",
  description: "Топ этапа вашего клуба.",
  aliases: ["этап", "stage", "topstage", "st"],
  usage: "stage/этап [номер этапа (1-3)] [количество позиций]",

  async execute(ctx, message, args) {
    if (!ctx.clubs) {
      throw new Error(consts.unexpectedError);
    }

    const stage_index: number | undefined = Number(args[0]) || undefined;
    const count: number = Number(args[1]) || 10;

    const live_season = await ctx.clubs.getLiveSeason();
    if (live_season === undefined || (!stage_index && !live_season.isLive())) {
      return message.channel.send(consts.noActiveStage);
    }

    const stage = live_season.getStageByIndex(stage_index);
    if (stage === undefined) {
      return message.channel.send(consts.stageNotFound);
    }

    const [homeclub_stage, clubs_stage] = await Promise.all([stage.getClubMe(), stage.getTopN(50)]);

    if (!homeclub_stage.rank) {
      const group_size = 5;
      const { games_count, points_needed } = await stage.toGetTopN(1, { group_size });
      const result_not = generateCalcStageNotPart({ points_needed, games_count, group_size });
      return message.channel.send(result_not);
    }

    const now = formatDate(new Date(), "HH:mm:ss dd.MM.yyyy");
    const template = generateStageTemplateEmbed(now, { stage, live_season });

    const pages_count = Math.ceil(clubs_stage.length / count);
    let stage_clubs_slice = clubs_stage.slice(0, count);
    let result = generateStageEmbed(template, stage_clubs_slice, homeclub_stage.id);

    const stage_clubs_message_r = await message.channel.send(result);
    const stage_clubs_message = Array.isArray(stage_clubs_message_r) ? stage_clubs_message_r[0] : stage_clubs_message_r;

    if (pages_count > 1) {
      await createPagedMessage(
        stage_clubs_message,
        async (page) => {
          stage_clubs_slice = clubs_stage.slice((page - 1) * count, page * count);
          result = generateStageEmbed(template, stage_clubs_slice, homeclub_stage.id);
          result.setFooter(`Страница ${page} • ${now}`);
          await stage_clubs_message.edit(result);
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
