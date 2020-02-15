import { format as formatDate } from "date-fns";
import { RichEmbed } from "discord.js";

import { IStageEntity } from "../../interfaces/IStage";
import { ISeasonEntity } from "../../interfaces/ISeason";
import { boldIF } from "../../helpers/functions";

export function generateSeasonEmbed(
  { live_season, stages }: { live_season: ISeasonEntity, stages: IStageEntity[] }
): RichEmbed {
  const start_date = formatDate(live_season.start_date, "dd.MM.yyyy");
  const end_date = formatDate(live_season.end_date, "dd.MM.yyyy");

  const result = new RichEmbed()
    .setColor("#0099ff")
    .setTitle(`Информация о сезоне "${live_season.title}"`);

  const season_description = live_season.is_open && !live_season.is_closed ?
    `**Сезон окончен!** (Даты сезона: ${start_date} - ${end_date})`
    : `Даты сезона: ${start_date} - ${end_date}`;

  result.setDescription(season_description);

  stages.forEach((stage) => {
    const stage_start_date = formatDate(stage.start_date, "dd.MM.yyyy");
    const stage_end_date = formatDate(stage.end_date, "dd.MM.yyyy");

    const title = boldIF(`Этап ${stage.index}`, stage.is_open && !stage.is_closed);
    const description = boldIF(`${stage_start_date} - ${stage_end_date}`, stage.is_open && !stage.is_closed);

    result.addField(title, description);
  });

  return result;
}