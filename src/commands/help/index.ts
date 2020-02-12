import { ICommand } from "../../interfaces/ICommand";

import { generateHelpEmbed } from "./embed";

module.exports = {
  name: "help",
  description: "Выводит данное сообщение (доступные команды)",
  aliases: ["commands", "помощь", "команды", "h"],
  usage: "help/commands/помощь/команды",

  async execute(ctx, message) {
    const commands = ctx.getAvailableCommands();

    const embed = generateHelpEmbed({
      prefix: ctx.getPrefix(),
      commands
    });

    return message.channel.send(embed);
  }
} as ICommand;
