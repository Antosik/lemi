import { Client, Guild, Message, RichEmbed } from "discord.js";
import { formatDate, reformatDate, boldIF, underlineIF } from "./helpers";

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
    if (message.author.bot) return;
    if (message.content.indexOf(this.config.prefix) !== 0) return;

    const args = message.content.slice(this.config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    const result = await this.handleCommand(command, args);
    await message.channel.send(result);
  }

  private async handleCommand(command: string, args: string[]) {
    const live_season = await this.clubs.getLiveSeason();
    if (!live_season) return "Нет активных сезонов!";

    console.log(command, args)
    switch (command) {
      case "topseason": {
        const count = Number(args[0]) || 10;
        const top10 = await this.clubs.getTopNSeason(live_season, count);

        const start_date = reformatDate(live_season.start_date, "yyyy-MM-dd", "dd.MM.yyyy");
        const end_date = reformatDate(live_season.end_date, "yyyy-MM-dd", "dd.MM.yyyy");
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
        const stages = await this.clubs.getStages(live_season);

        const start_date = reformatDate(live_season.start_date, "yyyy-MM-dd", "dd.MM.yyyy");
        const end_date = reformatDate(live_season.end_date, "yyyy-MM-dd", "dd.MM.yyyy");

        const result = new RichEmbed()
          .setColor('#0099ff')
          .setURL(`https://clubs.ru.leagueoflegends.com/rating?ssid=${live_season.id}&stid=0`)
          .setAuthor(`Информация о сезоне`)
          .setTitle(`Сезон ${live_season.title}`)
          .setDescription(`${start_date} - ${end_date}`)

        stages.forEach(stage => {
          const start_date = reformatDate(stage.start_date, "yyyy-MM-dd", "dd.MM.yyyy");
          const end_date = reformatDate(stage.end_date, "yyyy-MM-dd", "dd.MM.yyyy");

          const is_live = stage.is_open && !stage.is_closed;

          const title = boldIF(`Этап ${stage.number}`, is_live);
          const description = boldIF(`${start_date} - ${end_date}`, is_live);

          result.addField(title, description)
        })

        return result;
      };

      case "myclub": {
        const live_stage = await this.clubs.getLiveStage();
        const club = await this.clubs.getHomeClub(live_season);
        const clubs_on_stage = await this.clubs.getHomeClubStage(live_stage);
        const club_on_stage = clubs_on_stage.filter(stage_club => stage_club.club.id === club.club.id)[0];

        const title = `${club.club.members_count} участников | Владелец - ${club.club.owner.summoner_name}`;
        const points = `${club.points}pt`;
        const season_place = `#${club.rank}`;
        const stage_place = club_on_stage && club_on_stage.id ? `#${club_on_stage.rank}` : "Нет места";

        const result = new RichEmbed()
          .setColor('#0099ff')
          .setAuthor(`Клуб "${club.club.lol_name}"`)
          .setTitle(title)
          .addField(`Текущее количество очков`, points)
          .addField(`Текущее место в сезоне`, season_place)
          .addField(`Текущее место в этапе`, stage_place)

        return result;
      }

      case "myclubmembers": {
        const count = Number(args[0]) || 10;
        const live_stage = await this.clubs.getLiveStage();
        const club = await this.clubs.getHomeClub(live_season);
        const members = await this.clubs.getHomeClubStageMembers(live_stage, count);

        const start_date = reformatDate(live_stage.start_date, "yyyy-MM-dd", "dd.MM.yyyy");
        const end_date = reformatDate(live_stage.end_date, "yyyy-MM-dd", "dd.MM.yyyy");
        const now = formatDate(new Date(), "HH:mm:ss dd.MM.yyyy");

        const result = new RichEmbed()
          .setColor('#0099ff')
          .setURL(`https://clubs.ru.leagueoflegends.com/rating?ssid=${live_season.id}&stid=${live_stage.id}`)
          .setAuthor(`Рейтинг игроков клуба ${club.club.lol_name}`)
          .setTitle(`Сезон "${live_season.title}". Этап ${live_stage.number}`)
          .setDescription(`${start_date} - ${end_date}`)
          .setFooter(now);

        members.forEach((member, i) => {
          const title = boldIF(`${i + 1}. ${member.summoner.summoner_name}`, i < 3);
          const description = `${member.points}pt - ${member.games} игр`;
          result.addField(title, description)
        })

        return result;
      }

      default:
        return "Извините, данная команда не найдена";
    }
  }
}