import "./styles";

const BASE_URL = "https://cs-steam-game-api.herokuapp.com";

const getFeaturedGames = async () => {
  try {
    const url = `${BASE_URL}/features`;
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

const searchGamesByKeyWords = async (keyword) => {
  try {
    const url = `${BASE_URL}/games?q=${keyword}&page=0&limit=10`;
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch (error) {}
};

const searchGamesByCategory = async (category) => {
  try {
    const url = `${BASE_URL}/games?genres=${category}&page=0&limit=10`;
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch (error) {}
};

// RENDERING

const renderGames = async (listDisplayedGames) => {
  const displayedGames = document.getElementById("game-display");
  displayedGames.innerHTML = ``;
  for (let i = 0; i < listDisplayedGames.length; i++) {
    const gamePrice =
      listDisplayedGames[i].price === 0
        ? "Free"
        : `$${listDisplayedGames[i].price}`;
    const newGame = document.createElement("div");
    newGame.classList.add("game-wrapper");
    newGame.innerHTML = `<img
        src="${listDisplayedGames[i].header_image}", 
        class="game-header-image",
        title = "${listDisplayedGames[i].appid}",
      />
      <div class="game-info">Price: ${gamePrice}</div>`;
    newGame.addEventListener("click", (Event) => {
      console.log(listDisplayedGames[i].appid);
    });
    displayedGames.appendChild(newGame);
  }
};

const renderFeaturedGames = async () => {
  try {
    const featuredGames = await getFeaturedGames();
    const listDisplayedGames = featuredGames.data;
    renderGames(listDisplayedGames);
  } catch (error) {}
};

const renderSearchedGames = async (keyword) => {
  try {
    const searchedGames = await searchGamesByKeyWords(keyword);
    const listDisplayedGames = searchedGames.data;
    const notification = document.getElementById("notification");
    notification.innerText = `Results for "${keyword}"`;
    renderGames(listDisplayedGames);
  } catch (error) {
    console.log("error_search_games");
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
    console.log("error_search_games");
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
