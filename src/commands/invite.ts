import { RichEmbed } from "discord.js";

import { ICommand } from "../interfaces/ICommand";

import { isValidURL } from "../helpers/functions";
import { consts } from "../localization";

module.exports = {
  name: "myclubinvite",
  description: "Возвращает ссылку - приглашение в ваш клуб",
  aliases: ["приглашение", "инвайт", "invite", "inv"],
  usage: "invite/инвайт",

  async execute(ctx, message, args) {
    const [live_season, homeclub] = await Promise.all([ctx.clubs.getLiveSeason(), ctx.clubs.getHomeClub()]);
    if (live_season.isEnded()) {
      return message.channel.send(consts.linkSeasonInactive);
    }

    const link = await homeclub.getInviteLink();
    if (!isValidURL(link)) {
      throw new Error("Invalid invite link returned");
    }

    const result = new RichEmbed()
      .setColor("#0099ff")
      .setTitle(`Приглашение в клуб ${homeclub.name}`)
      .setDescription(`Перейдите по [ссылке](${link}), чтобы вступить в клуб`)
      .setFooter(link);

    return message.channel.send(result);
  }
} as ICommand;
