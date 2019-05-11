import { format as formatDate } from "date-fns";
import { RichEmbed } from "discord.js";

import { ICommand } from "../interfaces/ICommand";
import { IStageSummoner } from "../interfaces/ISummoner";
import format, { consts } from "../localization";

import { createPagedMessage } from "../helpers/discord";
import { boldIF } from "../helpers/functions";

const members_command = {
  name: "myclubmembers",
  description: "Информацию об очках, заработанных участниками вашего клуба.",
  aliases: ["участники", "members", "m"],
  usage: "members/участники [номер этапа (1-3)] [количество позиций]",

  async execute(ctx, message, args) {
    const stage_index: number = Number(args[0]) || undefined;
    const count: number = Number(args[1]) || 25;

    const [live_season, homeclub] = await Promise.all([ctx.clubs.getLiveSeason(), ctx.clubs.getHomeClub()]);
    if (!stage_index && live_season.isEnded()) {
      return message.channel.send(consts.noActiveStage);
    }

    const stage = live_season.getStageIdByIndex(stage_index);
    if (!stage) {
      return message.channel.send(consts.stageNotFound);
    }

    const pages_count = Math.ceil(homeclub.members_count / count);

    const start_date = formatDate(stage.start_date, "dd.MM.yyyy");
    const end_date = formatDate(stage.end_date, "dd.MM.yyyy");
    const now = formatDate(new Date(), "HH:mm:ss dd.MM.yyyy");
    const template = new RichEmbed()
      .setColor("#0099ff")
      .setURL(`https://clubs.ru.leagueoflegends.com/club/member`)
      .setTitle(`Рейтинг игроков клуба "${homeclub.name}"`)
      .setDescription(`Сезон "${live_season.title}". Этап ${stage.number} (${start_date} - ${end_date})`)
      .setFooter(pages_count > 1 ? `Страница 1 • ${now}` : now);

    let members = await homeclub.getStageMembers(stage.id, count);
    let result = formatMembers(template, members);

    const members_message_r = await message.channel.send(result);
    const members_message = Array.isArray(members_message_r) ? members_message_r[0] : members_message_r;

    if (pages_count > 1) {
      await createPagedMessage(
        members_message,
        async (page, reaction) => {
          const index_start = (page - 1) * count + 1;

          members = await homeclub.getStageMembers(stage.id, count, page);
          result = formatMembers(template, members, index_start);
          result.setFooter(`Страница ${page} • ${now}`);
          await members_message.edit(result);
        },
        {
          filter: (r, user) => user.id === message.author.id,
          pages_count
        }
      );
    }

    function formatMembers(embed: RichEmbed, summoners: IStageSummoner[], index_start = 1) {
      const res = new RichEmbed(embed);
      res.fields = [];

      summoners.forEach((member, i) => {
        const title = boldIF(`${i + index_start}. ${member.summoner.summoner_name}`, i + index_start < 4);
        const description = `${member.points}pt - ${format("game", member.games)}`;
        res.addField(title, description);
      });

      return res;
    }
  }
} as ICommand;

module.exports = members_command;
