import { format as formatDate, formatDistance } from "date-fns";
import { ru } from "date-fns/locale";
import { Client, DMChannel, GroupDMChannel, Guild, Message, RichEmbed } from "discord.js";

import { boldIF } from "./helpers";
import format, { consts } from "./localization";
import ClubsClient from "./lol";

export interface ILemiConfig {
  discord_token: string;
  lol_token: string;
  prefix: string;
}

export default class Lemi {
  private config: ILemiConfig;
  private client: Client;
  private clubs: ClubsClient;

  constructor(config: ILemiConfig) {
    if (!config.discord_token) {
      throw new Error("No discord token passed!");
    }

    this.config = config;
    this.client = undefined;
    this.clubs = undefined;
  }

  public async run() {
    if (this.client) {
      this.client.destroy();
    }

    this.client = this.initDiscord();
    this.clubs = this.initClubs();

    return this.client.login(this.config.discord_token);
  }

  public async stop() {
    if (this.client) {
      await this.client.destroy();
    }

    this.clubs = undefined;
  }

  private initDiscord() {
    const client = new Client();

    client.on("ready", () => this.onReady());
    client.on("guildCreate", (guild) => this.onGuildCreate(guild));
    client.on("guildDelete", (guild) => this.onGuildDelete(guild));
    client.on("message", (message) => this.onMessage(message));

    return client;
  }

  private initClubs() {
    const client = new ClubsClient();
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
    if (message.channel instanceof DMChannel || message.channel instanceof GroupDMChannel) {
      return;
    }
    if (message.author.bot) {
      return;
    }
    if (message.content.indexOf(this.config.prefix) !== 0) {
      return;
    }

    const args = message.content.slice(this.config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    const result = await this.handleCommand(command, args);
    await message.channel.send(result);
  }

  private async handleCommand(command: string, args: string[]) {
    console.log(command, args);

    try {
      switch (command) {
        case "topseason":
        case "топсезона": {
          const live_season = await this.clubs.getLiveSeason();
          if (!live_season) {
            return consts.noActiveSeason;
          }

          const count = Number(args[0]) || 10;
          const top10 = await live_season.getTopN(count);

          const start_date = formatDate(live_season.start_date, "dd.MM.yyyy");
          const end_date = formatDate(live_season.end_date, "dd.MM.yyyy");
          const now = formatDate(new Date(), "HH:mm:ss dd.MM.yyyy");

          const result = new RichEmbed()
            .setColor("#0099ff")
            .setURL(`https://clubs.ru.leagueoflegends.com/rating?ssid=${live_season.id}&stid=0`)
            .setTitle(`Рейтинг клубов`)
            .setDescription(`Сезон "${live_season.title}" (${start_date} - ${end_date})`)
            .setFooter(now);

          top10.forEach((club) => {
            const title = boldIF(`${club.rank}. ${club.club.lol_name}`, club.rank <= 3);
            const description = `${club.points}pt - ${format("player", club.club.members_count)}`;
            result.addField(title, description);
          });

          return result;
        }

        case "seasoninfo":
        case "сезон": {
          const live_season = await this.clubs.getLiveSeason();
          if (!live_season) {
            return consts.noActiveSeason;
          }

          const stages = await live_season.getStages();

          const start_date = formatDate(live_season.start_date, "dd.MM.yyyy");
          const end_date = formatDate(live_season.end_date, "dd.MM.yyyy");

          const result = new RichEmbed()
            .setColor("#0099ff")
            .setURL(`https://clubs.ru.leagueoflegends.com/rating?ssid=${live_season.id}&stid=0`)
            .setTitle(`Информация о сезоне "${live_season.title}"`);

          if (live_season.isEnded()) {
            result.setDescription(`**Сезон окончен!** (Даты сезона: ${start_date} - ${end_date})`);
          } else {
            result.setDescription(`Даты сезона: ${start_date} - ${end_date}`);
          }

          stages.forEach((stage) => {
            const stage_start_date = formatDate(stage.start_date, "dd.MM.yyyy");
            const stage_end_date = formatDate(stage.end_date, "dd.MM.yyyy");

            const title = boldIF(`Этап ${stage.number}`, stage.is_live);
            const description = boldIF(`${stage_start_date} - ${stage_end_date}`, stage.is_live);

            result.addField(title, description);
          });

          return result;
        }

        case "searchclub":
        case "поиск": {
          const name = args.join(" ").trim();
          if (!name) {
            return consts.clubNameInvalid;
          }
          if (name.length < 3) {
            return consts.clubNameLength;
          }

          const live_season = await this.clubs.getLiveSeason();
          const clubs = await live_season.findClub(name);
          if (!clubs.length) {
            return consts.clubNotFound;
          }

          if (clubs.length === 1) {
            const [club] = clubs;

            const description = `Владелец - ${club.club.owner.summoner_name} | ${format("participient", club.club.members_count)}`;
            const points = `${club.points}pt`;
            const season_place = `#${club.rank} (${format("game", club.games)})`;

            const result = new RichEmbed()
              .setColor("#0099ff")
              .setTitle(`Клуб "${club.club.lol_name}"`)
              .setDescription(description)
              .addField(`Общее количество очков`, points)
              .addField(`Место в сезоне`, season_place, true);

            return result;
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

            return result;
          }
        }

        case "time":
        case "время": {
          let type = args[0] || "stage";

          if (type !== "stage" && type !== "season" && type !== "сезон" && type !== "этап") {
            type = "stage";
          }

          const live_season = await this.clubs.getLiveSeason();
          if (live_season.isEnded()) {
            if (type === "stage" || type === "этап") {
              return consts.noActiveStage;
            }
            return consts.noActiveSeason;
          }

          if (type === "stage" || type === "этап") {
            if (!live_season.current_stage) {
              return consts.noActiveStage;
            }

            const end_date = live_season.current_stage.end_date;
            const distance = formatDistance(end_date, new Date(), {
              locale: ru
            });

            return `${consts.timeToStageEnd}: **${distance}**`;
          } else {
            if (live_season.end_date < new Date()) {
              return consts.noActiveSeason;
            }

            const end_date = live_season.end_date;
            const distance = formatDistance(end_date, new Date(), {
              locale: ru
            });

            return `${consts.timeToSeasonEnd}: **${distance}**`;
          }
        }

        case "help":
        case "commands":
        case "помощь":
        case "команды": {
          const result = new RichEmbed()
            .setColor("#0099ff")
            .setTitle(`Доступные команды`)
            .setDescription(`Используйте префикс \`${this.config.prefix}\` перед командой.`)
            .addField(`• \`seasoninfo/сезон\``, `Отображает общую информацию о текущем сезоне.`)
            .addField(`• \`topseason/топсезона [количество мест]\``, `Показывает топ сезона.`)
            .addField(`• \`searchclub/поиск [название]\``, `Поиск по клубам (Топ-500). Чем полнее название, тем лучше.`)
            .addField(`• \`time/время [season/stage]\``, `Показывает оставшееся время до конца сезона/этапа.`)
            .addField(`• \`help/команды\``, `Показывает данное сообщение.`)
            .setFooter(`Made with <3 by @Antosik#6224`);

          return result;
        }

        default:
          return consts.commandNotFound;
      }
    } catch (e) {
      console.error(e);
      const result = new RichEmbed()
        .setColor("#ff9900")
        .setTitle(`Произошла ошибка :c`)
        .setDescription(`${e.message}`);
      return result;
    }
  }
}
