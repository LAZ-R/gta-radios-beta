import * as LAZR from '../../../lazR/lazR.js';
import * as FILTER from '../../../lazR/core/css/filter/filter.js';
import * as HEADER from '../../../components/header/header.component.js';
import { getGameById } from '../../../services/games.service.js';
import { getRadioById } from '../../../services/radios.service.js';

export let music;

let isLooping = false;
let loopTimer;

let isLooping2 = false;
let loopTimer2;
let musicName;
let musicArtist;

let isLooping3 = false;
let loopTimer3;

let currentRadio;

const getPlayPauseButtonIcon = (radio) => {
    return `<img id="playPauseIcon" class="play-pause-icon" src="./medias/images/font-awsome/circle-pause-solid.svg" alt="test" style="filter: ${FILTER.getFilterStringForHexValue(radio.color)}">`
}

const getLikeButtonIcon = () => {
    let icon = '';
    // Ajouter un check si liked de base ou pas
    //if (radio.isLiked) {
    //    icon = `<img id="likeIcon" class="like-icon" src="./medias/images/font-awsome/heart-solid.svg" alt="test" style="filter: ${FILTER.getFilterStringForHexValue(radio.color)}">`
    //} else {
        icon = `<img id="likeIcon" class="like-icon" src="./medias/images/font-awsome/heart-regular.svg" alt="unliked" style="filter: ${FILTER.getFilterStringForHexValue('#878787')}">`
    //}
    return icon; 
}

const getPlaylistModalButtonIcon = () => {
        return `<img id="playlistModalIcon" class="playlist-modal-icon" src="./medias/images/font-awsome/rectangle-list-regular.svg" alt="unopened-playlist" style="filter: ${FILTER.getFilterStringForHexValue('#878787')}">`
}

// BACKGROUND ANIMATION -------------------------------------------------------

const animateBackground = (game, isFirstTime, oldRnd) => {

    // Vérifie si la boucle est déjà en cours d'exécution
    if (isLooping) {
        return;
    }
    isLooping = true;

    console.log('isAnimating')

    // Code
    const body = document.getElementById('body');
    if (isFirstTime) {
        body.style.backgroundPosition = 'left top';
        body.style.transition = 'background-position 30s linear, background-image 1s linear';
        body.style.backgroundRepeat = 'no-repeat';
        body.style.backgroundSize = '85vh';
    }
    const max = game.backgrounds.length - 1;
    let rnd = LAZR.MATHS.getRandomIntegerBetween(0, max);

    if (oldRnd != undefined) {
        while (rnd == oldRnd) {
            rnd = LAZR.MATHS.getRandomIntegerBetween(0, max);
        }
    }

    setTimeout(() => {
        body.style.backgroundImage = `url(./medias/images/backgrounds/${game.backgrounds[rnd]}.webp)`;
    }, isFirstTime ? 500 : 0);
    
    if (body.style.backgroundPosition == 'left top') {
        body.style.backgroundPosition = 'right top';
    } else {
        body.style.backgroundPosition = 'left top';
    }

    // Boucle
    loopTimer = setTimeout(() => {
        isLooping = false;
        animateBackground(game, false, rnd);
    }, 30000);
}

// Pour annuler la boucle de l'extérieur
export function stopAnimateBackground() {
    if (isLooping) {
      clearTimeout(loopTimer); // Annule le timer
      isLooping = false;
    }
  }

// MUSIC INFOS ----------------------------------------------------------------

const setMusicInfos = (radio, isFirstTime, oldMusic) => {
    // Vérifie si la boucle est déjà en cours d'exécution
    if (isLooping2) {
        return;
    }
    isLooping2 = true;

    // Code
    if (radio.playlist != undefined) {
        let time = Math.round(music.currentTime);
        let newMusicName;
        let hasMusicPlaying = false;
        radio.playlist.forEach(musicFromPlaylist => {
            if (time >= musicFromPlaylist.start && time < musicFromPlaylist.end) {
                hasMusicPlaying = true;
                newMusicName = musicFromPlaylist.name;
                if (newMusicName != musicName) {
                    musicName = newMusicName;
                    musicArtist = musicFromPlaylist.artist;
                }
            }
        });
    
        const musicNameContainer = document.getElementById('musicName');
        const musicArtistContainer = document.getElementById('musicArtist');
    
        if (musicNameContainer != null && musicArtistContainer != null) {
            if (hasMusicPlaying) {
                // Gestion playlist
                const rowElement = document.getElementById('music-row-' + cleanString(musicName));
                if (rowElement != undefined) {
                    rowElement.style.border = `1px solid ${radio.color}`;
                    rowElement.style.backgroundColor = "#2b2b2b"
                }
                
                if (musicName != musicNameContainer.innerHTML && musicArtist != musicArtistContainer.innerHTML) {
                    musicNameContainer.innerHTML = musicName;
                    musicArtistContainer.innerHTML = musicArtist;

                    setTimeout(() => {
                        musicNameContainer.style.opacity = 1;
                        musicArtistContainer.style.opacity = 1;
                    }, 500);
                    
                }
            }
            if (!hasMusicPlaying) {
                musicNameContainer.style.opacity = 0;
                musicArtistContainer.style.opacity = 0;

                // Gestion playlist 

                const rows = document.getElementsByClassName('playlist-table-row');
                if (rows !== undefined) {
                    for (let i = 0; i < rows.length; i++) {
                        rows.item(i).style.border = '1px solid transparent';
                        rows.item(i).style.backgroundColor = "transparent";
                    };
                }

                setTimeout(() => {
                    musicNameContainer.innerHTML = '';
                    musicArtistContainer.innerHTML = '';
                }, 500);
            }
        }
    }

    // Boucle
    loopTimer2 = setTimeout(() => {
        isLooping2 = false;
        setMusicInfos(radio, false, musicName);
    }, 1000);
}

