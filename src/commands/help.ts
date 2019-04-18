import { RichEmbed } from "discord.js";

import { ICommand } from "../interfaces/ICommand";

module.exports = {
  name: "help",
  description: "Доступные команды.",
  aliases: ["commands", "помощь", "команды", "h"],
  usage: "help/commands/помощь/команды",

  async execute(ctx, message, args) {
    const result = new RichEmbed()
      .setColor("#0099ff")
      .setTitle(`Доступные команды`)
      .setDescription(`Используйте префикс \`${ctx.getPrefix()}\` перед командой.`)
      .setFooter(`Made with <3 by @Antosik#6224`);

    const commands = ctx.getAvailableCommands();
    for (const command of commands.values()) {
      result.addField(`• \`${command.usage}\``, command.description);
    }

    return message.channel.send(result);
  }
} as ICommand;
