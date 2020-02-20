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

    const live_season = await ctx.clubs.getLiveSeason();
    if (live_season === undefined || !live_season.isLive() || live_season.current_stage === undefined) {
      return message.channel.send(consts.noActiveStage);
    }

    const live_stage = live_season.current_stage;
    const homeclub = await live_stage.getClubMe();

    const homeclub_members = await live_stage.getClubMembers(homeclub.club.members_count);

    const searchRegExp = new RegExp(name, "i");
    const members_with_name = homeclub_members.filter((member) => searchRegExp.test(member.summoner.summoner_name));

    if (!members_with_name.length) {
      return message.channel.send(consts.playerNotFound);

    } else if (members_with_name.length !== 1) {
      const embed = generateFoundManyMembersEmbed(members_with_name);
      return message.channel.send(embed);

    } else {
      const sorted_members = homeclub_members.sort((a, b) => b.points - a.points);
      const [member] = members_with_name;

      const embed = generateFoundOneMemberEmbed(member, { stage_index: live_stage.index, list_index: sorted_members.indexOf(member) + 1 });
      return message.channel.send(embed);
    }
  }
} as ICommand;
