import { Client, Guild, Message, RichEmbed } from "discord.js";
import { formatDate, reformatDate, boldIF, underlineIF } from "./helpers";

import ClubsClient from "./lol";
import { ICurrentSeason } from "interfaces/ISeason";

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
    if (message.author.bot) return;
    if (message.content.indexOf(this.config.prefix) !== 0) return;

    const args = message.content.slice(this.config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    const result = await this.handleCommand(command, args);
    await message.channel.send(result);
  }

  private async handleCommand(command: string, args: string[]) {
    console.log(command, args)

    switch (command) {
      case "topseason": {
        const live_season = await this.clubs.getLiveSeason();
        if (!live_season) return "Нет активных сезонов!";

        const count = Number(args[0]) || 10;
        const top10 = await live_season.getTopN(count);

        const start_date = formatDate(live_season.start_date, "dd.MM.yyyy");
        const end_date = formatDate(live_season.end_date, "dd.MM.yyyy");
        const now = formatDate(new Date(), "HH:mm:ss dd.MM.yyyy");

        const result = new RichEmbed()
          .setColor('#0099ff')
          .setURL(`https://clubs.ru.leagueoflegends.com/rating?ssid=${live_season.id}&stid=0`)
          .setAuthor(`Рейтинг клубов`)
          .setTitle(`Сезон ${live_season.title}`)
          .setDescription(`${start_date} - ${end_date}`)
          .setFooter(now);

        top10.forEach(club => {
          const title = boldIF(`${club.rank}. ${club.club.lol_name}`, club.rank <= 3);
          const description = `${club.points}pt - ${club.club.members_count} игроков`;
          result.addField(title, description)
        })

        return result;
      };

      case "seasoninfo": {
        const live_season = await this.clubs.getLiveSeason();
        if (!live_season) return "Нет активных сезонов!";

        const stages = await live_season.getStages();

        const start_date = formatDate(live_season.start_date, "dd.MM.yyyy");
        const end_date = formatDate(live_season.end_date, "dd.MM.yyyy");

        const result = new RichEmbed()
          .setColor('#0099ff')
          .setURL(`https://clubs.ru.leagueoflegends.com/rating?ssid=${live_season.id}&stid=0`)
          .setAuthor(`Информация о сезоне`)
          .setTitle(`Сезон ${live_season.title}`)
          .setDescription(`${start_date} - ${end_date}`)

        stages.forEach(stage => {
          const start_date = formatDate(stage.start_date, "dd.MM.yyyy");
          const end_date = formatDate(stage.end_date, "dd.MM.yyyy");

          const title = boldIF(`Этап ${stage.number}`, stage.is_live);
          const description = boldIF(`${start_date} - ${end_date}`, stage.is_live);

          result.addField(title, description)
        })

        return result;
      };

      case "myclub": {
        const stage_index = Number(args[0]) || undefined;

        const [live_season, homeclub] = await Promise.all([this.clubs.getLiveSeason(), this.clubs.getHomeClub()]);
        const stage = live_season.getStageIdByIndex(stage_index);
        if (!stage) {
          return "Этап не найден!"
        }

        const [stage_clubs, homeclub_season] = await Promise.all([homeclub.getStageClubs(stage.id), homeclub.getSeason()]);
        const homeclub_stage = stage_clubs.find(stage_club => stage_club.club.id === homeclub.id);

        const title = `Владелец - ${homeclub.owner_name} | ${homeclub.members_count} участников`;
        const points = `${homeclub_season.points}pt`;
        const season_place = `#${homeclub_season.rank}`;
        const stage_place = homeclub_stage && homeclub_stage.id ? `#${homeclub_stage.rank}` : "Нет места";

        const result = new RichEmbed()
          .setColor('#0099ff')
          .setURL(`https://clubs.ru.leagueoflegends.com/progress`)
          .setAuthor(`Клуб "${homeclub.name}"`)
          .setTitle(title)
          .addField(`Общее количество очков`, points)
          .addField(`Место в сезоне`, season_place)
          .addField(`Место в ${stage.number} этапе`, stage_place)

        return result;
      }

      case "myclubmembers": {
        const count = Number(args[0]) || 10;
        const stage_index = Number(args[1]) || undefined;

        const [live_season, homeclub] = await Promise.all([this.clubs.getLiveSeason(), this.clubs.getHomeClub()]);
        const stage = live_season.getStageIdByIndex(stage_index);
        if (!stage) {
          return "Этап не найден!"
        }

        const members = await homeclub.getStageMembers(stage.id, count);

        const start_date = formatDate(stage.start_date, "dd.MM.yyyy");
        const end_date = formatDate(stage.end_date, "dd.MM.yyyy");
        const now = formatDate(new Date(), "HH:mm:ss dd.MM.yyyy");

        const result = new RichEmbed()
          .setColor('#0099ff')
          .setURL(`https://clubs.ru.leagueoflegends.com/club/member`)
          .setAuthor(`Рейтинг игроков клуба "${homeclub.name}"`)
          .setTitle(`Сезон "${live_season.title}". Этап ${stage.number}`)
          .setDescription(`${start_date} - ${end_date}`)
          .setFooter(now);

        members.forEach((member, i) => {
          const title = boldIF(`${i + 1}. ${member.summoner.summoner_name}`, i < 3);
          const description = `${member.points}pt - ${member.games} игр`;
          result.addField(title, description)
        })

        return result;
      }

      case "myclubstage": {
        const count = Number(args[0]) || 10;
        const stage_index = Number(args[1]) || undefined;

        const [live_season, homeclub] = await Promise.all([this.clubs.getLiveSeason(), this.clubs.getHomeClub()]);
        const stage = live_season.getStageIdByIndex(stage_index);
        if (!stage) {
          return "Этап не найден!"
        }

        const stage_clubs = await homeclub.getStageClubs(stage.id);
        const homeclub_stage = stage_clubs.find(stage_club => stage_club.club.id === homeclub.id);

        if (!homeclub_stage || !homeclub_stage.id) return "Недостаточно очков для участия в этапе!";

        const start_date = formatDate(stage.start_date, "dd.MM.yyyy");
        const end_date = formatDate(stage.end_date, "dd.MM.yyyy");
        const now = formatDate(new Date(), "HH:mm:ss dd.MM.yyyy");

        const result = new RichEmbed()
          .setColor('#0099ff')
          .setURL(`https://clubs.ru.leagueoflegends.com/rating?ssid=${live_season.id}&stid=${stage.id}`)
          .setAuthor(`Рейтинг клубов`)
          .setTitle(`Сезон "${live_season.title}". Этап ${stage.number}`)
          .setDescription(`${start_date} - ${end_date}`)
          .setFooter(now);

        stage_clubs.slice(0, count).forEach(stage_club => {
          const title = underlineIF(boldIF(`${stage_club.rank}. ${stage_club.club.lol_name}`, stage_club.rank <= 3), homeclub.id === stage_club.club.id);
          const description = `${stage_club.points}pt - ${stage_club.club.members_count} игроков`;
          result.addField(title, description)
        })

        if (stage_clubs.indexOf(homeclub_stage) > count) {
          const title = underlineIF(boldIF(`${homeclub_stage.rank}. ${homeclub_stage.club.lol_name}`, homeclub_stage.rank <= 3), homeclub.id === homeclub_stage.club.id);
          const description = `${homeclub_stage.points}pt - ${homeclub_stage.club.members_count} игроков`;
          result.addField(title, description)
        } 

        return result;
      }

      case "searchclub": {
        const name = args.join(" ");
        if (!name.trim()) return "Введите название клуба"
        if (name.length < 3) return "Имя клуба должно быть больше 2 символов"

        const live_season = await this.clubs.getLiveSeason();
        const clubs = await live_season.findClub(name);
        if (!clubs.length) return "Клубов с таким названием не найдено (или они не в топ500)"

        if (clubs.length === 1) {
          const [club] = clubs;

          const title = `${club.club.members_count} участников | Владелец - ${club.club.owner.summoner_name}`;
          const points = `${club.points}pt`;
          const season_place = `#${club.rank}`;

          const result = new RichEmbed()
            .setColor('#0099ff')
            .setAuthor(`Клуб "${club.club.lol_name}"`)
            .setTitle(title)
            .addField(`Текущее количество очков`, points)
            .addField(`Текущее место в сезоне`, season_place)
          return result;
        }

        const result = new RichEmbed()
          .setColor('#0099ff')
          .setAuthor(`Итоги поиска по клубам ("${name}"):`)
          .setTitle(`Найдено ${clubs.length} клубов`)
          .setFooter(`Укажите точное название для получения полной информации`);
        clubs.forEach((club, i) => {
          result
            .addField(`${i + 1}. ${club.club.lol_name}`, `#${club.rank} в сезоне, ${club.points}pt`)
        });
        return result;
      }

      case "help":
      case "commands": {
        const result = new RichEmbed()
          .setColor('#0099ff')
          .setTitle(`Доступные команды`)
          .addField(`${this.config.prefix}seasoninfo`, `Отображает общую информацию о действующем сезоне.`)
          .addField(`${this.config.prefix}topseason {количество}`, `Показывает топ сезона. \nПример использования: \`${this.config.prefix}topseason\` или \`${this.config.prefix}topseason 10\``)
          .addField(`${this.config.prefix}searchclub {название}`, `Поиск по клубам (топ-500). Чем полнее название, тем лучше`)
          .addField(`${this.config.prefix}myclub`, `Отображает информацию о ~~ вашем клубе ~~  клубе создателя *(пока что)*.`)
          .addField(`${this.config.prefix}myclubstage {количество клубов} {номер этапа (1-3)}`, `Показывает топ этапа ~~ вашего клуба ~~  клуба создателя *(пока что)*. \nПример использования: \`${this.config.prefix}myclubstage\`, \`${this.config.prefix}myclubstage 3\`, \`${this.config.prefix}myclubstage 3 1\``)
          .addField(`${this.config.prefix}myclubmembers {количество участников} {номер этапа (1-3)}`, `Отображает информацию об очках, заработанных участниками ~~ вашего клубе ~~  клуба создателя *(пока что)*. \nПример использования: \`${this.config.prefix}myclubmembers\`, \`${this.config.prefix}myclubmembers 3\`, \`${this.config.prefix}myclubmembers 3 1\``)
          .setFooter(`Made with <3 by Antosik#6224`);

        return result;
      }


      default:
        return "Извините, данная команда не найдена";
    }
  }
}