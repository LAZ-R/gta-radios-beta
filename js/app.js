import { renderLayout } from './layout/layout.js';
import * as LAZR from './lazR/lazR.js';
import * as PAGE_INDEX from './layout/pages/index/index.page.js';

// Constants ------------------------------------------------------------------

const getPageRegex = /(?<=page=)\w+/g;
export const music = new Audio('./medias/audio/music/space-atmospheric-background-ivymusic.mp3');
music.loop = true;

// Methods --------------------------------------------------------------------

const renderAppHome = () => {
    document.getElementById('main').appendChild(PAGE_INDEX.renderPage());
}

// Execution ------------------------------------------------------------------

await renderLayout();

if (LAZR.STORAGE.getUserSetting('menuMusic').isActive) {
    //music.play();
}

if (window.location.hash.length == 0) {
    renderAppHome();
} else {
    let pageArray = window.location.hash.match(getPageRegex);
    if (pageArray != null) {
        const page = pageArray[0];
        LAZR.ROUTER.navigateForward(page);
    } else { 
        LAZR.ROUTER.navigateForward(null);
    }
}