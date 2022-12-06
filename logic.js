const BASE_URL = "https://steam-api-dot-cs-platform-306304.et.r.appspot.com/";

const getFeaturedGames = async () => {
  try {
    const url = `${BASE_URL}/features`;
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch (error) {
    console.log("Get Featured Games error");
  }
};

const getSingleGame = async (appid) => {
  try {
    const url = `${BASE_URL}/single-game/${appid}`;
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch (error) {
    console.log("Get Single Game error");
  }
};


const searchGamesByKeyWords = async (keyword) => {
  try {
    const url = `${BASE_URL}/games?q=${keyword}&page=0&limit=10`;
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch (error) {
    console.log("Search Games By Key Words error");
  }
};

const searchGamesByCategory = async (category) => {
  try {
    const url = `${BASE_URL}/games?genres=${category}&page=0&limit=10`;
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch (error) {
    console.log("Search Games By Category error");
  }
};

// RENDERING

const renderGames = async (listDisplayedGames) => {
  const displayedGames = document.getElementById("game-display");
  displayedGames.innerHTML = ``;
  listDisplayedGames.forEach((game) => {
    const gamePrice = game.price === 0 ? "Free" : `$${game.price}`;
    const newGame = document.createElement("div");
    newGame.classList.add("game-wrapper");
    newGame.innerHTML = `
    <img
            src="${game.header_image}", 
            class="game-header-image",
            title = "${game.name}",
          />
          <div class="game-info">Price: ${gamePrice}</div>`;
    newGame.addEventListener("click", (Event) => {
      renderSingleGame(game.appid);
    });
    displayedGames.appendChild(newGame);
  });
};

const renderSingleGame = async (appid) => {
  try {
    const singleGame = await getSingleGame(appid);
    const game = singleGame.data;
    const displayedGames = document.getElementById("game-display");
    // DEALING WITH GAME INFORMATION
    const rating =
      parseFloat(game.positive_ratings) / parseFloat(game.negative_ratings) >=
      1.1
        ? "Generally Positive"
        : parseFloat(game.negative_ratings) /
            parseFloat(game.positive_ratings) >=
          1.1
        ? "Generally Negative"
        : "Neutral";

    const game_tags = game.steamspy_tags;
    //-----------------------------
    displayedGames.innerHTML = ``;
    displayedGames.innerHTML = `
    <div class="info-display">
    <img class = "header-image" src= ${game.header_image} alt="">
    <div class="game-details">
      <div class="game-description">
        ${game.description}
      </div>
      <div class="game-information">
        <p class="">RECENT REVIEWS: ${rating}</p>
        <p class="">RELEASE DATE: ${game.release_date.substr(0, 10)} </p>
        <p class="">DEVELOPER: ${game.developer}</p>
        <p class="">PUBLISHER: Valve</p>
      </div>
      <div class="tags-container">
        <div class="tags-description">Popular user-defined tags for this product: </div>
        <div class="tags"></div>
      </div>
    </div>`;
    const tags = document.querySelector(".tags");
    game_tags.forEach((tag) => {
      const newDiv = document.createElement("div");
      newDiv.className = "tag";
      tag = tag[0].toUpperCase() + tag.slice(1).toLowerCase();
      newDiv.textContent = tag;
      tags.append(newDiv);
    });
  } catch (error) {
    console.log("Render Single Game error");
  }
};

const renderFeaturedGames = async () => {
  try {
    const featuredGames = await getFeaturedGames();
    const listDisplayedGames = featuredGames.data;
    renderGames(listDisplayedGames);
  } catch (error) {
    console.log("Render Featured Game error");
  }
};

const renderSearchedGames = async (keyword) => {
  try {
    const searchedGames = await searchGamesByKeyWords(keyword);
    const listDisplayedGames = searchedGames.data;
    const notification = document.getElementById("notification");
    notification.innerText = `Results for "${keyword}"`;
    renderGames(listDisplayedGames);
  } catch (error) {
    console.log("Render Searched Games error");
  }
};

const renderGamesByCategory = async (category) => {
  try {
    const searchedGames = await searchGamesByCategory(category);
    const listDisplayedGames = searchedGames.data;
    const notification = document.getElementById("notification");
    notification.innerText = `Category: "${category}"`;
    renderGames(listDisplayedGames);
  } catch (error) {
    console.log("Render Games By Category error");
  }
};

/* ASSIGNING BUTTONS */

const searchQuery = document.getElementById("search-box");
const searchIcon = document.getElementById("search-icon");

searchIcon.addEventListener("click", (Event) => {
  renderSearchedGames(searchQuery.value);
});

const categoryList = document.querySelectorAll(".dropdown-category");
categoryList.forEach((Element) => {
  Element.addEventListener("click", (event) => {
    renderGamesByCategory(Element.textContent.toLowerCase());
  });
});

renderFeaturedGames();
