import { RichEmbed, Collection } from "discord.js";

import { ICommand } from "../../interfaces/ICommand";

export function generateHelpEmbed(
  { prefix, commands }: { prefix: string, commands: Collection<string, ICommand> }
): RichEmbed {
  const result = new RichEmbed()
    .setColor("#0099ff")
    .setTitle("Доступные команды")
    .setDescription(`Используйте префикс \`${prefix}\` перед командой.`)
    .setFooter("Made with <3 by @Antosik#6224");

  for (const command of commands.values()) {
    result.addField(`• \`${command.usage}\``, command.description);
  }

  return result;
}