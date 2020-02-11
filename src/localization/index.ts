import { getLocaleFn } from "./helpers";

const locale = {
  game: getLocaleFn({
    singularNominative: "{{count}} игра",
    singularGenitive: "{{count}} игры",
    pluralGenitive: "{{count}} игр"
  }),
  gameToPlay: getLocaleFn({
    singularNominative: "{{count}} игру",
    singularGenitive: "{{count}} игры",
    pluralGenitive: "{{count}} игр"
  }),
  player: getLocaleFn({
    singularNominative: "{{count}} игрок",
    singularGenitive: "{{count}} игрока",
    pluralGenitive: "{{count}} игроков"
  }),
  stage: getLocaleFn({
    singularNominative: "{{count}} этап",
    singularGenitive: "{{count}} этапе",
    pluralGenitive: "{{count}} этапе"
  }),
  club: getLocaleFn({
    singularNominative: "{{count}} клуб",
    singularGenitive: "{{count}} клуба",
    pluralGenitive: "{{count}} клубов"
  }),
  point: getLocaleFn({
    singularNominative: "{{count}} очко",
    singularGenitive: "{{count}} очка",
    pluralGenitive: "{{count}} очков"
  }),
  participient: getLocaleFn({
    singularNominative: "{{count}} участник",
    singularGenitive: "{{count}} участника",
    pluralGenitive: "{{count}} участников"
  }),
  season: getLocaleFn({
    singularNominative: "{{count}} сезон",
    singularGenitive: "{{count}} сезона",
    pluralGenitive: "{{count}} сезонов"
  }),
};

export const consts = {
  noEnoughPt: "Недостаточно очков для участия в этапе!",
  noActiveSeason: "Нет активных сезонов!",
  noActiveStage: "Нет активных этапов!",
  seasonNotFound: "Сезон не найден!",
  stageNotFound: "Этап не найден!",
  commandNotFound: "Извините, данная команда не найдена.",
  noPlaceInTop: "Нет места.",

  playerNameInvalid: "Введите имя игрока!",
  playerNameLength: "Имя игрока должно быть больше 2 символов!",
  playerNotFound: "Игроков в вашем клубе с таким именем не найдено.",
  clubNameInvalid: "Введите название клуба!",
  clubNameLength: "Имя клуба должно быть больше 2 символов!",
  clubNotFound: "Клубов с таким названием не найдено.",

  calcEnoughGames: "Вы уже достигли желаемого места в этапе, так держать!",
  farmEnoughPoints: "Все игроки нафармили очки, так держать!",
  invalidPlayerCount: "Количество игроков может быть от 2 до 5!",
  invalidTopPosition: "Неверная позиция в топе.",
  errorGettingTopPosition: "Ошибка получения клуба в топе.",
  clubNotSelected: "Вы не выбрали клуб! Выберите его в игровом клиенте во вкладке \"Главная - Гильдии\".",
  linkSeasonInactive: "В данный момент ваша ссылка неактивна, вы сможете приглашать новых участников после начала нового сезона.",

  timeToSeasonEnd: "До конца сезона осталось",
  timeToStageEnd: "До конца этапа осталось",

  authError: "Ошибка авторизации.",
  requestError: "Ошибка получения данных с сервера."
};

export default function format(token: string, count: number): string {
  if (!locale[token]) { return ""; }

  return locale[token](count);
}