// Pour annuler la boucle de l'extérieur
export function stopMusicInfos() {
    if (isLooping2) {
        clearTimeout(loopTimer2); // Annule le timer
        isLooping2 = false;
    }
}

// Gestion inner click ----------------------------------------------------------------

const loopPreventInnerClick = () => {
    // Vérifie si la boucle est déjà en cours d'exécution
    if (isLooping3) {
        return;
    }
    isLooping3 = true;

    // Code
    window.innerDocClick = false;
    

    // Boucle
    loopTimer3 = setTimeout(() => {
        isLooping3 = false;
        loopPreventInnerClick();
    }, 100);
}

// Pour annuler la boucle de l'extérieur
export function stopLoopPreventInnerClick() {
    if (isLooping3) {
        clearTimeout(loopTimer3); // Annule le timer
        isLooping3 = false;
    }
}

// MUSIC CONTROLS -------------------------------------------------------------

const playPause = () => {
    const playPauseIcon = document.getElementById('playPauseIcon');
    if (music.paused) {
        playPauseIcon.setAttribute('src', './medias/images/font-awsome/circle-pause-solid.svg');
        music.play();
    } else {
        music.pause();
        playPauseIcon.setAttribute('src', './medias/images/font-awsome/circle-play-solid.svg');
    }
}
window.playPause = playPause;

const onLikeClick = (radioColor) => {
    const likeIcon = document.getElementById('likeIcon');
    if (likeIcon.getAttribute('alt') == 'unliked') { // Changer le check
        likeIcon.setAttribute('src', './medias/images/font-awsome/heart-solid.svg');
        likeIcon.setAttribute('alt', 'liked');
        likeIcon.setAttribute('style', `filter: ${FILTER.getFilterStringForHexValue(radioColor)}`);
        // ajouter la suppression
    } else {
        likeIcon.setAttribute('src', './medias/images/font-awsome/heart-regular.svg');
        likeIcon.setAttribute('alt', 'unliked');
        likeIcon.setAttribute('style', `filter: ${FILTER.getFilterStringForHexValue('#878787')}`);
        // ajouter l'ajout
    }
}
window.onLikeClick = onLikeClick;

export const destroyModal = (isFromModalItself) => {
    const modalBackground = document.getElementById('modalBackground');
    if (modalBackground != null && modalBackground != undefined) {
        modalBackground.remove();
    }
    if (isFromModalItself) {
        onPlaylistModalClick();
    }
}
window.destroyModal = destroyModal;

const onPlaylistModalClick = (radioColor) => {
    if (currentRadio.playlist != undefined) {
        const playlistModalIcon = document.getElementById('playlistModalIcon');
        const playlistModalButton = document.getElementById('playlistModalButton');

        if (playlistModalIcon.getAttribute('alt') == 'unopened-playlist') {
            playlistModalIcon.setAttribute('src', './medias/images/font-awsome/rectangle-list-solid.svg');
            playlistModalIcon.setAttribute('alt', 'opened-playlist');
            playlistModalIcon.setAttribute('style', `filter: ${FILTER.getFilterStringForHexValue(radioColor)}`);

            playlistModalButton.style.zIndex = '100';


            const body = document.getElementById('body');
            const modalBackground = LAZR.DOM.createElement('div', 'modalBackground', 'modal-background', `
                <div class="modal-div">
                    <div class="modal-inner-div">
                        <span class="modal-title">${currentRadio.name}</span>
                        ${getPlaylistElement()}
                    </div>
                </div>
            `);
            modalBackground.addEventListener('click', () => {
                destroyModal(true);
            })
            body.appendChild(modalBackground);
        } else {
            playlistModalIcon.setAttribute('src', './medias/images/font-awsome/rectangle-list-regular.svg');
            playlistModalIcon.setAttribute('alt', 'unopened-playlist');
            playlistModalIcon.setAttribute('style', `filter: ${FILTER.getFilterStringForHexValue('#878787')}`);

            playlistModalButton.style.zIndex = 'auto';
            // ajouter l'ajout
        }
    }
}
window.onPlaylistModalClick = onPlaylistModalClick;

