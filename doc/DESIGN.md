# Village of Chaos - UX design notes

## Motivation

Ever since the the advent of [Cookie Clicker](https://orteil.dashnet.org/cookieclicker/), incremental games have enjoyed a huge rise in popularity, topping the charts of mobile app stores and ruining worker productity worldwide. The simple gameplay makes them appealing to people less skilled at videogames, and they can be created very rapidly with little graphical content by any aspiring game designer. _Village of Chaos_ is a "management" type incremental, where workers can be assigned to automate tasks. However, the driving idea behind this game is that increasing the number of units assigned to the same task doesn't neccessarily result in a speedup, as the team becomes uncoordinated and chaotic. The player will need to research and apply management techniques to keep the team efficient and production high.

## Market research

The incremental game scene is huge, and full of interesting ideas. This is a small sampling of similar browser games:

-   [Kittens Game](https://kittensgame.com/web/)
-   [Trimps](https://trimps.github.io)
-   [Universal Paperclips](https://www.decisionproblem.com/paperclips/index2.html)
-   [CivClicker](https://cheerfulghost.github.io/civ-clicker/index.html)

All of these games start out extremely simple, hiding most of their features and mechanics at first to avoid overwhelming the player with complexity. As certain milestones are reached, the number of available interactible objects increases, letting the player grow their numbers further at the cost of having to wrap their head around more systems.

The visual design is typically extremely simple, mostly text-based, with imagery limited to icons. This is because these games are created by tiny teams, often by a single person, who usually isn't a visual artist. Good UX design is valued, but attractive graphics are not needed to be successful.

These methods are typically used to help present the game data to the player:

-   A section listing all resources, and the speeds at which they're growing,
-   Tabbed interface for switching between sections,
-   Primary method of interaction is pressing buttons to make purchases and other choices,
-   A message log, appended with in-game events as they happen,
-   Elements are hidden or greyed out if they're not relevant right now.

## User stories

> _As someone with free time to spare, I want to play a browser game so that I'm entertained._

-   What kind of game is this?
-   What do the buttons mean?
-   How do I start?
-   What's the ultimate goal?

## Scope

These goals are neccessary for a MVP of the game:

-   Resources:
    -   Food,
    -   Wood,
    -   Stone,
-   Buildings:
    -   Tent (increases villager count),
    -   Pier (increases food),
    -   Quarry (increases stone),
    -   Blacksmith (performs upgrades),
    -   Academy (performs research),
-   Villager roles:
    -   Apprentice (more than one increases chaos if unmanaged),
    -   Mentor (pairs up with an apprentice to manage them),
    -   Manager (doesn't produce, but reduces chaos),
-   A permanently visible listing of all owned resources,
-   Tabbed interface for switching between sections:
    -   A section that lists owned buildings and allows assigning villagers to them,
    -   A section for upgrades,
    -   A section for research,
-   An interactive tutorial explaining the basics to the player,
-   An upgrade which causes the player to win the game when it's complete,
-   Modern, responsive, compliant and accessible design.

These goals aren't neccessary, but would provide additional value:

-   Saving and loading so that the game state survives browser refresh,
-   A graphical view of the village, showing the field in the forest, alongside currently built buildings,
-   Sound effects,
-   Particle and shaking effects.
