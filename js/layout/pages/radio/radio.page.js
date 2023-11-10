import * as LAZR from '../../../lazR/lazR.js';
import * as FILTER from '../../../lazR/core/css/filter/filter.js';
import * as HEADER from '../../../components/header/header.component.js';
import { getGameById } from '../../../services/games.service.js';
import { getRadioById } from '../../../services/radios.service.js';

export let music;

let isLooping = false;
let loopTimer;
let loopTimerBis;

let isLooping2 = false;
let loopTimer2;
let musicName;
let musicArtist;

let isLooping3 = false;
let loopTimer3;

let isLooping4 = false;
let loopTimer4;

let currentRadio;
let isMusicLoaded = false;

let shouldGenerateNewMusic = true;

const setLiked = (radioId) => {
    if (!isRadioLiked(radioId)) {
        let user = LAZR.STORAGE.getUser();
        user.liked.push(radioId);
        LAZR.STORAGE.setUser(user);
    }
}
const unsetLiked = (radioId) => {
    if (isRadioLiked(radioId)) {
        let user = LAZR.STORAGE.getUser();
        user.liked = user.liked.filter(e => e !== radioId)
        LAZR.STORAGE.setUser(user);
    }
}

const isRadioLiked = (radioId) => {
    let user = LAZR.STORAGE.getUser();
    let isLiked = false;
    user.liked.forEach(element => {
        if (element == radioId) {
            isLiked = true;
        }
    });
    return isLiked;
}

const getPlayPauseButtonIcon = (radio) => {
    return shouldGenerateNewMusic 
        ? `<img id="playPauseIcon" class="play-pause-icon" src="./medias/images/font-awsome/circle-play-regular.svg" alt="test" style="filter: ${FILTER.getFilterStringForHexValue('#878787')}">` 
        : `<img id="playPauseIcon" class="play-pause-icon" src="./medias/images/font-awsome/circle-pause-solid.svg" alt="test" style="filter: ${FILTER.getFilterStringForHexValue(radio.color)}">`
}

const getLikeButtonIcon = (radio) => {
    let icon = '';
    // Ajouter un check si liked de base ou pas
    if (isRadioLiked(radio.id)) {
        icon = `<img id="likeIcon" class="like-icon" src="./medias/images/font-awsome/heart-solid.svg" alt="test" style="filter: ${FILTER.getFilterStringForHexValue(radio.color)}">`
    } else {
        icon = `<img id="likeIcon" class="like-icon" src="./medias/images/font-awsome/heart-regular.svg" alt="unliked" style="filter: ${FILTER.getFilterStringForHexValue('#878787')}">`
    }
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
    
    // Code
    let isStillFirstTime = false;
    let loopingTime = 30000;
    const max = game.backgrounds.length - 1;
    let rnd = LAZR.MATHS.getRandomIntegerBetween(0, max);

    if (oldRnd != undefined) {
        while (rnd == oldRnd) {
            rnd = LAZR.MATHS.getRandomIntegerBetween(0, max);
        }
    }

    if (isMusicLoaded) {
        const body = document.getElementById('body');
        if (isFirstTime) {
            body.style.backgroundPosition = 'left top';
            body.style.backgroundImage = `url(./medias/images/backgrounds/blank.png)`;
            body.style.transition = 'background-position 30s linear, background-image .5s linear';
            body.style.backgroundRepeat = 'no-repeat';
            body.style.backgroundSize = '85vh';
        }

        setTimeout(() => {
            body.style.backgroundImage = `url(./medias/images/backgrounds/${game.backgrounds[rnd]}.webp)`;
        }, isFirstTime ? 500 : 0);

        if (body.style.backgroundPosition == 'left top') {
            body.style.backgroundPosition = 'right top';
        } else {
            body.style.backgroundPosition = 'left top';
        }

        loopTimerBis = setTimeout(() => {
            body.style.backgroundImage = `url(./medias/images/backgrounds/blank.png)`;
        }, 29500);
    } else {
        isStillFirstTime = true;
        loopingTime = 50;
    }

    // Boucle
    loopTimer = setTimeout(() => {
        isLooping = false;
        animateBackground(game, isStillFirstTime, rnd);
    }, loopingTime);
}

// Pour annuler la boucle de l'extérieur
export function stopAnimateBackgroundBis() {
    clearTimeout(loopTimerBis); // Annule le timer
}

// Pour annuler la boucle de l'extérieur
export function stopAnimateBackground() {
    if (isLooping) {
        stopAnimateBackgroundBis();
        clearTimeout(loopTimer); // Annule le timer
        isLooping = false;
    }
}

// MUSIC INFOS ----------------------------------------------------------------

