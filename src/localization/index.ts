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
}

export const consts = {
  noEnoughPt: "Недостаточно очков для участия в этапе!",
  noActiveSeason: "Нет активных сезонов!",
  seasonNotFound: "Сезон не найден!",
  stageNotFound: "Этап не найден!",
  commandNotFound: "Извините, данная команда не найдена",
  noPlaceInTop: "Нет места",

  clubNameInvalid: "Введите название клуба",
  clubNameLength: "Имя клуба должно быть больше 2 символов",
  clubNotFound: "Клубов с таким названием не найдено",

  calcEnoughGames: "Вы уже достигли желаемого места в этапе, так держать!",
  invalidPlayerCount: "Количество игроков может быть от 2 до 5",
  invalidTopPosition: "Неверная позиция в топе",
  errorGettingTopPosition: "Ошибка получения клуба в топе",
  clubNotSelected: "Вы не выбрали клуб",

  authError: "Ошибка авторизации",
  requestError: "Ошибка получения данных с сервера"
}

export default function format(token, count: number): string {
  return locale[token](count)
}