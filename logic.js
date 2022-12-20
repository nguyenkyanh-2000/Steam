const BASE_URL = "https://steam-api-dot-cs-platform-306304.et.r.appspot.com/";

/* ALL RESULTS ARE LIMITED TO 10 PER REQUEST*/

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


const searchGamesByKeyWords = async (page, keyword, limit = 10) => {
  try {
    const url = `${BASE_URL}/games?q=${keyword}&page=${page}&limit=${limit}`;
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch (error) {
    console.log("Search Games By Key Words error");
  }
};

const searchGamesByCategory = async (page, category, limit = 10) => {
  try {
    const url = `${BASE_URL}/games?genres=${category}&page=${page}&limit=${limit}`;
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch (error) {
    console.log("Search Games By Category error");
  }
};

const getCategories = async (page, limit = 10) => {
  try {
    const url = `${BASE_URL}/genres?page=${page}&limit=${limit}`;
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch (error) {
    console.log("Get Categories error")
  }
}

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

    const notification = document.getElementById("notification");
    notification.innerText = `${game.name}`;

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

const renderSearchedGames = async (page, keyword) => {
  try {
    const searchedGames = await searchGamesByKeyWords(page, keyword);
    const listDisplayedGames = searchedGames.data;
    const totalPages = Math.ceil(searchedGames.total/10);

    const notification = document.getElementById("notification");
    notification.innerText = `Results for "${keyword}"`;

    renderGames(listDisplayedGames);

    const newPagination = document.createElement('ul');
    const displayedGames = document.getElementById("game-display");
    newPagination.className = "pagination";
    displayedGames.appendChild(newPagination);
    pagination(page, totalPages, newPagination.className, renderSearchedGames, keyword);

  } catch (error) {
    console.log("Render Searched Games error");
  }
};

const renderGamesByCategory = async (page, category) => {
  try {
    const searchedGames = await searchGamesByCategory(page, category);
    const listDisplayedGames = searchedGames.data;
    const totalPages = Math.ceil(searchedGames.total/10);

    const notification = document.getElementById("notification");
    notification.innerText = `Category: "${category}"`;

    renderGames(listDisplayedGames);

    const newPagination = document.createElement('ul');
    const displayedGames = document.getElementById("game-display");
    newPagination.className = "pagination";
    displayedGames.appendChild(newPagination);
    pagination(page, totalPages, newPagination.className, renderGamesByCategory, category);
  
  } catch (error) {
    console.log("Render Games By Category error");
  }
};

const renderListOfCategory = async (page) => {
  try {
    const searchedCategories = await getCategories(page);
    const listCategories = searchedCategories.data;
    const totalPages = Math.ceil(searchedCategories.total/10);

    const displayedGames = document.getElementById("game-display");
    displayedGames.innerHTML =` `;

    const notification = document.getElementById("notification");
    notification.innerText = `Categories`; 

    listCategories.forEach(Element => {
      const newDiv = document.createElement('div');
      newDiv.innerHTML = `<div class="category-wrapper">
      <div class="category">${Element.name}</div></div>`;
      newDiv.addEventListener("click", (Event) => {
        renderGamesByCategory(1 , Element.name);
      });
      displayedGames.appendChild(newDiv);
    });

    const newPagination = document.createElement('ul');
    newPagination.className = "pagination";
    displayedGames.appendChild(newPagination);
    pagination(page, totalPages, newPagination.className, renderListOfCategory);

  } catch (error) {
    console.log("Render List of Categories error")
  }
}

/* PAGINATION */


const pagination = (currentPage, totalPages, ulName, render, keyword) => {
  const prevPage = currentPage - 1;
  const nextPage = currentPage + 1;
  const ulPages = document.querySelector(`.${ulName}`);
  ulPages.innerHTML = ``;

  /*BACK BUTTON*/
  if (currentPage > 1){
    const backBtn = document.createElement('li');
    backBtn.innerHTML = `<li class="back-btn">&laquo;</li>`;
    backBtn.addEventListener("click", (Event) => {
      pagination(currentPage - 1, totalPages, ulName, render, keyword);
      render(currentPage - 1, keyword);
    });
    ulPages.appendChild(backBtn);
  }
  
  /*NUMBERS & DOTS*/
  
  for (let i = prevPage; i <= nextPage; i++)
    {
      if (i === 0) i = 1;
      if (i > totalPages) continue;
      isActive = (i === currentPage) ? 'active' : '';
      const selectedPage = document.createElement('li');
      selectedPage.className = `number ${isActive}`
      selectedPage.innerText = i;
      selectedPage.addEventListener("click", (Event) => {
        pagination(i, totalPages, ulName, render, keyword);
        render(i, keyword);
      });
      ulPages.append(selectedPage);
    }
  
  /*NEXT BUTTON*/
   if (currentPage < totalPages){
    const nextBtn = document.createElement('li');
    nextBtn.innerHTML = `<li class="next-btn">&raquo;</li>`;
    nextBtn.addEventListener("click", (Event) => {
      pagination(currentPage + 1, totalPages, ulName, render, keyword);
      render(currentPage + 1, keyword);
    });
    ulPages.appendChild(nextBtn);
  }
  
}

/* ASSIGNING BUTTONS */

const searchQuery = document.getElementById("search-box");
const searchIcon = document.getElementById("search-icon");

searchIcon.addEventListener("click", (Event) => {
  renderSearchedGames(1 , searchQuery.value);
});


const renderCategoriesDropdown = async (page, limit) => {
  try {
    const searchedCategories = await getCategories(page, limit);
    const gameCategories = searchedCategories.data;
    const dropdownCategories = document.getElementById("dropdown-categories");
    gameCategories.forEach(Element => {
      const newDiv = document.createElement('div');
      newDiv.innerHTML = `<div class="dropdown-category">${Element.name.charAt(0).toUpperCase() + Element.name.slice(1)}</div>`;
      newDiv.addEventListener("click", (Event) => {
        renderGamesByCategory(1, Element.name);
      })
      dropdownCategories.prepend(newDiv);
    });
    console.log(dropdownCategories);
  } catch (error) {
    console.log("error at renderCategoriesDropdown");
  }
}

renderCategoriesDropdown(1,5);

const moreCategory = document.getElementById("moreCategory");
moreCategory.addEventListener("click", (Event) => {
  renderListOfCategory(1);
});

renderFeaturedGames();
