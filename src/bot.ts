import { Collection as DiscordCollection, DMChannel, GroupDMChannel, Guild, Message, RichEmbed } from "discord.js";
import * as fs from "fs";
import * as path from "path";

import { DiscordClient, ICommand } from "./interfaces/ICommand";
import { consts } from "./localization";
import ClubsClient from "./lol";

export interface ILemiConfig {
  discord_token: string;
  lol_token: string;
  prefix: string;
}

export default class Lemi {
  public clubs: ClubsClient;
  private config: ILemiConfig;
  private client: DiscordClient;
  private commands: DiscordCollection<string, ICommand>;

  constructor(config: ILemiConfig) {
    if (!config.discord_token) {
      throw new Error("No discord token passed!");
    }

    this.config = config;
    this.client = undefined;
    this.clubs = undefined;
    this.commands = new DiscordCollection<string, ICommand>();
  }

  public async run() {
    if (this.client) {
      this.client.destroy();
    }

    this.client = this.initDiscord();
    this.clubs = this.initClubs();
    this.commands = this.loadCommands();

    return this.client.login(this.config.discord_token);
  }

  public async stop() {
    if (this.client) {
      await this.client.destroy();
    }

    this.clubs = undefined;
  }

  public getPrefix(): string {
    return this.config.prefix;
  }

  public getAvailableCommands(): DiscordCollection<string, ICommand> {
    return new DiscordCollection(this.commands);
  }

  private initDiscord() {
    const client = new DiscordClient();

    client.on("ready", () => this.onReady());
    client.on("guildCreate", (guild) => this.onGuildCreate(guild));
    client.on("guildDelete", (guild) => this.onGuildDelete(guild));
    client.on("message", (message) => this.onMessage(message));

    return client;
  }

  private initClubs() {
    const client = new ClubsClient(this.config.lol_token);

    return client;
  }

  private loadCommands(): DiscordCollection<string, ICommand> {
    const commands = new DiscordCollection<string, ICommand>();
    const commandFiles = fs.readdirSync(path.resolve(__dirname, "./commands")).filter((file) => file.endsWith(".js"));
    for (const file of commandFiles) {
      const command: ICommand = require(`./commands/${file}`);
      commands.set(command.name, command);
    }
    return commands;
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
    const commandName = args.shift().toLowerCase();

    console.log(commandName, args);

    const command = this.commands.get(commandName)
      || this.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) {
      await message.channel.send(consts.commandNotFound);
      return;
    }

    try {
      await command.execute(this, message, args);
    } catch (error) {
      console.error(error);
      const result = new RichEmbed()
        .setColor("#ff9900")
        .setTitle(`Произошла ошибка :c`)
        .setDescription(`${error.message}`);
      await message.channel.send(result);
    }
  }
}
