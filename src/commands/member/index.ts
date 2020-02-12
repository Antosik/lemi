import { ICommand } from "../../interfaces/ICommand";
import { consts } from "../../localization";

import { generateFoundManyMembersEmbed, generateFoundOneMemberEmbed } from "./embed";

module.exports = {
  name: "myclubmember",
  description: "Поиск по участникам клуба. Чем полнее ник, тем лучше.",
  aliases: ["участник", "member", "m1"],
  usage: "member/участник [никнейм]",

  async execute(ctx, message, args) {
    if (!ctx.clubs) {
      throw new Error(consts.unexpectedError);
    }

    const name: string = args.join(" ").trim();
    if (!name) {
      return message.channel.send(consts.playerNameInvalid);
    }
    if (name.length < 3) {
      return message.channel.send(consts.playerNameLength);
    }

    const [live_season, homeclub] = await Promise.all([ctx.clubs.getLiveSeason(), ctx.clubs.getHomeClub()]);
    if (live_season === undefined || live_season.isEnded() || live_season.current_stage === undefined) {
      return message.channel.send(consts.noActiveStage);
    }
    if (homeclub === undefined) {
      return message.channel.send(consts.clubNotSelected);
    }

    const stage = live_season.current_stage;
    const members = await homeclub.getStageMembers(stage.id, homeclub.members_count);

    const searchRegExp = new RegExp(name, "i");
    const members_with_name = members.filter((member) => searchRegExp.test(member.summoner.summoner_name));

    if (!members_with_name.length) {
      return message.channel.send(consts.playerNotFound);

    } else if (members_with_name.length !== 1) {
      const embed = generateFoundManyMembersEmbed(members_with_name);
      return message.channel.send(embed);

    } else {
      const sorted_members = members.sort((a, b) => b.points - a.points);
      const [member] = members_with_name;

      const embed = generateFoundOneMemberEmbed(member, { stage_index: stage.number, club_name: homeclub.name, list_index: sorted_members.indexOf(member) + 1 });
      return message.channel.send(embed);
    }
  }
} as ICommand;
