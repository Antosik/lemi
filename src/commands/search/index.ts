import { ICommand } from "../../interfaces/ICommand";
import { consts } from "../../localization";

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
      const [club_season] = clubs;
      const { club: { id: club_id } } = club_season;

      const live_stage = live_season.current_stage;
      const club_stage = await live_stage?.getClub(club_id);

      const embed = generateFoundOneClubEmbed({
        club_season,
        club_stage,
        stage_index: live_stage?.index
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