const setMusicInfos = (radio, isFirstTime) => {
    // Vérifie si la boucle est déjà en cours d'exécution
    if (isLooping2) {
        return;
    }
    isLooping2 = true;

    let isStillFirstTime = false;
    let loopTime = 100;

    if (isMusicLoaded) {
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
                    
                    if (musicName != musicNameContainer.innerHTML) {
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
    } else {
        isStillFirstTime = true;
        loopTime = 50;
    }

    // Boucle
    loopTimer2 = setTimeout(() => {
        isLooping2 = false;
        setMusicInfos(radio, isStillFirstTime, musicName);
    }, loopTime);
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
        playPauseIcon.setAttribute('style', `filter: ${FILTER.getFilterStringForHexValue(currentRadio.color)}`);
        music.play();
        animateListItem(cleanString(currentRadio.name));
    } else {
        playPauseIcon.setAttribute('src', './medias/images/font-awsome/circle-play-regular.svg');
        playPauseIcon.setAttribute('style', `filter: ${FILTER.getFilterStringForHexValue('#878787')}`);
        music.pause();
        killAnimateListItem();
    }
}
window.playPause = playPause;

const onLikeClick = (radioColor, radioId) => {
    const likeIcon = document.getElementById('likeIcon');
    if (likeIcon.getAttribute('alt') == 'unliked') { // Changer le check
        likeIcon.setAttribute('src', './medias/images/font-awsome/heart-solid.svg');
        likeIcon.setAttribute('alt', 'liked');
        likeIcon.setAttribute('style', `filter: ${FILTER.getFilterStringForHexValue(radioColor)}`);
        // ajout
        setLiked(radioId);

    } else {
        likeIcon.setAttribute('src', './medias/images/font-awsome/heart-regular.svg');
        likeIcon.setAttribute('alt', 'unliked');
        likeIcon.setAttribute('style', `filter: ${FILTER.getFilterStringForHexValue('#878787')}`);
        // suppression
        unsetLiked(radioId);
    }
}
window.onLikeClick = onLikeClick;

export const destroyModal = (isFromModalItself) => {
    const modalBackground = document.getElementById('modalBackground');
    if (modalBackground != null && modalBackground != undefined) {
        modalBackground.style.opacity = 0;
        setTimeout(() => {
            modalBackground.remove();
        }, 200);
    }
    if (isFromModalItself) {
        onPlaylistModalClick();
    }
}
window.destroyModal = destroyModal;

const onPlaylistModalClick = (radioColor) => {
    if (currentRadio.playlist != undefined) {
        const playlistModalIcon = document.getElementById('playlistModalIcon');

        if (playlistModalIcon.getAttribute('alt') == 'unopened-playlist') {
            playlistModalIcon.setAttribute('src', './medias/images/font-awsome/rectangle-list-solid.svg');
            playlistModalIcon.setAttribute('alt', 'opened-playlist');
            playlistModalIcon.setAttribute('style', `filter: ${FILTER.getFilterStringForHexValue(radioColor)}`);

            const body = document.getElementById('body');
            const modalBackground = LAZR.DOM.createElement('div', 'modalBackground', 'modal-background', `
                <div class="modal-div" id="modalDiv">
                    <div class="modal-inner-div">
                        <span class="modal-title">${currentRadio.name}</span>
                        <!-- <span class="modal-sub-title">Animée par</span> -->
                        <span class="modal-sub-title" style="font-weight: 100;margin-bottom: 30px">${currentRadio.host}</span>
                        ${getPlaylistElement()}
                    </div>
                </div>
            `);
            modalBackground.addEventListener('click', (e) => {
                destroyModal(true);
            });
            body.appendChild(modalBackground);
            setTimeout(() => {
                let modalBg = document.getElementById('modalBackground');
                if (modalBg != null && modalBg != undefined) {
                    modalBg.style.opacity = 1;
                    setTimeout(() => {
                        const modalDiv = document.getElementById('modalDiv');
                        modalDiv.style.opacity = 1;
                    }, 200);
                }
            }, 10);
        } else {
            playlistModalIcon.setAttribute('src', './medias/images/font-awsome/rectangle-list-regular.svg');
            playlistModalIcon.setAttribute('alt', 'unopened-playlist');
            playlistModalIcon.setAttribute('style', `filter: ${FILTER.getFilterStringForHexValue('#878787')}`);
        }
    }
}
window.onPlaylistModalClick = onPlaylistModalClick;

