import { fetchRequest } from "../api";
import { ENDPOINT, logout, SECTIONTYPE } from "../common";

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
    const profileImage = document.querySelector("#profile-image");
    const defaultImage = document.querySelector("#default-image");
    const profileButton = document.querySelector("#user-profile-buttoon");
    const displayNameElement = document.querySelector("#display-name");

    const { display_name: displayName, images } = await fetchRequest(ENDPOINT.userInfo);
    if (images?.length) {
        defaultImage.classList.add("hidden");
        ;
        const [{ url: imageUrl }] = images;
        profileImage.setAttribute("src", `${imageUrl}`);
    }
    else {
        defaultImage.classList.remove("hidden");
        profileImage.classList.add("hidden");
    }

    profileButton.addEventListener("click", onProfileClick)
    displayNameElement.textContent = displayName;


}

const onPlaylistItemClicked = (event, id) => {
    console.log(event.target);
    const section = { type: SECTIONTYPE.PLAYLIST, playlist: id }
    history.pushState(section, "", `playlist/${id}`);
    loadSection(section);
}

//playlist loader
const loadPlaylist = async (endpoint, elementId) => {
    const playListItemsSection = document.querySelector(`#${elementId}`);
    const { playlists: { items } } = await fetchRequest(endpoint);
    for (let { name, description, images, id } of items) {

        const playListItem = document.createElement("section");
        playListItem.className = "bg-black-secondary rounded  p-4 hover:cursor-pointer hover:bg-light-black duration-300";
        playListItem.id = id;
        playListItem.addEventListener("click", (event) => onPlaylistItemClicked(event, id));
        playListItem.setAttribute("data-type", "playlist");
        const [{ url: imageUrl }] = images;
        playListItem.innerHTML = `<img src= "${imageUrl}"
                alt="${name}"
                class="rounded mb-2 object-contain shadow"
              />
              <h2 class="text-base font-semibold mb-4 truncate" >${name}</h2>
              <h3 class="text-sm text-secondary line-clamp-2">${description}</h3>`
        playListItemsSection.appendChild(playListItem);
        // <img class="relative w-16 h-16 top-0 z-5" src="./play-playlist-icon.png" alt="play" />
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

const formatTime = (duration) => {
    const min = Math.floor(duration / 60_000);
    const sec = ((duration % 6_000 / 1000).toFixed(0))
    const formattedTime = sec == 60 ? min + 1 + "00" : min + ":" + (sec < 10 ? "0" : "") + sec;
    return formattedTime;
}

//tracks loader
const loadPlaylistTracks = ({ tracks }) => {
    const trackSections = document.querySelector("#tracks");

    let trackNum = 1;
    for (let trackItem of tracks.items) {
        let { id, artists, name, album, duration_ms: duration } = trackItem.track;
        let track = document.createElement("section");
        track.id = id;
        track.className = " p-1 track grid grid-cols-[50px_2fr_1fr_50px] items-center justify-items-start gap-4 rounded-md text-secondary duration-200 hover:bg-light-black"
        let image = album.images.find(img => img.height === 64);
        track.innerHTML = `<p class="justify-self-center">${trackNum++}</p>
              <section class="grid grid-flow-col gap-2 place-items-center">
                <img class="h-10 w-10 " src="${image.url}" alt="${name}" />
                <article class="flex flex-col gap-1 px-2">
                  <h2 class="text-sm text-primary font-semibold">${name}</h2>
                  <p class="text-sm text-secondary">${Array.from(artists, artist => artist.name).join(", ")}</p>
                </article>
              </section>
              <p class="text-sm">${album.name}</p>
              <p  class="text-sm">${formatTime(duration)}</p>`;

        trackSections.appendChild(track);
    }

}

const fillContentForPlaylist = async (playlistId) => {
    const playlist = await fetchRequest(`${ENDPOINT.playlist}/${playlistId}`);
    console.log(playlist);
    const pageContent = document.querySelector("#page-content");
    pageContent.innerHTML = `<header class="px-8">
            <nav>
              <ul
                class="grid grid-cols-[50px_2fr_1fr_50px] gap-4 text-secondary"
              >
                <li class="justify-self-center">#</li>
                <li>Title</li>
                <li>Album</li>
                <li>🕐</li>
              </ul>
            </nav>
          </header>
          <section class="px-8" id="tracks">
          
          </section>`


    loadPlaylistTracks(playlist);

}

const loadSection = (section) => {
    if (section.type == SECTIONTYPE.DASHBOARD) {
        fillContentForDashboard();
        loadPlaylists();
    }
    else if (section.type == SECTIONTYPE.PLAYLIST) {
        fillContentForPlaylist(section.playlist);

    }
}

//main function
document.addEventListener("DOMContentLoaded", () => {
    loadUserProfile();
    const section = { type: SECTIONTYPE.DASHBOARD };
    history.pushState(section, "", "");
    loadSection(section);
    // fillContentForDashboard();
    // loadPlaylists();

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

    window.addEventListener("popstate", (event) => {
        loadSection(event.state);
    })
})
