import { format as formatDate } from "date-fns";
import { RichEmbed } from "discord.js";

import { ICommand } from "../../interfaces/ICommand";
import { consts } from "../../localization";
import { createPagedMessage } from "../../helpers/discord";

import { generateMembersEmbed } from "./embed";


const members_command = {
  name: "myclubmembers",
  description: "Информацию об очках, заработанных участниками вашего клуба.",
  aliases: ["участники", "members", "m"],
  usage: "members/участники [номер этапа (1-3)] [количество позиций]",

  async execute(ctx, message, args) {
    if (!ctx.clubs) {
      throw new Error(consts.unexpectedError);
    }

    const stage_index: number | undefined = Number(args[0]) || undefined;
    const count: number = Number(args[1]) || 25;

    const live_season = await ctx.clubs.getLiveSeason();
    if (live_season === undefined || (!stage_index && !live_season.isLive())) {
      return message.channel.send(consts.noActiveStage);
    }

    const stage = live_season.getStageByIndex(stage_index);
    if (!stage) {
      return message.channel.send(consts.stageNotFound);
    }

    const homeclub = await stage.getClubMe();
    const pages_count = Math.ceil(homeclub.club.members_count / count);

    const homeclub_members = await stage.getClubMembers(homeclub.club.members_count);

    const start_date = formatDate(stage.start_date, "dd.MM.yyyy");
    const end_date = formatDate(stage.end_date, "dd.MM.yyyy");
    const now = formatDate(new Date(), "HH:mm:ss dd.MM.yyyy");
    const template = new RichEmbed()
      .setColor("#0099ff")
      .setTitle(`Рейтинг игроков клуба ${homeclub.club.lol_name}`)
      .setDescription(`Сезон "${live_season.title}". Этап ${stage.index} (${start_date} - ${end_date})`)
      .setFooter(pages_count > 1 ? `Страница 1 • ${now}` : now);

    let members_slice = homeclub_members.slice(0, count);
    let result = generateMembersEmbed(template, members_slice);

    const members_message_r = await message.channel.send(result);
    const members_message = Array.isArray(members_message_r) ? members_message_r[0] : members_message_r;

    if (pages_count > 1) {
      await createPagedMessage(
        members_message,
        async (page) => {
          const index_start = (page - 1) * count + 1;

          members_slice = homeclub_members.slice((page - 1) * count, page * count);
          result = generateMembersEmbed(template, members_slice, index_start);
          result.setFooter(`Страница ${page} • ${now}`);
          await members_message.edit(result);
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

module.exports = members_command;