export const cleanString = (string) => {
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

const setMusic = (musicStartTime, musicEndTime) => {
    if (music.currentTime > musicEndTime || music.currentTime < musicStartTime) {
        music.currentTime = musicStartTime;
    }
    if (music.paused) {
        music.play();
    }
}
window.setMusic = setMusic;

const getPlaylistElement = () => {
    let string = `<div class="playlist-table">`;
    currentRadio.playlist.forEach(title => {
        string += `
            <div id="music-row-${cleanString(title.name)}" class="playlist-table-row" onclick="setMusic(${title.start}, ${title.end})")>
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

const showLoader = () => {
    const body = document.getElementById('body');
    const loaderContainer = LAZR.DOM.createElement('div', 'loaderContainer', 'loader-container', `
        <div class="loader-sub-container">
            <span class="loader"></span>
        </div>
    `);
    body.appendChild(loaderContainer);
    let styles = window.getComputedStyle(loaderContainer,':after');
}
export const killLoader = () => {
    const loaderContainer = document.getElementById('loaderContainer');
    if (loaderContainer != null && loaderContainer != undefined) {
        loaderContainer.remove();
    }
}

const animateListItem = (cleanedRadioName) => {
    // Vérifie si la boucle est déjà en cours d'exécution
    if (isLooping4) {
        return;
    }
    isLooping4 = true;

    // Code
    const buttonIcon = document.getElementById(`button-icon-${cleanedRadioName}`);
    if (buttonIcon != null && buttonIcon != undefined) {
        const buttonIconAnimationArea = document.getElementById('buttonIconAnimationArea');
        if (buttonIconAnimationArea != null && buttonIconAnimationArea != undefined) {
            // Nothing
        } else {
            // création
            let newItemAnimationArea = LAZR.DOM.createElement('div', 'buttonIconAnimationArea', 'button-icon-animation-area', `
                <div class="animatedLines">
                    <div class="lines"></div>
                    <div class="lines"></div>
                    <div class="lines"></div>
                    <div class="lines"></div>
                    <div class="lines"></div>
                    <div class="lines"></div>
                    <div class="lines"></div>
                </div>
            `);
            buttonIcon.appendChild(newItemAnimationArea);
        }
    }

    // Boucle
    loopTimer4 = setTimeout(() => {
        isLooping4 = false;
        animateListItem(cleanedRadioName);
    }, 100);
}

// Pour annuler la boucle de l'extérieur
export function killAnimateListItem() {
    if (isLooping4) {
        clearTimeout(loopTimer4); // Annule le timer
        isLooping4 = false;
        const buttonIconAnimationArea = document.getElementById('buttonIconAnimationArea');
        if (buttonIconAnimationArea != null && buttonIconAnimationArea != undefined) {
            buttonIconAnimationArea.remove();
        }
    }
}
// RENDERING ------------------------------------------------------------------

export const renderPage = () => {

    shouldGenerateNewMusic = true;

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
    document.documentElement.style.setProperty('--radio-color', radio.color);

    const pageTitle = radio.name;
    LAZR.DOM.setHTMLTitle(pageTitle);

    if (music != undefined) {
        const pattern = /radios\/(.*?)\.mp3/;
        const match = music.src.match(pattern);
        const result = match[1];
        if (result != radio.file) { 
            music.pause(); // stoppe l'ancienne musique
            killAnimateListItem();
            isMusicLoaded = false;
        } else {
            shouldGenerateNewMusic = false;
            if (music.paused) {
                music.play();
                animateListItem(cleanString(currentRadio.name));
            }
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
            <button id="radioLikeButton" class="music-control-button radio-like-button" onclick="onLikeClick('${radio.color}', '${radio.id}')">${getLikeButtonIcon(radio)}</button>
            <button id="playPauseButton" class="music-control-button play-pause-button" onclick="playPause()">${getPlayPauseButtonIcon(radio)}</button>
            <button id="playlistModalButton" class="music-control-button playlist-modal-button" onclick="onPlaylistModalClick('${radio.color}')">${currentRadio.playlist != undefined ? getPlaylistModalButtonIcon() : ''}</button>
        </div>
    `);

    if (shouldGenerateNewMusic) {
        showLoader();
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
        music.addEventListener("canplaythrough", (event) => {
            isMusicLoaded = true;
            const playPauseIcon = document.getElementById('playPauseIcon');
            playPauseIcon.setAttribute('src', './medias/images/font-awsome/circle-pause-solid.svg');
            playPauseIcon.setAttribute('style', `filter: ${FILTER.getFilterStringForHexValue(currentRadio.color)}`);
            killLoader();
            music.play();
            animateListItem(cleanString(radio.name));
          });
    }

    animateBackground(game, true);
    setMusicInfos(radio, true);
    loopPreventInnerClick();

    page.style.background = '';
    document.getElementById('header').style.backdropFilter = 'blur(3px) grayscale(100%) brightness(50%)';
    page.style.backdropFilter = 'blur(3px) grayscale(100%) brightness(50%)';
    return page;
}

