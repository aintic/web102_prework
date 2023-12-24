/*****************************************************************************
 * Challenge 2: Review the provided code. The provided code includes:
 * -> Statements that import data from games.js
 * -> A function that deletes all child elements from a parent element in the DOM
*/

// import the JSON data about the crowd funded games from the games.js file
import GAMES_DATA from './games.js';

// create a list of objects to store the data about the games using JSON.parse
const GAMES_JSON = JSON.parse(GAMES_DATA)

var displayedGames;

// remove all child elements from a parent element in the DOM
function deleteChildElements(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

/*****************************************************************************
 * Challenge 3: Add data about each game as a card to the games-container
 * Skills used: DOM manipulation, for loops, template literals, functions
*/

// grab the element with the id games-container
const gamesContainer = document.getElementById("games-container");

// create a function that adds all data from the games array to the page
function addGamesToPage(games) {

    // loop over each item in the data
    for (let game of games) {

        // create a new div element, which will become the game card
        let gameCard = document.createElement("div");

        // add the class game-card to the list
        gameCard.classList.add("game-card");

        // set the inner HTML using a template literal to display some info 
        // about each game
        // TIP: if your images are not displaying, make sure there is space
        // between the end of the src attribute and the end of the tag ("/>")
        gameCard.innerHTML = `
            <h2>${game.name}</h2>
            <img src="${game.img}" alt="${game.name} image not found :(" class="game-img" />
            <p>${game.description}</p>
            <p>Goal: ${game.goal}</p>
            <p>Pledged: ${game.pledged}</p>
            <p>Backers: ${game.backers}</p>
        `;

        // append the game to the games-container
        gamesContainer.appendChild(gameCard);
    }
}

// call the function we just defined using the correct variable
// later, we'll call this function using a different list of games
addGamesToPage(GAMES_JSON);

// set the currently displayed games
displayedGames = GAMES_JSON;
/*************************************************************************************
 * Challenge 4: Create the summary statistics at the top of the page displaying the
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: arrow functions, reduce, template literals
*/

// grab the contributions card element
const contributionsCard = document.getElementById("num-contributions");

// use reduce() to count the number of total contributions by summing the backers
const totalContributions = GAMES_JSON.reduce( (contributions, game) => {
    return contributions + game.backers;
}, 0);


// set the inner HTML using a template literal and toLocaleString to get a number with commas
contributionsCard.innerHTML = `
    ${totalContributions.toLocaleString()}
`;

// grab the amount raised card, then use reduce() to find the total amount raised
const raisedCard = document.getElementById("total-raised");

const totalRaised = GAMES_JSON.reduce( (raised, game) => {
    return raised + game.pledged;
}, 0);

// set inner HTML using template literal
raisedCard.innerHTML = `
    ${totalRaised.toLocaleString()}
`;

// grab number of games card and set its inner HTML
const gamesCard = document.getElementById("num-games");

// set inner HTML using template literal
gamesCard.innerHTML = `
    ${GAMES_JSON.length}
`;


/*************************************************************************************
 * Challenge 5: Add functions to filter the funded and unfunded games
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: functions, filter
*/

// show only games that do not yet have enough funding
function filterUnfundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have not yet met their goal
    let unfundedGames = GAMES_JSON.filter( (game) => {
        return game.pledged < game.goal;
    });

    displayedGames = unfundedGames;

    // use the function we previously created to add the unfunded games to the DOM
    addGamesToPage(unfundedGames);
}

// show only games that are fully funded
function filterFundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have met or exceeded their goal
    let fundedGames = GAMES_JSON.filter( (game) => {
        return game.pledged >= game.goal;
    });

    displayedGames = fundedGames;

    // use the function we previously created to add unfunded games to the DOM
    addGamesToPage(fundedGames);
}

// show all games
function showAllGames() {
    deleteChildElements(gamesContainer);

    displayedGames = GAMES_JSON;

    // add all games from the JSON data to the DOM
    addGamesToPage(GAMES_JSON);
}

// select each button in the "Our Games" section
const unfundedBtn = document.getElementById("unfunded-btn");
const fundedBtn = document.getElementById("funded-btn");
const allBtn = document.getElementById("all-btn");

