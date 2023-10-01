import * as LAZR from '../../../lazR/lazR.js';
import * as HEADER from '../../../components/header/header.component.js';
import { GAMES } from '../../../data/games.data.js';

let headerClicks = 0;

const navigateTo = (URL) => {
    LAZR.ROUTER.navigateTo(URL);
}
window.navigateTo = navigateTo;

export const renderHeader = () => {
    const pageTitle = LAZR.APP_DATA.getAppName();
    LAZR.DOM.setHTMLTitle(pageTitle);

    const logo = LAZR.DOM.createImgElement('headerLogo', 'header-logo', './medias/images/LOGO.webp', 'logo appli');

    // BACKDOOR 
    /* logo.addEventListener('click', () => {
        headerClicks += 1;
        console.log(headerClicks);
        if (headerClicks == 5) {
            const button = document.getElementById(`gameButton??`);
            button.removeAttribute('disabled');
        }
        setTimeout(() => {
            headerClicks = 0;
        }, 3000);
    }) */
    
    HEADER.edit(
        false, 
        logo, 
        true
    );
}

const getGamesButtons = () => {
    let string = '';
    GAMES.forEach(game => {
        const subPath = game.available ? game.cover : `${game.cover}-unavailable`
        const path = `./medias/images/covers/${subPath}.webp`;
        string += `
            <button 
            id="gameButton${game.id}"
                class="game-button ${game.available ? '' : 'inactive-button'}" 
                style="background-image: url(${path})" 
                ${game.available ? '' : 'disabled'}
                onclick="navigateTo('./?page=gameRadios&gameId=${game.id}')"></button>
        `
    });
    return string;
}

export const renderPage = () => {
    renderHeader();
    const page = LAZR.DOM.createElement('div', 'indexPage', 'page', `
        <div class="header-border"></div>
        <div id="gamesArea" class="games-area">
            ${getGamesButtons()}
        </div>`);
    //page.style.padding = '20px var(--horizontal-padding)';
    return page;
}


