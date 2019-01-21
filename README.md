# Lemi
Бот для [Discord](https://discordapp.com/)'a, позволяющий быстро получить информацию о [Клубах](https://clubs.ru.leagueoflegends.com) в [League of Legends](https://ru.leagueoflegends.com/ru/)

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/Antosik/lemi)

## Оглавление
* [Доступные команды](#доступные-команды)
* [Установка](#установка)
  * Получение ключей
    * [Discord'a](#получение-tokena-discorda)
    * [LoL'a](#получение-tokena-lola) *(опционально)*
  * [Установка на сервер Heroku](#загрузка-бота-на-heroku)


## Доступные команды
### Команды, работающие без token'a LoL'a
- `seasoninfo/сезон` - Отображает общую информацию о текущем сезоне  
  
- `topseason/топсезона [количество мест]` - Показывает топ сезона  
  
  - `[количество мест]` - количество позиций, которое нужно показать *(10 по умолчанию)*  
    Пример использования:
    - `топсезона 3` - показать Топ-3 клуба в текущем сезоне
  
- `help/команды` - Показывает доступные команды бота  

### Команды, для работы которых нужен token
- `searchclub/поиск [название]` - Поиск по клубам (Топ-500).   
  - `[название]` - название клуба, который вы хотите найти (чем полнее название, тем лучше)  
  
- `myclub/клуб` - Отображает информацию о вашем клубе.  
  
- `myclubstage/этап [номер этапа] [количество клубов]` - Показывает топ этапа вашего клуба.  
  - `[номер этапа]` - номер этапа (1-3) *(по умолчанию показывается текущий)* 
  - `[количество клубов]` - количество позиций, которое нужно показать *(10 по умолчанию)*   
    Пример использования:
    - `этап 3` - показать Топ-3 клуба в 3 этапе
    - `myclubstage` - показать Топ-10 клубов за текущий этап  
    *Примечание: Если у вас недостаточно очков для участия в текущем этапе - вы не сможете просмотреть информацию за данный этап*
  
- `myclubmembers/участники [номер этапа (1-3)] [количество участников]` - Отображает информацию об очках, заработанных участниками вашего клуба  
  - `[номер этапа]` - номер этапа (1-3) *(по умолчанию показывается текущий)* 
  - `[количество участников]` - количество позиций, которое нужно показать *(10 по умолчанию)*  
    Пример использования:
    - `myclubmembers 5` - показать Топ-5 членов клуба за этот этап
    - `участники 10 2` - показать Топ-10 членов клуба за 2 этап сезона

- `myclubcalc/расчет [(season/сезон)/(stage/этап)] [место в топе] [игроков в группе] [aram]` - Отображает количество игр, которые нужно выиграть участниками вашего клуба для достижения желаего места в сезоне/этапе.  
  - `[(season/сезон)/(stage/этап)]`
    - `season` или `сезон` - для расчета сезона
    - `stage` или `этап` - для расчета этапа *(по умолчанию)*
  - `[место в топе]` - желаемое место в топе *(первое, по умолчанию :D)*
  - `[игроков в группе]` - количество игроков в вашей party (от 2 до 5)  *(по умолчанию 5)*
  - `[aram]` - указываете, если в хотите получить расчет при игре только в ARAM'е  

    Пример использования:
    - `myclubcalc этап 5 5` - хотим занять 5 место в этапе, играя в party из 5 человек
    - `расчет сезон 1 2 aram` - хотим занять 1 место в сезоне, играя в party из 2 человек играя только в ARAM xD


## Установка 

### Получение Token'a Discord'a
* Пройдите на [портал разработчиков](https://discordapp.com/developers/applications/) Discord'a
* Создайте новое приложение (`Create an application`) и перейдите во вкладку *Bot*, нажмите `Add bot`
* Нажмите кнопку `Copy` - вы получили token :tada:

Чтобы добавить бота на свой сервер, вам нужно перейти по ссылке вида `https://discordapp.com/api/oauth2/authorize?client_id=CLIENT_ID&scope=bot&permissions=26688`, где `CLIENT_ID` - Client ID вашего приложения (скопируйте его во вкладке *General Information*).  
Затем выберите сервер, куда вы хотите его добавить и - готово!


### Получение Token'a LoL'a
* Пройдите на сайт [Клубов](https://clubs.ru.leagueoflegends.com) и авторизируйтесь на сайте
* Откройте консоль разработчика (в браузере), нажав `Ctrl+Shift+I` или `F12`
* Далее по браузерам:
  * Chrome
    * Перейдите во вкладку `Application`
    * Откройте в левой панельке вкладку `Cookies`
  * Firefox
    * Перейдите во вкладку `Хранилище`
    * Откройте в левой панельке вкладку `Cookies` / `Куки`
  * Chrome
    * Перейдите во вкладку `Отладчик`
    * Откройте в левой панельке вкладку `Файлы cookie`
* Выберите сайт клубов `https://clubs.ru.leagueoflegends.com`
* Найдите в списке `PVPNET_TOKEN_RU` и скопируйте значение справа от него
* :tada:  
*Примечание: Переодически процедуру получения токена нужно повторять, так как авторизация сбрасывается через некоторое время (неделю-две)*

### Загрузка бота на Heroku
* Зарегистрируйтесь на [Heroku](https://id.heroku.com/login) и авторизируйтесь
* Нажмите на кнопку ниже ↓  
[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/Antosik/lemi)
* Введите название приложения, введите данные, полученные ранее (token'ы Discord'a и LoL'a), а также префикс для команд 
* Нажмите на кнопку `Deploy app`
* :tada:

## Разное

### Disclaimer
League of Legends and Riot Games are trademarks or registered trademarks of Riot Games, Inc. League of Legends © Riot Games, Inc.