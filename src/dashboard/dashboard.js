import { doc } from "prettier";
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

const onTrackSelection = (id, event) => {
    document.querySelectorAll("#tracks .track").forEach(trackItem => {
        if (trackItem.id == id) {
            trackItem.classList.add("bg-gray", "selected");
        }
        else {
            trackItem.classList.remove("bg-gray", "selected");
        }
    })

}

const onPlayTrack = (event, { image, artistNames, name, duration, previewUrl, id }) => {
    console.log(image, artistNames, name, duration, previewUrl, id);
    //  <img id="now-playing-image" class="h-12 w-12" src="" alt="" />
    //         <section class="flex flex-col justify-center">
    //           <h2
    //             id="now-playing-song"
    //             class="te text-sm font-semibold text-primary"
    //           >
    //             song title
    //           </h2>
    //           <p id="now-playing-artists" class="text-xs">song artists</p>
    //         </section>
    const nowPlayingSongImage = document.querySelector("#now-playing-image");
    const nowPlayingSongTitle = document.querySelector("#now-playing-song");
    const nowPlayingSongArtist = document.querySelector("#now-playing-artists");
    nowPlayingSongImage.src = image.url;

    nowPlayingSongTitle.textContent = name;
    nowPlayingSongArtist.textContent = artistNames;

}

//tracks loader
const loadPlaylistTracks = ({ tracks }) => {
    const trackSections = document.querySelector("#tracks");

    let trackNum = 1;
    for (let trackItem of tracks.items) {
        let { id, artists, name, album, duration_ms: duration, preview_url: previewUrl } = trackItem.track;
        let track = document.createElement("section");
        track.id = id;
        track.className = " mt-2 p-1 track grid grid-cols-[50px_1fr_1fr_50px] items-center justify-items-start gap-4 rounded-md text-secondary duration-200 hover:bg-light-black"
        let image = album.images.find(img => img.height === 64);
        let artistNames = Array.from(artists, artist => artist.name).join(", ");
        track.innerHTML = `<p  class=" relative w-full flex justify-center items-center justify-self-center "><span class="track-no">${trackNum++}</span></p>
              <section class="grid grid-flow-col gap-2 place-items-center">
                <img class="h-10 w-10 " src="${image.url}" alt="${name}" />
                <article class="flex flex-col gap-1 px-2 justify-center">
                  <h2 class="text-sm text-primary font-semibold line-clamp-1">${name}</h2>
                  <p class="text-xs text-secondary line-clamp-1 ">${artistNames}</p>
                </article>
              </section>
              <p class="text-sm line-clamp-1">${album.name}</p>
              <p  class="text-sm">${formatTime(duration)}</p>`;

        track.addEventListener("click", (event) => onTrackSelection(id, event));

        const playButton = document.createElement("button");
        playButton.id = `play-track${id}`;
        playButton.className = ` `
        playButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class= "invisible  w-4 h-4 play w-full absolute  left-4 top-1">
  <path fill-rule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clip-rule="evenodd" />
</svg>
`
        playButton.addEventListener("click", (event) => onPlayTrack(event, { image, artistNames, name, duration, previewUrl, id }))
        track.querySelector("p").appendChild(playButton);
        trackSections.appendChild(track);
    }

}

const fillContentForPlaylist = async (playlistId) => {
    const playlist = await fetchRequest(`${ENDPOINT.playlist}/${playlistId}`);
    console.log(playlist);
    const pageContent = document.querySelector("#page-content");
    pageContent.innerHTML = `<header id="playlist-header" class="mx-8 py-2  border-b-[0.3px] border-secondary border-opacity-30 duration-100 z-[10] ">
            <nav class= "py-2">
              <ul
                class=" text-sm uppercase grid grid-cols-[50px_1fr_1fr_50px] gap-4 text-secondary"
              >
                <li class="justify-self-center">#</li>
                <li>Title</li>
                <li>Album</li>
                <li>🕐</li>
              </ul>
            </nav>
          </header>
          <section class="px-8 mt-4" id="tracks">
          
          </section>`


    loadPlaylistTracks(playlist);

}

// scrolling handler
const onContentScroll = (event) => {
    const { scrollTop } = event.target;
    const header = document.querySelector(".header");

    if (scrollTop >= header.offsetHeight) {
        header.classList.add("sticky", "top-0", "bg-black");
        header.classList.remove("bg-transperent");

    } else {
        header.classList.remove("sticky", "top-0", "bg-black");
        header.classList.add("bg-transperent");

    }
    if (history.state.type === SECTIONTYPE.PLAYLIST) {
        const coverElement = document.querySelector("#cover-content");
        const playlistHeader = document.querySelector("#playlist-header");
        if (scrollTop >= (coverElement.offsetHeight - header.offsetHeight)) {
            playlistHeader.classList.add("sticky", "bg-black-secondary", "px-8");
            playlistHeader.classList.remove("mx-8");
            playlistHeader.style.top = `${header.offsetHeight - 1}px`
        }
        else {
            playlistHeader.classList.remove("sticky", "bg-black-secondary", "px-8");
            playlistHeader.classList.add("mx-8");
            playlistHeader.style.top = `revert`;
        }
    }

}
const loadSection = (section) => {
    if (section.type == SECTIONTYPE.DASHBOARD) {
        fillContentForDashboard();
        loadPlaylists();
    }
    else if (section.type == SECTIONTYPE.PLAYLIST) {
        fillContentForPlaylist(section.playlist);

    }
    document.querySelector(".content").removeEventListener("scroll", onContentScroll)
    document.querySelector(".content").addEventListener("scroll", onContentScroll)
}

//main function
document.addEventListener("DOMContentLoaded", () => {
    loadUserProfile();
    // const section = { type: SECTIONTYPE.DASHBOARD };
    const section = { type: SECTIONTYPE.PLAYLIST, playlist: "37i9dQZF1DX4dyzvuaRJ0n" }
    history.pushState(section, "", `/dashboard/playlist/${section.playlist}`);
    loadSection(section);
    // fillContentForDashboard();
    // loadPlaylists();

    document.addEventListener("click", () => {
        const profileMenu = document.querySelector("#profile-menu");
        if (!profileMenu.classList.contains("hidden")) {
            profileMenu.classList.add("hidden");
        }
    })



    window.addEventListener("popstate", (event) => {
        loadSection(event.state);
    })
})
