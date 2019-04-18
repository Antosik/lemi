import { RichEmbed } from "discord.js";

import { ICommand } from "../interfaces/ICommand";
import format, { consts } from "../localization";

module.exports = {
  name: "searchclub",
  description: "Поиск по клубам (Топ-500 сезона). Чем полнее название, тем лучше.",
  aliases: ["поиск", "search", "se"],
  usage: "search/поиск [название]",
  async execute(ctx, message, args) {
    const name = args.join(" ").trim();
    if (!name) {
      return message.channel.send(consts.clubNameInvalid);
    }
    if (name.length < 3) {
      return message.channel.send(consts.clubNameLength);
    }

    const live_season = await ctx.clubs.getLiveSeason();
    const clubs = await live_season.findClub(name);
    if (!clubs.length) {
      return message.channel.send(consts.clubNotFound);
    }

    if (clubs.length === 1) {
      const [club] = clubs;

      const { id: season_id, current_stage } = live_season;
      const { club: { id: club_id } } = club;

      let stage_data: { number: number, place: string };

      if (current_stage) {
        const { id: stage_id, number } = current_stage;

        const club_stage = await ctx.clubs.getClubStage(club_id, season_id, stage_id);
        const stage_place = club_stage.rank ? `#${club_stage.rank} (${format("game", club_stage.games)})` : `Недостаточно очков - ${club_stage.points}/1000`;

        stage_data = { number, place: stage_place };
      }

      const description = `Владелец - ${club.club.owner.summoner_name} | ${format("participient", club.club.members_count)}`;
      const points = `${club.points}pt`;
      const season_place = `#${club.rank} (${format("game", club.games)})`;

      const result = new RichEmbed()
        .setColor("#0099ff")
        .setTitle(`Клуб "${club.club.lol_name}"`)
        .setDescription(description)
        .addField(`Общее количество очков`, points)
        .addField(`Место в сезоне`, season_place, true);

      if (stage_data) {
        result.addField(`Место в ${stage_data.number} этапе`, stage_data.place, true);
      }

      return message.channel.send(result);
    } else {
      const result = new RichEmbed()
        .setColor("#0099ff")
        .setAuthor(`Итоги поиска по клубам ("${name}"):`)
        .setTitle(`Найдено ${format("club", clubs.length)}`)
        .setFooter(`Укажите точное название для получения полной информации`);

      clubs.forEach((club, i) => {
        result
          .addField(`${i + 1}. ${club.club.lol_name}`, `#${club.rank} в сезоне, ${club.points}pt`);
      });

      return message.channel.send(result);
    }
  }
} as ICommand;
