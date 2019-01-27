import { Client, Guild, Message, RichEmbed, DMChannel, GroupDMChannel } from "discord.js";
import { format as formatDate } from "date-fns";

import { boldIF, underlineIF } from "./helpers";
import format, { consts } from "./localization";
import ClubsClient from "./lol";

export interface LemiConfig {
  discord_token: string;
  lol_token: string;
  prefix: string;
}

export default class Lemi {
  private config: LemiConfig;
  private client: Client;
  private clubs: ClubsClient;

  constructor(config: LemiConfig) {
    this.config = config;
    this.client = undefined;
    this.clubs = undefined;
  }

  public run() {
    if (this.client) this.client.destroy();

    this.client = this.initDiscord();
    this.clubs = this.initClubs();

    this.client.login(this.config.discord_token);
  }

  private initDiscord() {
    const client = new Client();

    client.on("ready", () => this.onReady());
    client.on("guildCreate", guild => this.onGuildCreate(guild));
    client.on("guildDelete", guild => this.onGuildDelete(guild));
    client.on("message", message => this.onMessage(message));

    return client;
  }

  private initClubs() {
    const client = new ClubsClient(this.config.lol_token);
    return client;
  }

  private onReady() {
    console.log(`Bot has started, with ${this.client.users.size} users, in ${this.client.channels.size} channels of ${this.client.guilds.size} guilds.`);
    this.client.user.setActivity(`League of Legends`);
  }
  private onGuildCreate(guild: Guild) {
    console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  }
  private onGuildDelete(guild: Guild) {
    console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  }

