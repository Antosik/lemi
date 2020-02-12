import { IClub, ISeasonsClub, IStageClub } from "../interfaces/IClub";
import { IReward } from "../interfaces/IReward";
import { IStageSummoner } from "../interfaces/ISummoner";

import { consts } from "../localization";
import { ClubsAPICaller } from "../helpers/clubs-api";

export default class HomeClub extends ClubsAPICaller {
  public readonly id: number;
  public readonly name: string;

  public readonly owner_id: number;
  public readonly owner_name: string;
  public readonly owner_avatar: string;

  public readonly seasons_count: number;
  public readonly members_count: number;

  private readonly season_id: number;

  constructor(data: IClub, season_id: number, token: string = "") {
    super(token);
    this.season_id = season_id;

    this.id = data.id;
    this.name = data.lol_name.trim();

    this.owner_id = -1;
    this.owner_name = "???";
    this.owner_avatar = "???";
    if (data.owner) {
      this.owner_id = data.owner.lol_account_id;
      this.owner_name = data.owner.summoner_name.trim();
      this.owner_avatar = data.owner.avatar;
    }

    this.seasons_count = data.seasons_count;
    this.members_count = data.members_count;
  }

  public async getSeason(): Promise<ISeasonsClub> {
    const data = await this.query(`contest/season/${this.season_id}/clubs/current`);
    if (data.points) {
      return data;
    }

    const rating = await this.query(`contest/season/${this.season_id}/userseasonrating`, {}, 2);
    const points_sum = rating.reduce((acc, el) => acc + el.points, 0);
    return { ...data, points: points_sum };
  }

  public async getStageClubs(stage_id: number, count: number = 25): Promise<IStageClub[]> {
    const { results: stage_clubs }: { results: IStageClub[] } = await this.query(`contest/season/${this.season_id}/stages/${stage_id}/clubs`, { params: { per_page: count } });
    return stage_clubs;
  }

  public async getRewardsSeason(): Promise<{ reason: string, count: number }> {
    const [rewards_data]: IReward[] = await this.query(`contest/season/${this.season_id}/clubseasonrewards`);
    if (!rewards_data) {
      return undefined;
    }

    const reward = { reason: rewards_data.reward_condition.description, count: rewards_data.reward_condition.reward_value };
    return reward;
  }

  public async getRewardsStages(): Promise<Map<number, Array<{ reason: string, count: number }>>> {
    const rewards_data: IReward[] = await this.query(`contest/season/${this.season_id}/clubstagerewards`);

    const rewards = new Map();
    rewards_data.forEach((reward_data) => {
      const stage_id = reward_data.club.stage;
      if (rewards.has(stage_id)) {
        const reward = { reason: reward_data.reward_condition.description, count: reward_data.reward_condition.reward_value };
        rewards.set(stage_id, [...rewards.get(stage_id), reward]);
      } else {
        const reward = { reason: reward_data.reward_condition.description, count: reward_data.reward_condition.reward_value };
        rewards.set(stage_id, [reward]);
      }
    });

    return rewards;
  }

  public async getStageMembers(stage_id: number, count: number = 25, page = 1): Promise<IStageSummoner[]> {
    const { results: stage_members }: { results: IStageSummoner[] } = await this.query(`contest/season/${this.season_id}/stages/${stage_id}/summoners`, { params: { per_page: count, page } });
    return stage_members;
  }

  public async calculateStage(stage_id: number, { top = 1, group_size = 5, mode = 0 } = { top: 1, group_size: 5, mode: 0 }): Promise<{ top: number, games_count: number, points_needed: number }> {
    if (top < 1 || top > 25) {
      throw new Error(consts.invalidTopPosition);
    }
    if (group_size < 2 || group_size > 5) {
      throw new Error(consts.invalidPlayerCount);
    }

    const stage_clubs = await this.getStageClubs(stage_id);
    if (stage_clubs.length) {
      const { rank: current_place, points: current_points } = stage_clubs.find((stage_club) => stage_club.club.id === this.id);

      if (current_place <= top) { return { top, games_count: 0, points_needed: 0 }; }
      const club_on_place = stage_clubs[top - 1];
      if (!club_on_place) {
        throw new Error(consts.errorGettingTopPosition);
      }

      const { points } = club_on_place;
      const { games_count, points_needed } = this.calculatePoints(current_points, points, { group_size, mode });

      return { top, games_count, points_needed };
    } else {
      const { results: stages }: { results: IStageClub[] } = await this.query(`contest/season/${this.season_id}/clubs/${this.id}/stages`);
      const current_stage = stages.find((stage) => stage.stage === stage_id);
      const { points: current_points } = current_stage || { points: 0 };
      const { games_count, points_needed } = this.calculatePoints(current_points, 1000, { group_size, mode });

      return { top: 0, games_count, points_needed };
    }
  }

  public async calculateSeason({ top = 1, group_size = 5, mode = 0 } = { top: 1, group_size: 5, mode: 0 }): Promise<{ top: number, games_count: number, points_needed: number }> {
    if (top < 1 || top > 500) {
      throw new Error(consts.invalidTopPosition);
    }
    if (group_size < 2 || group_size > 5) {
      throw new Error(consts.invalidPlayerCount);
    }

    const { rank: current_place, points: current_points } = await this.getSeason();
    if (current_place !== 0 && current_place <= top) {
      return { top, games_count: 0, points_needed: 0 };
    }

    const page = Math.ceil(top / 10);
    const { results: season_clubs }: { results: ISeasonsClub[] } = await this.query(`contest/season/${this.season_id}/clubs`, { params: { per_page: 10, page } });
    const club_on_place = season_clubs[(top - 1) % 10];
    if (!club_on_place) {
      throw new Error(consts.errorGettingTopPosition);
    }

    const { points } = club_on_place;
    const { games_count, points_needed } = this.calculatePoints(current_points, points, { group_size, mode });

    return { top, games_count, points_needed };
  }

  public calculatePoints(current_points: number, points: number, { group_size = 5, mode = 0 } = { group_size: 5, mode: 0 }): { points: number, games_count: number, points_needed: number } {
    if (group_size < 2 || group_size > 5) {
      throw new Error(consts.invalidPlayerCount);
    }

    const points_per_game = !mode ? group_size * group_size * 10 : 5 * (group_size - 1) * group_size;

    if (points <= current_points) {
      return { points, games_count: 0, points_needed: 0 };
    }

    const points_needed = points - current_points;
    const games_count = Math.ceil(points_needed / points_per_game);

    return { points, games_count, points_needed };
  }
}
