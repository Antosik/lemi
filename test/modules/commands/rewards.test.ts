import { mockSeasonRewardEntity, mockStageRewardEntity } from "../../__mocks__/entities/IReward";
import { mockParticipatingClubResponse } from "../../__mocks__/responses/IClub.mock";
import { mockSeasonRewardResponse, mockStageRewardResponse } from "../../__mocks__/responses/IReward.mock";
import { mockSeasonResponse } from "../../__mocks__/responses/ISeason.mock";
import { mockMultiple } from "../../__mocks__/responses/helpers";

import { generateRewardsEmbed } from "../../../src/commands/rewards/embed";

describe("Commands - Rewards", () => {
  test("Embed generation", () => {
    const season = mockSeasonResponse();
    const stage = season.stages[0];

    const homeclub = mockParticipatingClubResponse();
    const season_rewards_res = mockSeasonRewardResponse({ season_id: season.id });
    const stage_rewards_res = mockStageRewardResponse({ stage_id: stage.id });

    const season_rewards = mockSeasonRewardEntity({ season_data: season, reward_data: season_rewards_res });
    const stages_rewards = mockMultiple(() => mockStageRewardEntity({ season_id: season.id, stage_data: stage, reward_data: stage_rewards_res }));

    const embed = generateRewardsEmbed({ homeclub, season_rewards, stages_rewards });
    const json = JSON.parse(JSON.stringify(embed));

    expect(json).toMatchObject({
      title: expect.any(String),
      description: expect.any(String),
      color: expect.any(Number),
      fields: expect.any(Array),
      footer: expect.any(Object)
    });
    expect(json.title).toContain(homeclub.club.lol_name);
    expect(json.description).toContain(season.title);
    expect(json.fields).toHaveLength(stages_rewards.length + 1);
  });
});