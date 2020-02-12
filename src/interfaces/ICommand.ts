import { Client, Collection, Message } from "discord.js";

import Lemi from "../bot";

export class DiscordClient extends Client {
  public commands: Collection<string, ICommand> = new Collection();
}

export interface ICommand {
  name: string;
  description: string;
  usage: string;
  aliases?: string[];
  execute: (ctx: Lemi, message: Message, args: string[]) => unknown | Promise<unknown>;
}
