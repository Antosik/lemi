import { ICommand } from "../../interfaces/ICommand";
import format, { consts } from "../../localization";

import { generateFoundOneClubEmbed, generateFoundMultipleClubsEmbed } from "./embed";

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

      const embed = generateFoundOneClubEmbed({
        club,
        stage_data
      });
      return message.channel.send(embed);
    } else {
      const embed = generateFoundMultipleClubsEmbed({
        query: name,
        clubs
      });
      return message.channel.send(embed);
    }
  }
} as ICommand;
