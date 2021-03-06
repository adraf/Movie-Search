import "dotenv/config";

const apiKey = process.env.API_KEY;
const url = "https://imdb-api.com/en/API";
const searchTitle = "SearchTitle";
const endPoint = `${url}/${searchTitle}/${apiKey}`;

function waitForJSON(res) {
  return res.json();
}
const outputDiv = document.querySelector('#output');

const menu = document.querySelector('#searchOptions');
const menuToggle = document.querySelector('#hamburger-wrapper');
const sideNav = document.querySelector("#mySidenav")

function animateSideBar() {
  menuToggle.addEventListener('click', (event) => {
    event.preventDefault();
    if (menu.style.display == 'block') {
      menu.style.display = 'none';       					 
      sideNav.style.width = "0px";
      menuToggle.classList.toggle("open")
    } else {
      menu.style.display = 'block';  
      sideNav.style.width = "250px";
      menuToggle.classList.toggle("open")
      makeListeners();
    }
  })
}
animateSideBar();

const makeListeners = event => {
  const onClick = () => {
    const onClickWithin = event => {
      let isClickInside = sideNav.contains(event.target);
      if (!isClickInside) {
        event.preventDefault();
        menu.style.display = 'none';       					 
        sideNav.style.width = "0px";
        menuToggle.classList.toggle("open")
      }
      document.removeEventListener('click', onClickWithin);
    };
    document.removeEventListener('click', onClick);
    document.addEventListener('click', onClickWithin);
  };
  document.addEventListener('click', onClick);
};

// ** To include? **
// Close sidebar on mouse leave
// function closeSidebar() {
//   sideNav.addEventListener('mouseleave', event => {
//     menu.style.display = 'none';       					 
//     sideNav.style.width = "0px";
//     menuToggle.classList.toggle("open")
//   })
// };
// closeSidebar();

// Start Page
function comingSoon() {
  const endPoint = `${url}/ComingSoon/${apiKey}`
  fetch(endPoint).then(waitForJSON).then(handleStartPage);
}
comingSoon();

// Template for movie info
function handleStartPage(data) {
  outputDiv.innerHTML = "";
  for (let i = 0; i < data.items.length; i++) {
    const title = data.items[i].title;
    const year = data.items[i].year;
    const searchID = data.items[i].id
    const posterImage = data.items[i].image;
    const posterImgCheck = (posterImage == `https://imdb-api.com/images/original/nopicture.jpg`) ? `<img id="posterSearch" src="https://raw.githubusercontent.com/adraf/Movie-Search/main/public/film-poster-placeholder.png" alt="${searchID}"></img>` : `<img id="posterSearch" src="${posterImage}" alt="${searchID}"></img>`;
    const release = data.items[i].releaseState;
    const releaseCheck = release ? `</br>${release}` : "";
    const html = `
      <article id="articleMovies">
        ${posterImgCheck}
        <div id="movieInfo">
          <h2>${title}</h2>
          <p>${year}${releaseCheck}</p>
        </div>
      <article>
    `;
  outputDiv.innerHTML += html;
  };
}

// SideNav Search Lists
document.body.addEventListener('click', function(event) {
  let sideNavSearch = event.target.closest(".sideNavList");
  if(sideNavSearch) {
    onButtonSelect(sideNavSearch.id);
    function onButtonSelect() {
      const searchTermText = sideNavSearch.id;
      const sideNavSearchInd = `${url}/${searchTermText}/${apiKey}`
      outputDiv.innerHTML = `<div id="loader"><h1>Loading...</h1></div>`
      // Close sideNav on link selection
      menu.style.display = 'none';       					 
      document.getElementById("mySidenav").style.width = "0px";
      menuToggle.classList.toggle("open")
      fetch(sideNavSearchInd).then(waitForJSON).then(handleStartPage);
    }
  }
});

function handleData(data) {
  outputDiv.innerHTML = "";
  for (let i = 0; i < data.results.length; i++) {
    const title = data.results[i].title;
    const yearDes = data.results[i].description;
    const year = yearDes.match(/\d+/)[0];
    const searchID = data.results[i].id;
    const posterImage = data.results[i].image;
    const posterImgCheck = (posterImage == `https://imdb-api.com/images/original/nopicture.jpg`) ? `<img id="posterSearch" src="https://raw.githubusercontent.com/adraf/Movie-Search/main/public/film-poster-placeholder.png" alt="${searchID}"></img>` : `<img id="posterSearch" src="${posterImage}" alt="${searchID}"></img>`;
    const html = `
    <article id="articleMovies">
      ${posterImgCheck}
      <div id="movieInfo">
        <h2>${title}</h2>
        <p>${year}</p>
      </div>
    <article>
    `;
  outputDiv.innerHTML += html;
  };
}

function getMovieData(searchTerm = "Scream") {
  outputDiv.innerHTML = `<div id="loader"><h1>Loading...</h1></div>`
  const endPoint = `${url}/${searchTitle}/${apiKey}/${searchTerm}`  
  fetch(endPoint).then(waitForJSON).then(handleData);
}

const form = document.querySelector("form");

function onFormSubmit(event) {
  event.preventDefault();
  const input = document.querySelector("input");
  const title = input.value.trim() === "" ? "Scream" : input.value;
  getMovieData(title);
}
form.addEventListener("submit", onFormSubmit);

