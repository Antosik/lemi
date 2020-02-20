import { formatDistance } from "date-fns";
import { ru } from "date-fns/locale";

import { ISeasonEntity } from "../../interfaces/ISeason";
import { IStageEntity } from "../../interfaces/IStage";
import { consts } from "../../localization";

export function generateStageTime(stage: IStageEntity | undefined): string {
  if (stage === undefined) {
    return consts.noActiveStage;
  }

  const end_date = stage.end_date;
  const distance = formatDistance(end_date, new Date(), {
    locale: ru
  });

  return `${consts.timeToStageEnd}: **${distance}**`;
}

export function generateSeasonTime(season: ISeasonEntity | undefined): string {
  if (season === undefined || !season.isLive() || season.end_date < new Date()) {
    return consts.noActiveSeason;
  }

  const end_date = season.end_date;
  const distance = formatDistance(end_date, new Date(), {
    locale: ru
  });

  return `${consts.timeToSeasonEnd}: **${distance}**`;
}