// add event listeners with the correct functions to each button
unfundedBtn.addEventListener("click", filterUnfundedOnly);
fundedBtn.addEventListener("click", filterFundedOnly);
allBtn.addEventListener("click", showAllGames);

/*************************************************************************************
 * Challenge 6: Add more information at the top of the page about the company.
 * Skills used: template literals, ternary operator
*/

// grab the description container
const descriptionContainer = document.getElementById("description-container");

// use filter or reduce to count the number of unfunded games
const numUnfundedGames = GAMES_JSON.reduce( (numUnfunded, game) => {
    return game.pledged < game.goal ? numUnfunded + 1 : numUnfunded;
}, 0);

const numFundedGames = GAMES_JSON.length - numUnfundedGames;

// create a string that explains the number of unfunded games using the ternary operator
const displayStr =
`A total of $${totalContributions.toLocaleString()} has been raised for ${numFundedGames} 
${numFundedGames === 1 ? "game" : "games"}. Currently, ${numUnfundedGames} 
${numUnfundedGames === 1 ? "game" : "games"} remain unfunded. We need your help to fund 
these amazing games!`

// create a new DOM element containing the template string and append it to the description container.
const displayPara = document.createElement("p");
displayPara.innerHTML = displayStr;
descriptionContainer.appendChild(displayPara);

/************************************************************************************
 * Challenge 7: Select & display the top 2 games
 * Skills used: spread operator, destructuring, template literals, sort 
 */

const firstGameContainer = document.getElementById("first-game");
const secondGameContainer = document.getElementById("second-game");

const sortedGames =  GAMES_JSON.sort( (item1, item2) => {
    return item2.pledged - item1.pledged;
});

// use destructuring and the spread operator to grab the first and second games
const [firstGame, secondGame, ...rest] = sortedGames;

// create a new element to hold the name of the top pledge game, then append it to the correct element
const topFunded = document.createElement("p")
topFunded.innerHTML = `${firstGame.name}`;
firstGameContainer.appendChild(topFunded);

// do the same for the runner up item
const runnerUpFunded = document.createElement("p");
runnerUpFunded.innerHTML = `${secondGame.name}`;
secondGameContainer.appendChild(runnerUpFunded);

/************************************************************************************
 * Bonus feature: search specific games by name
 */

// grab the search bar and search button
const searchBar = document.getElementById("search-bar");
const searchBtn = document.getElementById("search-btn");

// enter key in search bar is equivalent to clicking the search button
searchBar.addEventListener("keyup", (event) => {
    if (event.keyCode === 13) {
        searchBtn.click();
    }
});

// process search when search button is clicked
searchBtn.addEventListener("click", () => {
    // grab the value from the search bar
    const searchValue = searchBar.value;

    // if the search value is empty, do nothing
    if (searchValue === "") {
        return;
    }

    // use filter to find the game that matches the search value
    const searchResults = GAMES_JSON.filter( (game) => {
        return game.name.toLowerCase().includes(searchValue.toLowerCase());
    });

    // clear the games container
    deleteChildElements(gamesContainer);

    // add the search results to the DOM
    addGamesToPage(searchResults);

    // navigate to the games container
    window.location.href = "#games-container";
});

/************************************************************************************
 * Bonus feature: sort games by name, goal, pledged amount, or number of backers
 */

// array of categories
const categories = ['none', 'name', 'goal', 'pledged', 'backers'];

// loop over the categories
categories.forEach(category => {
    // get the dropdown item
    const dropdownItem = document.getElementById(`sort-${category}`);

    // add the event listener
    dropdownItem.addEventListener('click', function() {
        // clear the games container
        deleteChildElements(gamesContainer);

        // show the current displayed games as is
        if (!category || category === 'none' || displayedGames.length <= 1) {
            addGamesToPage(displayedGames);
            return;
        }
        else {
            // sort in descending order by the selected category
            // deep clone the displayed games array since sort is in place
            let sortedGames = JSON.parse(JSON.stringify(displayedGames)).sort ((item1, item2) => {
                if (typeof item1[category] === 'number') {
                    return item2[category] - item1[category];
                } else {
                    return item1[category] > item2[category] ? 1 : -1;
                }
            });

            // show sorted games
            addGamesToPage(sortedGames);
        }
    });
});