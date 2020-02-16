import { Collection as DiscordCollection, DMChannel, GroupDMChannel, Guild, Message, RichEmbed } from "discord.js";
import * as fs from "fs";
import * as path from "path";

import { ClubsAPIInvoker } from "./clubs-api/helpers/api-invoker";

import { DiscordClient, ICommand } from "./interfaces/ICommand";
import { consts } from "./localization";
import ClubsClient from "./lol";

export interface ILemiConfig {
  discord_token: string;
  lol_token: string;
  prefix: string;
}

export default class Lemi {
  private config: ILemiConfig;
  public clubs?: ClubsClient;
  private client?: DiscordClient;
  private commands: DiscordCollection<string, ICommand>;

  constructor(config: ILemiConfig) {
    if (config.discord_token === undefined || config.discord_token.trim().length === 0) {
      throw new Error("No discord token passed!");
    }

    this.config = config;
    this.client = undefined;
    this.clubs = undefined;
    this.commands = new DiscordCollection<string, ICommand>();
  }

  public async run(): Promise<unknown> {
    if (this.client) {
      this.client.destroy();
    }

    this.client = this.initDiscord();
    this.clubs = this.initClubs();
    this.commands = this.loadCommands();

    return this.client.login(this.config.discord_token);
  }

  public async stop(): Promise<void> {
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

  private initDiscord(): DiscordClient {
    const client = new DiscordClient();

    client.on("ready", () => this.onReady());
    client.on("guildCreate", (guild) => this.onGuildCreate(guild));
    client.on("guildDelete", (guild) => this.onGuildDelete(guild));
    client.on("message", (message) => this.onMessage(message));

    return client;
  }

  private initClubs(): ClubsClient {
    const clubsAPI = new ClubsAPIInvoker(this.config.lol_token);
    return new ClubsClient(clubsAPI);
  }

  private loadCommands(): DiscordCollection<string, ICommand> {
    const commands = new DiscordCollection<string, ICommand>();
    const commandDirs = fs.readdirSync(path.resolve(__dirname, "commands"));
    for (const dir of commandDirs) {
      const command: ICommand = require(path.resolve(__dirname, "commands", dir)); // eslint-disable-line @typescript-eslint/no-var-requires
      commands.set(command.name, command);
    }
    return commands;
  }

  private onReady(): void {
    if (!this.client) {
      throw new Error(consts.unexpectedError);
    }

    console.log(`Bot has started, with ${this.client.users.size} users, in ${this.client.channels.size} channels of ${this.client.guilds.size} guilds.`);
    this.client.user.setActivity("League of Legends");
  }
  private onGuildCreate(guild: Guild): void {
    console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  }
  private onGuildDelete(guild: Guild): void {
    console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  }

  private _filterMessage(message: Message): Message | undefined {
    if (message.channel instanceof DMChannel || message.channel instanceof GroupDMChannel) {
      return;
    }
    if (message.author.bot) {
      return;
    }
    if (!message.content.startsWith(this.config.prefix)) {
      return;
    }
    return message;
  }

  private _parseMessage(message: string): { command: ICommand | undefined, args: string[] } {
    const args = message.slice(this.config.prefix.length).trim().split(/ +/g);

    const commandText = args.shift();
    if (!commandText) {
      throw new Error(consts.unexpectedError);
    }

    const commandName = commandText.toLowerCase();
    const command = this.commands.get(commandName)
      || this.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName) || false);

    return { command, args };
  }

  private async onMessage(msg: Message): Promise<void> {
    const message = this._filterMessage(msg);
    if (!message) { return; }

    try {
      const { command, args } = this._parseMessage(message.content);

      if (!command) {
        await message.channel.send(consts.commandNotFound);
        return;
      }

      await command.execute(this, message, args);
    } catch (error) {
      console.error(error);
      const result = new RichEmbed()
        .setColor("#ff9900")
        .setTitle("Произошла ошибка :c")
        .setDescription(`${error.message}`);
      await message.channel.send(result);
    }
  }
}