const cleanString = (string) => {
    // Convertit la chaîne en minuscules
    let cleanedString = string.toLowerCase();
    // Supprime les accents
    cleanedString = cleanedString.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    // Supprime les caractères spéciaux (ne laisser que les lettres et les chiffres)
    cleanedString = cleanedString.replace(/[^a-zA-Z0-9 ]/g, "");
    // Remplace les espaces par des tirets
    cleanedString = cleanedString.replace(/\s+/g, '-');
    return cleanedString;
}

const getPlaylistElement = () => {
    let string = `<div class="playlist-table">`;
    currentRadio.playlist.forEach(title => {
        string += `
            <div id="music-row-${cleanString(title.name)}" class="playlist-table-row">
                <div class="playlist-table-name-div">
                    <span>${title.name}</span>
                </div>
                <div class="playlist-table-artist-div">
                    <span>${title.artist}</span>
                </div>
            </div>
        `;
    });
    string += `</div>`;
    return string;
}

// RENDERING ------------------------------------------------------------------

export const renderPage = () => {

    let shouldGenerateNewMusic = true;

    const getRadioIcon = (radio) => {
        return `
            <div class="radio-icon" style="border: 5px solid ${radio.color}">
                <img src="./medias/images/radio-icons/${radio.icon}.webp" class="radio-icon-img" />
            </div>
        `;
    }

    const getGameIdRegex = /(?<=gameId=)\w+/g;
    let gameIdArray = window.location.hash.match(getGameIdRegex);
    let gameId = '';
    if (gameIdArray != null) {
        gameId = gameIdArray[0];
    }
    const game = getGameById(gameId);

    const getRadioIdRegex = /(?<=radioId=)\w+/g;
    let radioIdArray = window.location.hash.match(getRadioIdRegex);
    let radioId = '';
    if (radioIdArray != null) {
        radioId = radioIdArray[0];
    }
    const radio = getRadioById(radioId);
    currentRadio = radio;

    const pageTitle = radio.name;
    LAZR.DOM.setHTMLTitle(pageTitle);

    if (music != undefined) {
        const pattern = /radios\/(.*?)\.mp3/;
        const match = music.src.match(pattern);
        const result = match[1];
        if (result != radio.file) {
            music.pause();
        } else {
            shouldGenerateNewMusic = false;
        }
    }

    const headerTitle = LAZR.DOM.createElement('h1', 'headerTitle', 'header-title', `
        Grand Theft Auto
        <br>
        <b>${game.name}</b>
    `);
    HEADER.edit(
        true, 
        headerTitle, 
        false
    );
    const page = LAZR.DOM.createElement('div', 'gameRadiosPage', 'page', `
        <div class="radio-main-container">
            <div class="radio-radio-container">
                ${getRadioIcon(radio)}
                <span class="radio-name-container">${radio.name}</span>
            </div>
            <div class="radio-music-container">
                <span id="musicName" class="music-name"></span>
                <span id="musicArtist" class="music-artist"></span>
            </div>
        </div>
        <div class="radio-controls-container">
            <button id="radioLikeButton" class="music-control-button radio-like-button" onclick="onLikeClick('${radio.color}')">${getLikeButtonIcon(radio)}</button>
            <button id="playPauseButton" class="music-control-button play-pause-button" onclick="playPause()">${getPlayPauseButtonIcon(radio)}</button>
            <button id="playlistModalButton" class="music-control-button playlist-modal-button" onclick="onPlaylistModalClick('${radio.color}')">${getPlaylistModalButtonIcon()}</button>
        </div>
    `);

    if (shouldGenerateNewMusic) {
        music = new Audio(`./medias/audio/radios/${radio.file}.mp3`);
        music.loop = true;
        let min = 100;
        let max = 2700;
        if (radio.playlist != undefined) {
            min = radio.playlist[0].start;
            max = radio.playlist[radio.playlist.length - 1].start;
        }
        let startTime = LAZR.MATHS.getRandomIntegerBetween(min, max);
        music.currentTime = startTime;
        music.play();
    }

    animateBackground(game, true);
    setMusicInfos(radio);
    loopPreventInnerClick();

    page.style.background = '';
    document.getElementById('header').style.backdropFilter = 'blur(3px) grayscale(100%) brightness(50%)';
    page.style.backdropFilter = 'blur(3px) grayscale(100%) brightness(50%)';
    //page.style.padding = '0 var(--horizontal-padding)';
    return page;
}

