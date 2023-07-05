# Card Kingdom
[Card Kingdom](https://thainge.github.io/card-kingdom/)

<img src="https://github.com/Thainge/portfolio/blob/gh-pages/static/media/4.fe69dcbcd2eeddb8b381.png?raw=true" width="500" />

Card game made purely from React and NodeJS. Earn gold and stars to purchase booster packs and unlock upgrades to enhance your gameplay. Defeat your opponents and take back the land. Also compete with other players by joining a multiplayer lobby!

## Development Explanation
### Data Modeling
- User object which holds gold, progress, upgrades, and gained cards.
- Cards object which holds all the cards in the game.
- Enemy deck object which holds all the enemy decks and encounter data.
### Server Queries
- NodeJS sockets connection used to host multiple concurrent multiplayer lobbies.
- Key match information is held on the server, and one player acts as a referee to ensure data integrity.
### Web Pages
- Battle
- Map & Mission selection
- Deck
- Upgrades
- Gallery
- Shop

This project took around a month to complete and has turned out to be a very fun web card game, in the future I plan on releasing a better version built in Unity.

## Next steps:
- Unity version

## Credits 
- Tobey Hainge - Lead Programmer,
- Alena - Art,
- Elizabeth - Art,
- IronHide Studios - Music,

© 2023 Tobey Hainge All rights reserved.
