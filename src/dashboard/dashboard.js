import { fetchRequest } from "../api";
import { ENDPOINT, logout } from "../common";

const onProfileClick = (event) => {
    event.stopPropagation();
    const profileMenu = document.querySelector("#profile-menu");
    profileMenu.classList.toggle("hidden");

    if (!profileMenu.classList.contains("hidden")) {
        profileMenu.querySelector("li#logout").addEventListener("click", logout);
    } else {

    }
}

const loadUserProfile = async () => {
    const defaultImage = document.querySelector("#default-image");
    const profileButton = document.querySelector("#user-profile-buttoon");
    const displayNameElement = document.querySelector("#display-name");

    const { display_name: displayName, images } = await fetchRequest(ENDPOINT.userInfo);
    if (images?.length) {
        defaultImage.classList.add("hidden");

    }
    else {
        defaultImage.classList.remove("hidden");
    }

    profileButton.addEventListener("click", onProfileClick)
    displayNameElement.textContent = displayName;


}

const onPlaylistItemClicked = (event) => {
    console.log(event.target);
}

//playlist loader
const loadPlaylist = async (endpoint, elementId) => {
    const playListItemsSection = document.querySelector(`#${elementId}`);
    const { playlists: { items } } = await fetchRequest(endpoint);
    for (let { name, description, images, id } of items) {

        const playListItem = document.createElement("section");
        playListItem.className = "bg-black-secondary rounded  p-4 hover:cursor-pointer hover:bg-light-black duration-300";
        playListItem.id = id;
        playListItem.addEventListener("click", onPlaylistItemClicked);
        playListItem.setAttribute("data-type", "playlist");
        const [{ url: imageUrl }] = images;
        playListItem.innerHTML = `<img src= "${imageUrl}"
                alt="${name}"
                class="rounded mb-2 object-contain shadow"
              />
              <h2 class="text-base font-semibold mb-4 truncate" >${name}</h2>
              <h3 class="text-sm text-secondary line-clamp-2">${description}</h3>`
        playListItemsSection.appendChild(playListItem);
    }

}

//common function for loading all playlists
const loadPlaylists = () => {
    loadPlaylist(ENDPOINT.featuredPlaylist, "featured-playlist");
    loadPlaylist(ENDPOINT.topLists, "top-playlist");
}

//section generator for playlist
const fillContentForDashboard = () => {

    const pageContent = document.querySelector("#page-content");
    const playlistMap = new Map([["featured", "featured-playlist"], ["top playlists", "top-playlist"]]);
    let innerHTML = ``;
    for (let [type, id] of playlistMap) {
        innerHTML += ` <article class="p-4">
          <h1 class="mb-4 text-2xl font-bold capitalize">${type}</h1>

          <section
            id="${id}"
            class="featured-songs grid grid-cols-auto-fill-cards gap-4"
          >
          </section>
        </article>`;
    }
    pageContent.innerHTML = innerHTML;
}

//main function
document.addEventListener("DOMContentLoaded", () => {
    loadUserProfile();
    fillContentForDashboard();
    loadPlaylists();

    document.addEventListener("click", () => {
        const profileMenu = document.querySelector("#profile-menu");
        if (!profileMenu.classList.contains("hidden")) {
            profileMenu.classList.add("hidden");
        }
    })

    document.querySelector(".content").addEventListener("scroll", (event) => {
        const { scrollTop } = event.target;
        const header = document.querySelector(".header");

        if (scrollTop >= header.offsetHeight) {
            header.classList.add("sticky", "top-0", "bg-black-secondary");
            header.classList.remove("bg-transperent");

        } else {
            header.classList.remove("sticky", "top-0", "bg-black-secondary");
            header.classList.add("bg-transperent");

        }
    })

})