# **Movie-Search**
## What am I looking at?

*Time Frame*

Completed in my spare time. It took 20 hours to complete the site I had set out to make. I am still playing with extra features to include, to enhance the site and user experience.

## Project Overview
The idea for this project came from my love of films and my overuse of IMDB to see who that person is and "what do we know them from?"

I set out to create a movie/tv search that let you see more information on what you are watching, but most importantly, being able to see the actor as the character they were portraying. The reason behind this was if there is heavy prosthetics, CGI characters or animation it's hard to tell where that voice is coming from. By selecting the film of interest, then the actor or character name you are looking for, you will be able to see screenshots of the actor in their role!

But I can see them on my screen, I hear you cry! Think of Pixar, Anime, the Avatar movies.. you can't always tell. You're welcome.

## Technologies Used

- HTML5
- CSS3
- JavaScript

## Featured Code

### Show Movie Screenshots
The whole point of this project was to be able to give users the ability to see the actor playing the character in the film they have searched. Once you have searched, or selected your film title, you can see more information about the film and a list of the actors with their character names. Once you select your chosen actor you are taken to a final page showing screen shots from the film featuring the actor. 

This was carried out by feeding the movie poster img in the actor’s information div, the film ID as its ‘alt’ information. This could then be accessed with a variable and used in the API URL to run a new fetch request and get the movie screenshot images. These images were then filtered down to see which screenshot image titles included the actor’s name and the resulting images are then displayed.

```
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
```
## Challenges

One main challenge I spent time on was trying to get one function to talk to another function to share pieces of information. In the end the simplest way was to combine the two together. From there I needed to figure out how to structure my for loop within it, so as not to loop all the other pieces of information.

## Wins

**Reusable Code** - The variables and CSS styling have transferred to different sections in the site.

**Similar Titles** - I had set this as a future feature to include but I was able to do this fairly quickly. You can now scroll through actors and also similar movie titles on the same page.

## Future Content

I would like to add more functionality to the app, and am still currently working on a few of these options: 

* The ability to go back a step e.g. to the movie page you were on previously to look into other cast members.
* Have more movies to select on the actors pages instead of having to start a new search for the screenshots.
* Add a slideshow to scroll through pictures in a modal.
