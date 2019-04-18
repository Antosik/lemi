export const enum ERuArgs {
  season = "сезон",
  stage = "этап"
}

export const enum EEnArgs {
  season = "season",
  stage = "stage"
}

export const isSeason = (string: string) => ([ERuArgs.season, EEnArgs.season] as string[]).includes(string);
export const isStage = (string: string) => ([ERuArgs.stage, EEnArgs.stage] as string[]).includes(string);
