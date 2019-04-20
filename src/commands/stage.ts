import { format as formatDate } from "date-fns";
import { RichEmbed } from "discord.js";

import { IStageClub } from "../interfaces/IClub";
import { ICommand } from "../interfaces/ICommand";
import format, { consts } from "../localization";

import { createPagedMessage } from "../helpers/discord";
import { boldIF, underlineIF } from "../helpers/functions";

module.exports = {
  name: "myclubstage",
  description: "Топ этапа вашего клуба.",
  aliases: ["этап", "stage", "topstage", "st"],
  usage: "stage/этап [номер этапа (1-3)]",

  async execute(ctx, message, args) {
    const stage_index: number = Number(args[0]) || undefined;

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
      const group_size = 5;
      const { games_count, points_needed } = await homeclub.calculateStage(stage.id, { group_size });
      const result_not = `Ваш клуб не участвует в этапе.\nЧтобы участвовать, нужно заработать ${format("point", points_needed)}, выиграв **${format("gameToPlay", games_count)}** (составом из ${format("player", group_size)})`;
      return message.channel.send(result_not);
    }

    const start_date = formatDate(stage.start_date, "dd.MM.yyyy");
    const end_date = formatDate(stage.end_date, "dd.MM.yyyy");
    const now = formatDate(new Date(), "HH:mm:ss dd.MM.yyyy");

    const template = new RichEmbed()
      .setColor("#0099ff")
      .setURL(`https://clubs.ru.leagueoflegends.com/rating?ssid=${live_season.id}&stid=${stage.id}`)
      .setTitle(`Рейтинг клубов`)
      .setDescription(`Сезон "${live_season.title}". Этап ${stage.number} (${start_date} - ${end_date})`)
      .setFooter(now);

    const count = 10;
    const pages_count = Math.ceil(stage_clubs.length / count);
    let stage_clubs_slice = stage_clubs.slice(0, count);
    let result = formatStage(template, stage_clubs_slice);

    const stage_clubs_message_r = await message.channel.send(result);
    const stage_clubs_message = Array.isArray(stage_clubs_message_r) ? stage_clubs_message_r[0] : stage_clubs_message_r;

    if (pages_count > 1) {
      await createPagedMessage(
        stage_clubs_message,
        async (page, reaction) => {
          const index_start = (page - 1) * count + 1;

          stage_clubs_slice = stage_clubs.slice((page - 1) * count, page * count);
          result = formatStage(template, stage_clubs_slice, index_start);
          result.setFooter(`Страница ${page} • ${now}`);
          await stage_clubs_message.edit(result);
        },
        {
          filter: (r, user) => user.id === message.author.id,
          pages_count
        }
      );
    }

    function formatStage(embed: RichEmbed, clubs: IStageClub[], index_start = 1): RichEmbed {
      const res = new RichEmbed(embed);
      res.fields = [];

      clubs.forEach((club, i) => {
        const title = underlineIF(boldIF(`${club.rank}. ${club.club.lol_name}`, club.rank <= 3), homeclub.id === club.club.id);
        const description = `${club.points}pt - ${format("player", club.club.members_count)}`;
        res.addField(title, description);
      });

      return res;
    }
  }
} as ICommand;
