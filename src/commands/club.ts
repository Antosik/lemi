import { RichEmbed } from "discord.js";

import { ICommand } from "../interfaces/ICommand";
import format, { consts } from "../localization";

module.exports = {
  name: "myclub",
  description: "Информация о вашем клубе.",
  aliases: ["клуб", "club", "c"],
  usage: "club/клуб",
  async execute(ctx, message, args) {
    const stage_index = Number(args[0]) || undefined;

    const [live_season, homeclub] = await Promise.all([ctx.clubs.getLiveSeason(), ctx.clubs.getHomeClub()]);

    const stage = live_season.getStageIdByIndex(stage_index);
    let stage_data: { number: number, place: string };

    if (stage) {
      const stage_clubs = await homeclub.getStageClubs(stage.id);
      const homeclub_stage = stage_clubs.find((stage_club) => stage_club.club.id === homeclub.id);
      const stage_place = homeclub_stage && homeclub_stage.id ? `#${homeclub_stage.rank}` : consts.noPlaceInTop;

      stage_data = { number: stage.number, place: stage_place };
    }

    const homeclub_season = await homeclub.getSeason();
    const description = `Владелец - ${homeclub.owner_name} | ${format("participient", homeclub.members_count)}`;
    const points = `${homeclub_season.points}pt`;
    const season_place = homeclub_season.rank ? `#${homeclub_season.rank}` : consts.noPlaceInTop;

    const result = new RichEmbed()
      .setColor("#0099ff")
      .setURL(`https://clubs.ru.leagueoflegends.com/progress`)
      .setTitle(`Клуб "${homeclub.name}"`)
      .setDescription(description)
      .addField(`Общее количество очков`, points)
      .addField(`Место в сезоне`, season_place, true);

    if (stage_data) {
      result.addField(`Место в ${stage_data.number} этапе`, stage_data.place, true);
    }

    await message.channel.send(result);
  }
} as ICommand;
