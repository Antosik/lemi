export const enum ESeasonArgs {
  ru = "сезон",
  en = "season",

}

export const enum EStageArgs {
  ru = "этап",
  en = "stage"
}

export const isSeason = (string: string): boolean => ([ESeasonArgs.ru, ESeasonArgs.en] as string[]).includes(string);
export const isStage = (string: string): boolean => ([EStageArgs.ru, EStageArgs.en] as string[]).includes(string);
