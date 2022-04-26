import "dotenv/config";

const apiKey = process.env.API_KEY;
const url = "https://imdb-api.com/en/API";
const searchTitle = "SearchTitle"
const endPoint = `${url}/${searchTitle}/${apiKey}`;

function waitForJSON(res) {
  return res.json();
}

const outputDiv = document.querySelector('#output');

function handleData(data) {
    outputDiv.innerHTML = "";
    for (let i = 0; i < data.results.length; i++) {
    const title = data.results[i].title;
    const yearDes = data.results[i].description;
    const year = yearDes.match(/\d+/)[0];
    const posterImage = data.results[i].image;
    const searchID = data.results[i].id;
    const html = `
    <article id="articleMovies">
      <img id="posterSearch" src="${posterImage}" alt="${searchID}">
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
  outputDiv.innerHTML = `<div id="loader"><h1>Loading...</h1></div>` // TO FIX
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
getMovieData();
form.addEventListener("submit", onFormSubmit);

function handleIndividualData(data) {
  outputDiv.innerHTML = "";
  const indPoster = data.image;
  const searchID = data.id;
  const indTitle = data.title;
  const indPlot = data.plot;
  const indRunTime = data.runtimeStr;
  const year = data.year;
  const director = data.directors;
  const ageRating = data.contentRating;
  const tomatoRating = data.ratings.rottenTomatoes;
  let actorInfo = "";
  for (let i = 0; i < data.actorList.length; i++) {
    const actors = data.actorList[i].name;
    const actorID = data.actorList[i].id;
    const actorImg = data.actorList[i].image;
    const asCharacter = data.actorList[i].asCharacter;
    actorInfo += `
      <div id="actorSections">
        <img id="actorHeadshot" src="${actorImg}" alt="${actorID}">
        <h4 id="thisActor">${actors}</h4>
        <h5>${asCharacter}</h5>
      </div>
    `
  }
  const html = `
  <main>
    <section>
      <img id="indPoster" src="${indPoster}" alt="${searchID}">
      <p>Rotten Tomatoes: ${tomatoRating}</p>
    </section>
    <div id="IndMovieInfo">
      <h2>${indTitle}</h2>
      <aside>
        <ul>
          <li>${year}</li>
          <li>${ageRating}</li>
          <li>${indRunTime}</li>
        </ul>
        <article>${indPlot}</article>
        <p><span style="color: rgb(84, 255, 209)">Director  </span>${director}</p>
      </aside>
    </div>
  </main>
  <div id="actorInfo">${actorInfo}</div>
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
