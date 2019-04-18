import { format as formatDate } from "date-fns";
import { RichEmbed } from "discord.js";

import { ICommand } from "../interfaces/ICommand";
import format, { consts } from "../localization";

import { boldIF } from "../helpers";

module.exports = {
  name: "myclubfarm",
  description: "Игроки, которые не заработали определенное количество очков.",
  aliases: ["фарм", "farm", "f"],
  usage: "farm/фарм [количество очков] [количество позиций]",
  async execute(ctx, message, args) {
    const points = Number(args[0]) || 200;
    const count = Number(args[1]);

    const [live_season, homeclub] = await Promise.all([ctx.clubs.getLiveSeason(), ctx.clubs.getHomeClub()]);
    if (live_season.isEnded()) {
      return message.channel.send(consts.noActiveStage);
    }

    const stage = await live_season.getStageIdByIndex();

    const members = await homeclub.getStageMembers(stage.id, homeclub.members_count);
    let deficiency = members.filter((member) => member.points < points).sort((a, b) => a.points - b.points);

    if (!deficiency.length) {
      return message.channel.send(consts.farmEnoughPoints);
    }

    const start_date = formatDate(stage.start_date, "dd.MM.yyyy");
    const end_date = formatDate(stage.end_date, "dd.MM.yyyy");
    const now = formatDate(new Date(), "HH:mm:ss dd.MM.yyyy");

    const result = new RichEmbed()
      .setColor("#0099ff")
      .setURL(`https://clubs.ru.leagueoflegends.com/club/member`)
      .setTitle(`Игроки клуба "${homeclub.name}", не заработавшие ${points}pt`)
      .setDescription(`Сезон "${live_season.title}". Этап ${stage.number} (${start_date} - ${end_date})`)
      .setFooter(now);

    if (count) {
      deficiency = deficiency.slice(0, count);
    }

    deficiency
      .forEach((member, i) => {
        const title = boldIF(`${i + 1}. ${member.summoner.summoner_name}`, i < 3);
        const description = `${member.points}pt - ${format("game", member.games)} (нужно еще ${points - member.points}pt)`;
        result.addField(title, description);
      });

    return message.channel.send(result);
  }
} as ICommand;
