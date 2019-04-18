import { format as formatDate } from "date-fns";
import { RichEmbed } from "discord.js";

import { ICommand } from "../interfaces/ICommand";
import format, { consts } from "../localization";

import { boldIF, underlineIF } from "../helpers";

module.exports = {
  name: "myclubstage",
  description: "Топ этапа вашего клуба.",
  aliases: ["этап", "stage", "topstage", "st"],
  usage: "stage/этап [номер этапа (1-3)] [количество клубов]",

  async execute(ctx, message, args) {
    const stage_index: number = Number(args[0]) || undefined;
    const count: number = Number(args[1]) || 10;

    const [live_season, homeclub] = await Promise.all([ctx.clubs.getLiveSeason(), ctx.clubs.getHomeClub()]);
    if (!stage_index && live_season.isEnded()) {
      return message.channel.send(consts.noActiveStage);
    }

    const stage = live_season.getStageIdByIndex(stage_index);
    if (!stage) {
      return message.channel.send(consts.stageNotFound);
    }

    const stage_clubs = await homeclub.getStageClubs(stage.id);
    const homeclub_stage = stage_clubs.find((stage_club) => stage_club.club.id === homeclub.id);

    if (!homeclub_stage || !homeclub_stage.id) {
      return message.channel.send(consts.noEnoughPt);
    }

    const start_date = formatDate(stage.start_date, "dd.MM.yyyy");
    const end_date = formatDate(stage.end_date, "dd.MM.yyyy");
    const now = formatDate(new Date(), "HH:mm:ss dd.MM.yyyy");

    const result = new RichEmbed()
      .setColor("#0099ff")
      .setURL(`https://clubs.ru.leagueoflegends.com/rating?ssid=${live_season.id}&stid=${stage.id}`)
      .setTitle(`Рейтинг клубов`)
      .setDescription(`Сезон "${live_season.title}". Этап ${stage.number} (${start_date} - ${end_date})`)
      .setFooter(now);

    stage_clubs
      .filter((stage_club) => stage_club.rank <= count)
      .forEach((stage_club) => {
        const title = underlineIF(boldIF(`${stage_club.rank}. ${stage_club.club.lol_name}`, stage_club.rank <= 3), homeclub.id === stage_club.club.id);
        const description = `${stage_club.points}pt - ${format("player", stage_club.club.members_count)}`;
        result.addField(title, description);
      });

    if (homeclub_stage.rank > count) {
      const title = underlineIF(boldIF(`${homeclub_stage.rank}. ${homeclub_stage.club.lol_name}`, homeclub_stage.rank <= 3), homeclub.id === homeclub_stage.club.id);
      const description = `${homeclub_stage.points}pt - ${format("player", homeclub_stage.club.members_count)}`;
      result.addField(title, description);
    }

    await message.channel.send(result);
  }
} as ICommand;
