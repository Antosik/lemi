import { format as formatDate } from "date-fns";
import { RichEmbed } from "discord.js";

import { ICommand } from "../../interfaces/ICommand";
import { consts } from "../../localization";

import { createPagedMessage } from "../../helpers/discord";

import { generateStageEmbed } from "./embed";
import { generateCalcStageNotPart } from "../calcstage/text";

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

    const [live_season, homeclub] = await Promise.all([ctx.clubs.getLiveSeason(), ctx.clubs.getHomeClub()]);
    if (live_season === undefined || (!stage_index && live_season.isEnded())) {
      return message.channel.send(consts.noActiveStage);
    }

    const stage = live_season?.getStageIdByIndex(stage_index);
    if (!stage) {
      return message.channel.send(consts.stageNotFound);
    }
    if (homeclub === undefined) {
      return message.channel.send(consts.clubNotSelected);
    }

    const stage_clubs = await homeclub.getStageClubs(stage.id);
    const homeclub_stage = stage_clubs.find((stage_club) => stage_club.club.id === homeclub.id);

    if (!homeclub_stage || !homeclub_stage.id) {
      const group_size = 5;
      const { games_count, points_needed } = await homeclub.calculateStage(stage.id, { group_size });
      const result_not = generateCalcStageNotPart({ points_needed, games_count, group_size });
      return message.channel.send(result_not);
    }

    const start_date = formatDate(stage.start_date, "dd.MM.yyyy");
    const end_date = formatDate(stage.end_date, "dd.MM.yyyy");
    const now = formatDate(new Date(), "HH:mm:ss dd.MM.yyyy");

    const template = new RichEmbed()
      .setColor("#0099ff")
      .setTitle("Рейтинг клубов")
      .setDescription(`Сезон "${live_season.title}". Этап ${stage.number} (${start_date} - ${end_date})`)
      .setFooter(now);

    const pages_count = Math.ceil(stage_clubs.length / count);
    let stage_clubs_slice = stage_clubs.slice(0, count);
    let result = generateStageEmbed(template, stage_clubs_slice, homeclub.id);

    const stage_clubs_message_r = await message.channel.send(result);
    const stage_clubs_message = Array.isArray(stage_clubs_message_r) ? stage_clubs_message_r[0] : stage_clubs_message_r;

    if (pages_count > 1) {
      await createPagedMessage(
        stage_clubs_message,
        async (page) => {
          stage_clubs_slice = stage_clubs.slice((page - 1) * count, page * count);
          result = generateStageEmbed(template, stage_clubs_slice, homeclub.id);
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
