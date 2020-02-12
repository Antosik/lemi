import { ICommand } from "../../interfaces/ICommand";
import { consts } from "../../localization";

import { generateClubEmbed } from "./embed";

module.exports = {
  name: "myclub",
  description: "Информация о вашем клубе.",
  aliases: ["клуб", "club", "c"],
  usage: "club/клуб",

  async execute(ctx, message, args) {
    if (!ctx.clubs) {
      throw new Error(consts.unexpectedError);
    }

    const stage_index: number | undefined = Number(args[0]) || undefined;

    const [live_season, homeclub] = await Promise.all([ctx.clubs.getLiveSeason(), ctx.clubs.getHomeClub()]);
    if (homeclub === undefined) {
      return message.channel.send(consts.clubNotSelected);
    }

    const stage = live_season?.getStageIdByIndex(stage_index);
    let stage_data: { number: number, place: string } | undefined;

    if (stage) {
      const stage_clubs = await homeclub.getStageClubs(stage.id);
      const homeclub_stage = stage_clubs.find((stage_club) => stage_club.club.id === homeclub.id);
      const stage_place = homeclub_stage && homeclub_stage.id ? `#${homeclub_stage.rank}` : consts.noPlaceInTop;

      stage_data = { number: stage.number, place: stage_place };
    }

    const homeclub_season = await homeclub.getSeason();

    const embed = generateClubEmbed({
      homeclub,
      homeclub_season,
      stage_data
    });
    return message.channel.send(embed);
  }
} as ICommand;
