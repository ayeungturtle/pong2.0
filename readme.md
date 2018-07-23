# pong2.0

This is the second version of my pingPong app - now using Node, React, Express, and MySql.

This time, the goal is to understand how all the pieces of the stack fit together, as opposed to using the auto-generate features within Visual Studio/.NET.

When it is finished, it will be deployed locally on an old Linux laptop at the IQ office to track game statistics and betting ledgers.

Game Modes:
1) Ping King - Similar to King of the Hill, with the winning player staying on the table.  Active players are in a queue and automatically get cycled into play after games are submitted.
2) Random Robin - Active Players are selected, and a round of matchups is randomly created.  Each player gets at least one match.  If the total number of Active Players is odd, one random player will play twice.  When a round completes, another round is automatically generated.

5 - Random Robin Game Mode: 
![](https://github.com/ayeungturtle/gifs/blob/master/pong2.0/randomRobin.gif)

4 - Stats Display:
![](https://github.com/ayeungturtle/gifs/blob/master/pong2.0/displaysStats.gif)

3 - Scoreboard styling and Recent Games History:
![](https://github.com/ayeungturtle/gifs/blob/master/pong2.0/stylingAndRecentGames.gif)

2 - Ping King (King of the Table) player ordering:
![](https://github.com/ayeungturtle/gifs/blob/master/pong2.0/pingKingOrder.gif)

1 - New Player modal and alerts:
![new-player-modal-and-alerts](https://github.com/ayeungturtle/gifs/blob/master/pong2.0/pong_newPlayerModalAndAlerts.gif)