function handleIndividualData(data) {
  outputDiv.innerHTML = "";
  const searchID = data.id;
  const indPoster = data.image;
  const indPosterImgCheck = (indPoster == `https://imdb-api.com/images/original/nopicture.jpg`) ? `<img id="indPoster" src="https://raw.githubusercontent.com/adraf/Movie-Search/main/public/film-poster-placeholder.png" alt="${searchID}"></img>` : `<img id="indPoster" src="${indPoster}" alt="${searchID}"></img>`;
  const indTitle = data.title;
  const indPlot = data.plot;
  const indPlotCheck = indPlot ? `<article>${indPlot}</article>` : "";
  const indRunTime = data.runtimeStr;
  const indRunTimeCheck = indRunTime ? `<li>${indRunTime}</li>` : "";
  const tagLine = data.tagline;
  const tagLineCheck = tagLine ? `<p id="tagLine">"${tagLine}"</p>` : "";
  const year = data.year;
  const director = data.directors;
  const directorCheck = director ? `<p><span style="color: rgb(84, 255, 209)">Director&nbsp;&nbsp;</span>${director}</p>` : "";
  const ageRating = data.contentRating;
  const ageRatingCheck = ageRating ? `<li>${ageRating}</li>` : "";
  const tomatoRating = data.ratings.rottenTomatoes; 
  const tomatoRatingCheck = (tomatoRating >= 1 && tomatoRating <= 40) ? `<p>Rotten Tomatoes:&nbsp;<span style="color:red">${tomatoRating}</span></p>` 
  : (tomatoRating > 40 && tomatoRating < 80) ? `<p>Rotten Tomatoes:&nbsp;<span style="color:orange">${tomatoRating}</span></p>` 
  : (tomatoRating >=80 && tomatoRating <= 97) ? `<p>Rotten Tomatoes:&nbsp;<span style="color:green">${tomatoRating}</span></p>`
  : (tomatoRating > 97 && tomatoRating <= 100) ? `<p>Rotten Tomatoes:&nbsp;<span style="color:green">&#128293;&nbsp;${tomatoRating}&nbsp;&#128293;</span></p>`
  : "";
  let similarFilms = "";
  for (let i = 0; i < data.similars.length; i++) {
    const searchID = data.similars[i].id;
    const similarTitle = data.similars[i].title;
    const similarPoster = data.similars[i].image;
    similarFilms += `
    <div id="similarTitleSection">
      <img id="posterSearch" src="${similarPoster}" alt="${searchID}">
      <h4>${similarTitle}</h4>
    </div>
    `
  }
  let actorInfo = "";
  for (let i = 0; i < data.actorList.length; i++) {
    const actors = data.actorList[i].name;
    const actorID = data.actorList[i].id;
    const actorImg = data.actorList[i].image;
    const actorImgCheck = (actorImg == `https://imdb-api.com/images/original/nopicture.jpg`) ? `<img id="actorHeadshot" src="https://raw.githubusercontent.com/adraf/Movie-Search/main/public/headshot.png" alt="${actorID}"></img>` : `<img id="actorHeadshot" src="${actorImg}" alt="${actorID}"></img>`
    const asCharacter = data.actorList[i].asCharacter;
    actorInfo += `
      <div id="actorSections">
        ${actorImgCheck}
        <h4 id="thisActor">${actors}</h4>
        <h5>${asCharacter}</h5>
      </div>
    `
  }
  const html = `
  <main>
    <section>
      ${indPosterImgCheck}
      ${tomatoRatingCheck}
    </section>
    <div id="IndMovieInfo">
      <h2>${indTitle}</h2>
      <aside>
        <ul>
          <li>${year}</li>
          ${ageRatingCheck}
          ${indRunTimeCheck}
        </ul>
        ${tagLineCheck}
        ${indPlotCheck}
        ${directorCheck}
      </aside>
    </div>
  </main>
  <div id="actorInfo">${actorInfo}</div>
  <div id="similarFilms">${similarFilms}</div>
  `; 
  outputDiv.innerHTML += html;
  };


document.body.addEventListener('click', function(event) {
  let poster = event.target.closest("#posterSearch");
  if(poster) {
    onMovieSelect(poster.alt);
    function onMovieSelect() {
      outputDiv.innerHTML = `<div id="loader"><h1>Loading...</h1></div>`
      const searchID = poster.alt;
      const searchIndividual = `${url}/Title/${apiKey}/${searchID}/FullActor,Posters,Images,Ratings,`
      fetch(searchIndividual).then(waitForJSON).then(handleIndividualData);
    };
  }
});

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

document.body.addEventListener('click', function(event) {
  let actorSection = event.target.closest("#actorSections");

  if(actorSection){
    onActorSelect(indPoster);
    function onActorSelect() {
      const searchID = indPoster.alt;
      const searchActor = `${url}/Title/${apiKey}/${searchID}/Images,`
      fetch(searchActor).then(waitForJSON).then(handleImages);
    };
    function handleImages(data) {
      outputDiv.innerHTML = "";
      const getName = actorSection.querySelector("#thisActor").innerHTML;
      const filteredImages = data.images.items.filter(({ title }) => {
        return title.toLowerCase().includes(getName.toLowerCase());
      });

      const imagesAsHtml = filteredImages.map(({ title, image }) => {
        return `
          <section>
            <img id="screenShots" src="${image}" />
            <h6>${title}</h6>
          </section>
        `;
      });
      const allImagesAsHtml = imagesAsHtml.join("");
      const thisHead = actorSection.querySelector("#actorHeadshot").src;
      const thisCharacter = actorSection.querySelector("h5").innerHTML;
      const indTitle = data.title;
      const html = `
      <div id="actorImagesHeader">
        <img src="${thisHead}" />
        <div id="text">
          <h2>${getName}</h2>
          <h4>Playing ${thisCharacter} in ${indTitle}</h4>
        </div>
      </div>
      <div id="screenShotMain">${allImagesAsHtml}</div>
      `
    outputDiv.innerHTML += html;
    };
  }
  scrollToTop();
});