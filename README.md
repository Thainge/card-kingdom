# Card Kingdom
CopyRight 2022 Tobey Hainge

Link: https://thainge.github.io/card-kingdom/

Card game made purely from React and NodeJS. Earn gold and stars to purchase booster packs and unlock upgrades to enhance your gameplay. Defeat your opponnents and take back the land. Also compete with other players by joining a multiplayer lobby!

## Development Explaination
### Data Modeling
  1. User object which holds gold, progress, upgrades, and gained cards.
  2. Cards object which holds all the cards in the game.
  3. Enemy deck object which holds all the enemy decks and encounter data.
### Server Queries
  1. NodeJS sockets connection used to host multiple concurrent multiplayer lobbies.
  2. Key match information is held on the server, and one player acts as a referree to ensure data integrity.
### Web Pages
  1. Battle
  2. Map & Mission selection
  3. Deck
  4. Upgrades
  5. Gallery
  6. Shop

This project took around a month to complete and has turned out to be a very fun web card game, in the future I plan on releasing a better version built in Unity.

## Next steps:
- Unity version

##credits 
  1. Tobey Hainge - Lead Programmer,
  2. Alena - Art,
  3. Elizabeth - Art,
  4. IronHide Studios - Music,
