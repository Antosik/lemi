import { RichEmbed } from "discord.js";

import { ICommand } from "../interfaces/ICommand";
import { ISeasonsClub } from "../interfaces/IClub";
import format, { consts } from "../localization";

function formatFoundMultipleClubs(query: string, clubs: ISeasonsClub[]): RichEmbed {
  const result = new RichEmbed()
    .setColor("#0099ff")
    .setAuthor(`Итоги поиска по клубам ("${query}"):`)
    .setTitle(`Найдено ${format("club", clubs.length)}`)
    .setFooter("Укажите точное название для получения полной информации");

  clubs.forEach((club, i) => {
    const seasons_count = club.club.seasons_count ? `${format("season", club.club.seasons_count)}` : "новый клуб";
    result
      .addField(`${i + 1}. ${club.club.lol_name} (*${seasons_count}*)`, `#${club.rank} в сезоне, ${club.points}pt`);
  });

  return result;
}

function formatFoundOneClub(club: ISeasonsClub, stage_data: { number: number, place: string } | undefined): RichEmbed {
  const club_owner = club.club.owner?.summoner_name || "???";

  const seasons_count = club.club.seasons_count ? `${format("season", club.club.seasons_count)}` : "новый клуб";
  const description = `Владелец - ${club_owner} | ${format("participient", club.club.members_count)} | ${seasons_count}`;
  const points = `${club.points}pt`;
  const season_place = `#${club.rank} (${format("game", club.games)})`;

  const result = new RichEmbed()
    .setColor("#0099ff")
    .setTitle(`Клуб "${club.club.lol_name}"`)
    .setDescription(description)
    .addField("Общее количество очков", points)
    .addField("Место в сезоне", season_place, true);

  if (stage_data) {
    result.addField(`Место в ${stage_data.number} этапе`, stage_data.place, true);
  }

  return result;
}



module.exports = {
  name: "searchclub",
  description: "Поиск по клубам (Топ-500 сезона). Чем полнее название, тем лучше.",
  aliases: ["поиск", "search", "se"],
  usage: "search/поиск [название]",

  async execute(ctx, message, args) {
    if (!ctx.clubs) {
      throw new Error(consts.unexpectedError);
    }

    const name: string = args.join(" ").trim();
    if (!name) {
      return message.channel.send(consts.clubNameInvalid);
    }
    if (name.length < 3) {
      return message.channel.send(consts.clubNameLength);
    }

    const live_season = await ctx.clubs.getLiveSeason();
    if (live_season === undefined) {
      return message.channel.send(consts.noActiveSeason);
    }

    const clubs = await live_season.findClub(name);
    if (!clubs.length) {
      return message.channel.send(consts.clubNotFound);
    }

    if (clubs.length === 1) {
      const [club] = clubs;

      const { id: season_id, current_stage } = live_season;
      const { club: { id: club_id } } = club;

      let stage_data: { number: number, place: string } | undefined;

      if (current_stage) {
        const { id: stage_id, number } = current_stage;

        const club_stage = await ctx.clubs.getClubStage(club_id, season_id, stage_id);
        if (!club_stage) {
          return undefined;
        }

        const stage_place = club_stage.rank ? `#${club_stage.rank} (${format("game", club_stage.games)})` : `Недостаточно очков - ${club_stage.points}/1000`;
        stage_data = { number, place: stage_place };
      }

      const embed = formatFoundOneClub(club, stage_data);
      return message.channel.send(embed);
    } else {
      const embed = formatFoundMultipleClubs(name, clubs);
      return message.channel.send(embed);
    }
  }
} as ICommand;
