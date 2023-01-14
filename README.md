# Village of Chaos: a browser game

![Mock-up image of the game displaying on a PC screen and a mobile device](doc/mockup.png)

_Village of Chaos_ is an incremental game written in vanilla Javascript, made for [Code Institute](https://codeinstitute.net)'s 2nd submission project. The goal of the game is to build a village, bit by bit, and manage your villagers' jobs to maximize their potential.

[Live version is available here.](https://tearnote.github.io/village-of-chaos/)

## Important notes

The game has a saving feature. It autosaves every 5 minutes, but make sure to save manually if you're about to close the game so that you don't lose the last few minutes of progress.

The documentation is split across three files:

-   [README.md](README.md) (this file): Overview of the game. Read this to get an idea of the basic premise, technologies used and project conventions.
-   [DESIGN.md](doc/DESIGN.md): UX design notes crafted during early stages of development. The design process is described entirely, from the concept and market research, through information structuring to visual design principles and color palettes.
-   [TESTING.md](doc/TESTING.md): Testing procedures. The game has been automatically validated and manually tested with procedures noted down in this file. WARNING - file contains a large amount of heavy animated GIFs.

For rapid testing, the following code can be executed in the browser console to gain enough resources to beat the game extremely quickly:

```
game.cheat();
```

## Highlights

![Screenshot of the game's story overlay](doc/highlights/story.png)

The game begins with a story passage, which is also featured later during progression.

![Screenshot of the game's tutorial pop-up](doc/highlights/tutorial.png)

The game guides the player through the basic features as they become available, via tutorial pop-ups that highlight the relevant element.

![Screenshot of the game's background](doc/highlights/background.png)

The game's background image represents the player's village's currently erected buildings, manned by animated villager sprites.

![Screenshot of the game's header area](doc/highlights/header.png)

The header display's the player's resources, as well as controls over the saving feature.

![Screenshot of the game's tabbed interface](doc/highlights/tabs.png)

The tabbed interface allows for buying upgrades using collected resources, and assigning villagers to jobs.

![Screenshot of the game's log window](doc/highlights/log.png)

The expandable log window allows the player to see the latest events that happened in their village.

## Technologies

-   HTML5
    -   Semantic tags used whenever applicable,
    -   [Images](#attribution) served as WebP for static content, and GIF for animations,
    -   [Fonts](doc/DESIGN.md#design-language) from Google Fonts,
    -   No redundant containers for styling purposes,
    -   Favicons and WebManifest are present for PWA functionality,
-   CSS3
    -   Layout with Flexbox and border-box sizing,
    -   Media queries for responsive design, sometimes drastically changing interface elements for a more fitting design,
    -   CSS variables and `calc()` used to organize common values,
    -   Sizing with rem values whenever applicable,
-   Javascript
    -   Scripts are loaded with defer attribute,
    -   No frameworks or libraries,
    -   Heavy usage of modern ES6 features,
    -   All files have strict mode enabled,
    -   Code organized into classes and files,
    -   Game content declared in a data-driven way to allow for extension with minimal code changes,
    -   Every function and method is documented.

The game uses no frameworks, and the only externally loaded resources are the fonts. All code and text files are formatted with [Prettier](https://prettier.io), with indentation using tabs (not spaces.) The CSS is split into sections with `#section` markers, which can be collapsed in most IDEs and code editors.

The compatibility goal was all commonly used desktop and mobile browsers, updated to the latest or second-latest version. In particular, this means no compatibility with IE11, since it is [out of general support](https://learn.microsoft.com/en-us/lifecycle/faq/internet-explorer-microsoft-edge#what-is-the-lifecycle-policy-for-internet-explorer-) since June 15, 2022. The service [Can I use?](https://caniuse.com) was used to ensure that the compatibility goal is met.

<details><summary>Directory structure</summary>

   - `/` (root): HTML files, `README.md`, environment configuration
   - `assets/css`: CSS files
   - `assets/images`: WebP and GIF images served by the HTML pages
   - `assets/js`: Javascript code used by the HTML pages
   - `assets/js/vendor`: 3rd-party Javascript code, attributed at the top of each file,
   - `doc`: Additional Markdown files, PNG images used by Markdown files, any additional documentation files

</details>

## Deployment

The game is served as a fully static website (no server component.) For this reason, it can be trivially deployed to any file hosting service that allows hotlinking to images, stylesheets and scripts. All asset references are relative, so the game will work in a subdirectory. A 404 page is not included, as this project has no links of any kind, internal or external.

For the purpose of this project, the [live version](https://tearnote.github.io/village-of-chaos/) is deployed via GitHub Pages via this process:

-   Click on the Settings tab and scroll down to the GitHub Pages section,
-   Select the main branch source and click on the Save button.

The project can be cloned locally with the following command:

```
git clone https://github.com/Tearnote/village-of-chaos.git
```

The local version can be ran straight from the filesystem by simply opening the `index.html` file in the browser, as it has no server dependencies.

## Bugs

The game has a few minor issues remaining, they will be documented below.

-   **Flicker after an upgrade is bought**  
    This is caused by the code clearing the upgrade tab before filling it back up with available upgrades. A possible solution would be add and remove only the upgrades that need changing. Impact is very low, as the flicker is hardly noticeable. This could be fixed with more time with the project.
-   **Background image breaks when screen DPI changes**  
    This affects primarily responsiveness testing via the Inspector, as real devices don't tend to change their DPI. A workaround is to refresh the page after changing the "device" used for testing. As this affects only the developer, this is low priority.
-   **Code breaks entirely when loading an incompatible savefile**  
    If the game gets updated with more upgrades, an array length mismatch will halt all Javascript from executing. This cannot happen during normal play, but must be taken into account if the game gets updated in the future so that people don't lose their progress. Until then, this could be worked around by resetting the savefile if it's detected invalid. Judged low priority, as it doesn't affect the end product in the present.
-   **Layout overlap on small screens in landscape mode**  
    The site is responsive on all sizes of large screens, and on portrait mode of small screens. Adding extra CSS for improved responsiveness of small screens in landscape mode is possible, but would take extra time. Fortunately, the vast majority of mobile users is expected to be visiting the website in portrait mode. A meta tag was also added as a workaround to prevent accidental screen orientation changes.

## Attribution

All external code is attributed inline, or is in a "vendor" directory.

Village images and animations created using the tilesets and spritesheets by [PixiVan](https://pixivan.itch.io). In particular,

-   [Top Down Forest Tileset](https://pixivan.itch.io/top-down-forest-tileset),
-   [Traders Top Down Asset Pack](https://pixivan.itch.io/traders-top-down-npc).

These resources were purchased with personal funds. The purchased source files are not present in the repository.
