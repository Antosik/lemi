import { format as formatDate } from "date-fns";
import { RichEmbed } from "discord.js";

import { ICommand } from "../interfaces/ICommand";
import { IStageSummoner } from "../interfaces/ISummoner";
import format, { consts } from "../localization";

import { createPagedMessage } from "../helpers/discord";
import { boldIF } from "../helpers/functions";

function formatDeficiencyMembers(embed: RichEmbed, summoners: IStageSummoner[], pointsNeeded: number, index_start = 1): RichEmbed {
  const res = new RichEmbed(embed);
  res.fields = [];

  summoners
    .forEach((member, i) => {
      const title = boldIF(`${i + index_start}. ${member.summoner.summoner_name}`, i + index_start < 4);
      const description = `${member.points}pt - ${format("game", member.games)} (нужно еще ${pointsNeeded - member.points}pt)`;
      res.addField(title, description);
    });

  return res;
}

module.exports = {
  name: "myclubfarm",
  description: "Выводит игроков, не заработавших заданное количество очков",
  aliases: ["фарм", "farm", "f"],
  usage: "farm/фарм [количество очков] [количество позиций]",

  async execute(ctx, message, args) {
    const points: number = Number(args[0]) || 200;
    const count: number = Number(args[1]) || 10;

    const [live_season, homeclub] = await Promise.all([ctx.clubs.getLiveSeason(), ctx.clubs.getHomeClub()]);
    if (live_season.isEnded()) {
      return message.channel.send(consts.noActiveStage);
    }

    const stage = live_season.getStageIdByIndex();

    const members = await homeclub.getStageMembers(stage.id, homeclub.members_count);
    const deficiency = members.filter((member) => member.points < points).sort((a, b) => a.points - b.points);

    if (!deficiency.length) {
      return message.channel.send(consts.farmEnoughPoints);
    }

    const start_date = formatDate(stage.start_date, "dd.MM.yyyy");
    const end_date = formatDate(stage.end_date, "dd.MM.yyyy");
    const now = formatDate(new Date(), "HH:mm:ss dd.MM.yyyy");
    const template = new RichEmbed()
      .setColor("#0099ff")
      .setTitle(`Игроки клуба "${homeclub.name}", не заработавшие ${points}pt`)
      .setDescription(`Сезон "${live_season.title}". Этап ${stage.number} (${start_date} - ${end_date})`)
      .setFooter(now);

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
          result = formatDeficiencyMembers(template, deficiency_slice, index_start);
          result.setFooter(`Страница ${page} • ${now}`);
          await deficiency_message.edit(result);
        },
        {
          filter: (r, user) => user.id === message.author.id,
          pages_count
        }
      );
    }

  }
} as ICommand;