  private async onMessage(message: Message) {
    if (message.channel instanceof DMChannel || message.channel instanceof GroupDMChannel) return;
    if (message.author.bot) return;
    if (message.content.indexOf(this.config.prefix) !== 0) return;

    const args = message.content.slice(this.config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    const result = await this.handleCommand(command, args);
    await message.channel.send(result);
  }

  private async handleCommand(command: string, args: string[]) {
    console.log(command, args)

    try {
      switch (command) {
        case "topseason":
        case "топсезона": {
          const live_season = await this.clubs.getLiveSeason();
          if (!live_season) return consts.noActiveSeason;

          const count = Number(args[0]) || 10;
          const top10 = await live_season.getTopN(count);

          const start_date = formatDate(live_season.start_date, "dd.MM.yyyy");
          const end_date = formatDate(live_season.end_date, "dd.MM.yyyy");
          const now = formatDate(new Date(), "HH:mm:ss dd.MM.yyyy");

          const result = new RichEmbed()
            .setColor('#0099ff')
            .setURL(`https://clubs.ru.leagueoflegends.com/rating?ssid=${live_season.id}&stid=0`)
            .setTitle(`Рейтинг клубов`)
            .setDescription(`Сезон "${live_season.title}" (${start_date} - ${end_date})`)
            .setFooter(now);

          top10.forEach(club => {
            const title = boldIF(`${club.rank}. ${club.club.lol_name}`, club.rank <= 3);
            const description = `${club.points}pt - ${format("player", club.club.members_count)}`;
            result.addField(title, description)
          })

          return result;
        };

        case "seasoninfo":
        case "сезон": {
          const live_season = await this.clubs.getLiveSeason();
          if (!live_season) return consts.noActiveSeason;

          const stages = await live_season.getStages();

          const start_date = formatDate(live_season.start_date, "dd.MM.yyyy");
          const end_date = formatDate(live_season.end_date, "dd.MM.yyyy");

          const result = new RichEmbed()
            .setColor('#0099ff')
            .setURL(`https://clubs.ru.leagueoflegends.com/rating?ssid=${live_season.id}&stid=0`)
            .setTitle(`Информация о сезоне "${live_season.title}"`)
          
          if (live_season.isEnded()) {
            result.setDescription(`**Сезон окончен!** (Даты сезона: ${start_date} - ${end_date})`)
          } else {
            result.setDescription(`Даты сезона: ${start_date} - ${end_date}`)
          }

          stages.forEach(stage => {
            const start_date = formatDate(stage.start_date, "dd.MM.yyyy");
            const end_date = formatDate(stage.end_date, "dd.MM.yyyy");

            const title = boldIF(`Этап ${stage.number}`, stage.is_live);
            const description = boldIF(`${start_date} - ${end_date}`, stage.is_live);

            result.addField(title, description)
          })

          return result;
        };

        case "myclub":
        case "клуб": {
          const stage_index = Number(args[0]) || undefined;

          const [live_season, homeclub] = await Promise.all([this.clubs.getLiveSeason(), this.clubs.getHomeClub()]);

          const stage = live_season.getStageIdByIndex(stage_index);
          let stage_data: { number: number, place: string } = undefined;

          if (stage) {
            const stage_clubs = await homeclub.getStageClubs(stage.id);
            const homeclub_stage = stage_clubs.find(stage_club => stage_club.club.id === homeclub.id);
            const stage_place = homeclub_stage && homeclub_stage.id ? `#${homeclub_stage.rank}` : consts.noPlaceInTop;

            stage_data = { number: stage.number, place: stage_place };
          }

          const homeclub_season = await homeclub.getSeason();
          const description = `Владелец - ${homeclub.owner_name} | ${format("participient", homeclub.members_count)}`;
          const points = `${homeclub_season.points}pt`;
          const season_place = `#${homeclub_season.rank}`;

          const result = new RichEmbed()
            .setColor('#0099ff')
            .setURL(`https://clubs.ru.leagueoflegends.com/progress`)
            .setTitle(`Клуб "${homeclub.name}"`)
            .setDescription(description)
            .addField(`Общее количество очков`, points)
            .addField(`Место в сезоне`, season_place, true)

          if (stage_data) {
            result.addField(`Место в ${stage_data.number} этапе`, stage_data.place, true);
          }

          return result;
        }

        case "myclubmembers":
        case "участники": {
          const stage_index = Number(args[0]) || undefined;
          const count = Number(args[1]) || 10;

          const [live_season, homeclub] = await Promise.all([this.clubs.getLiveSeason(), this.clubs.getHomeClub()]);
          if (!stage_index && live_season.isEnded()) {
            return consts.noActiveStage;
          }

          const stage = live_season.getStageIdByIndex(stage_index);
          if (!stage) {
            return consts.stageNotFound;
          }

          const members = await homeclub.getStageMembers(stage.id, count);

          const start_date = formatDate(stage.start_date, "dd.MM.yyyy");
          const end_date = formatDate(stage.end_date, "dd.MM.yyyy");
          const now = formatDate(new Date(), "HH:mm:ss dd.MM.yyyy");

          const result = new RichEmbed()
            .setColor('#0099ff')
            .setURL(`https://clubs.ru.leagueoflegends.com/club/member`)
            .setTitle(`Рейтинг игроков клуба "${homeclub.name}"`)
            .setDescription(`Сезон "${live_season.title}". Этап ${stage.number} (${start_date} - ${end_date})`)
            .setFooter(now);

          members.forEach((member, i) => {
            const title = boldIF(`${i + 1}. ${member.summoner.summoner_name}`, i < 3);
            const description = `${member.points}pt - ${format("game", member.games)}`;
            result.addField(title, description)
          })

          return result;
        }

        case "myclubstage":
        case "этап": {
          const stage_index = Number(args[0]) || undefined;
          const count = Number(args[1]) || 10;

          const [live_season, homeclub] = await Promise.all([this.clubs.getLiveSeason(), this.clubs.getHomeClub()]);
          if (!stage_index && live_season.isEnded()) {
            return consts.noActiveStage;
          }

          const stage = live_season.getStageIdByIndex(stage_index);
          if (!stage) {
            return consts.stageNotFound;
          }

          const stage_clubs = await homeclub.getStageClubs(stage.id);
          const homeclub_stage = stage_clubs.find(stage_club => stage_club.club.id === homeclub.id);

          if (!homeclub_stage || !homeclub_stage.id) return consts.noEnoughPt;

          const start_date = formatDate(stage.start_date, "dd.MM.yyyy");
          const end_date = formatDate(stage.end_date, "dd.MM.yyyy");
          const now = formatDate(new Date(), "HH:mm:ss dd.MM.yyyy");

          const result = new RichEmbed()
            .setColor('#0099ff')
            .setURL(`https://clubs.ru.leagueoflegends.com/rating?ssid=${live_season.id}&stid=${stage.id}`)
            .setTitle(`Рейтинг клубов`)
            .setDescription(`Сезон "${live_season.title}". Этап ${stage.number} (${start_date} - ${end_date})`)
            .setFooter(now);

          stage_clubs
            .filter(stage_club => stage_club.rank <= count)
            .forEach(stage_club => {
              const title = underlineIF(boldIF(`${stage_club.rank}. ${stage_club.club.lol_name}`, stage_club.rank <= 3), homeclub.id === stage_club.club.id);
              const description = `${stage_club.points}pt - ${format("player", stage_club.club.members_count)}`;
              result.addField(title, description)
            })

          if (homeclub_stage.rank > count) {
            const title = underlineIF(boldIF(`${homeclub_stage.rank}. ${homeclub_stage.club.lol_name}`, homeclub_stage.rank <= 3), homeclub.id === homeclub_stage.club.id);
            const description = `${homeclub_stage.points}pt - ${format("player", homeclub_stage.club.members_count)}`;
            result.addField(title, description)
          }

          return result;
        }

        case "searchclub":
        case "поиск": {
          const name = args.join(" ").trim();
          if (!name) return consts.clubNameInvalid;
          if (name.length < 3) return consts.clubNameLength;

          const live_season = await this.clubs.getLiveSeason();
          const clubs = await live_season.findClub(name);
          if (!clubs.length) return consts.clubNotFound;

          if (clubs.length === 1) {
            const [club] = clubs;

            const { id: season_id, current_stage } = live_season;
            const { club: { id: club_id } } = club;

            let stage_data: { number: number, place: string } = undefined;

            if (current_stage) {
              const { id: stage_id, number } = current_stage;

              const club_stage = await this.clubs.getClubStage(club_id, season_id, stage_id);
              const stage_place = club_stage.rank ? `#${club_stage.rank} (${format("game", club_stage.games)})` : `Недостаточно очков - ${club_stage.points}/1000`;

              stage_data = { number, place: stage_place };
            }

            const description = `Владелец - ${club.club.owner.summoner_name} | ${format("participient", club.club.members_count)}`;
            const points = `${club.points}pt`;
            const season_place = `#${club.rank} (${format("game", club.games)})`;

            const result = new RichEmbed()
              .setColor('#0099ff')
              .setTitle(`Клуб "${club.club.lol_name}"`)
              .setDescription(description)
              .addField(`Общее количество очков`, points)
              .addField(`Место в сезоне`, season_place, true);

            if (stage_data) {
              result.addField(`Место в ${stage_data.number} этапе`, stage_data.place, true);
            }

            return result;
          }

          const result = new RichEmbed()
            .setColor('#0099ff')
            .setAuthor(`Итоги поиска по клубам ("${name}"):`)
            .setTitle(`Найдено ${format("club", clubs.length)}`)
            .setFooter(`Укажите точное название для получения полной информации`);
          clubs.forEach((club, i) => {
            result
              .addField(`${i + 1}. ${club.club.lol_name}`, `#${club.rank} в сезоне, ${club.points}pt`)
          });
          return result;
        }

        case "myclubcalc":
        case "расчет": {
          let type = args[0] || "stage";
          const top = Number(args[1]) || 1;
          const group_size = Number(args[2]) || 5;
          let mode = args[3] === "aram" ? 1 : 0;

          if (type !== "stage" && type !== "season" && type !== "сезон" && type !== "этап") type = "stage";

          const [live_season, homeclub] = await Promise.all([this.clubs.getLiveSeason(), this.clubs.getHomeClub()]);
          if (live_season.isEnded()) {
            return consts.noActiveStage;
          }

          if (type === "stage" || type === "этап") {
            const { current_stage: { id: stage_id } } = live_season;
            const { top: wanted, games_count, points_needed } = await homeclub.calculateStage(stage_id, { top, group_size, mode });

            if (!games_count) return consts.calcEnoughGames;
            if (!wanted) return `Ваш клуб не участвует в этапе.\nЧтобы участвовать, нужно заработать ${format("point", points_needed)}, выиграв **${format("gameToPlay", games_count)}** (составом из ${format("player", group_size)} игроков)`;
            return `Чтобы достигнуть желаемого ${wanted} места в этапе, нужно заработать ${format("point", points_needed)}, выиграв **${format("gameToPlay", games_count)}** (составом из ${format("player", group_size)} игроков)`;
          }

          const { top: wanted, games_count, points_needed } = await homeclub.calculateSeason({ top, group_size, mode });
          if (!games_count) return consts.calcEnoughGames;
          return `Чтобы достигнуть желаемого ${wanted} места в сезоне, нужно заработать ${format("point", points_needed)}, выиграв **${format("gameToPlay", games_count)}** (составом из ${format("player", group_size)} игроков)`;
        }

        case "help":
        case "commands":
        case "помощь":
        case "команды": {
          const result = new RichEmbed()
            .setColor('#0099ff')
            .setTitle(`Доступные команды`)
            .setDescription(`Используйте префикс \`${this.config.prefix}\` перед командой`)
            .addField(`• \`seasoninfo/сезон\``, `Отображает общую информацию о текущем сезоне.`)
            .addField(`• \`topseason/топсезона [количество мест]\``, `Показывает топ сезона.`)
            .addField(`• \`searchclub/поиск [название]\``, `Поиск по клубам (Топ-500). Чем полнее название, тем лучше.`)
            .addField(`• \`myclub/клуб\``, `Отображает информацию о вашем клубе.`)
            .addField(`• \`myclubstage/этап [номер этапа (1-3)] [количество клубов]\``, `Показывает топ этапа вашего клуба.`)
            .addField(`• \`myclubmembers/участники [номер этапа (1-3)] [количество участников]\``, `Отображает информацию об очках, заработанных участниками вашего клуба.`)
            .addField(`• \`myclubcalc/расчет [season/stage] [место в топе] [игроков в группе (2-5)] [aram]\``, `Отображает количество игр, которые нужно выиграть участниками вашего клуба для достижения желаего места в сезоне/этапе.`)
            .addField(`• \`help/команды\``, `Показывает данное сообщение`)
            .setFooter(`Made with <3 by @Antosik#6224`);

          return result;
        }

        default:
          return consts.commandNotFound;
      }
    } catch (e) {
      console.error(e);
      const result = new RichEmbed()
        .setColor('#ff9900')
        .setTitle(`Произошла ошибка :c`)
        .setDescription(`${e.message}`)
      return result;
    }
  }
}