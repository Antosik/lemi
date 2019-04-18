import { format as formatDate } from "date-fns";
import { RichEmbed } from "discord.js";

import { ICommand } from "../interfaces/ICommand";
import format, { consts } from "../localization";

import { boldIF } from "../helpers";

module.exports = {
  name: "myclubmembers",
  description: "Информацию об очках, заработанных участниками вашего клуба.",
  aliases: ["участники", "members ", "m"],
  usage: "members/участники [номер этапа (1-3)] [количество участников]",
  async execute(ctx, message, args) {
    const stage_index = Number(args[0]) || undefined;
    const count = Number(args[1]) || 10;

    const [live_season, homeclub] = await Promise.all([ctx.clubs.getLiveSeason(), ctx.clubs.getHomeClub()]);
    if (!stage_index && live_season.isEnded()) {
      return message.channel.send(consts.noActiveStage);
    }

    const stage = live_season.getStageIdByIndex(stage_index);
    if (!stage) {
      return message.channel.send(consts.stageNotFound);
    }

    const members = await homeclub.getStageMembers(stage.id, count);

    const start_date = formatDate(stage.start_date, "dd.MM.yyyy");
    const end_date = formatDate(stage.end_date, "dd.MM.yyyy");
    const now = formatDate(new Date(), "HH:mm:ss dd.MM.yyyy");

    const result = new RichEmbed()
      .setColor("#0099ff")
      .setURL(`https://clubs.ru.leagueoflegends.com/club/member`)
      .setTitle(`Рейтинг игроков клуба "${homeclub.name}"`)
      .setDescription(`Сезон "${live_season.title}". Этап ${stage.number} (${start_date} - ${end_date})`)
      .setFooter(now);

    members.forEach((member, i) => {
      const title = boldIF(`${i + 1}. ${member.summoner.summoner_name}`, i < 3);
      const description = `${member.points}pt - ${format("game", member.games)}`;
      result.addField(title, description);
    });

    await message.channel.send(result);
  }
} as ICommand;
