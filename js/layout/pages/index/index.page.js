import * as LAZR from '../../../lazR/lazR.js';
import * as HEADER from '../../../components/header/header.component.js';
import { GAMES } from '../../../data/games.data.js';

const navigateTo = (URL) => {
    LAZR.ROUTER.navigateTo(URL);
}
window.navigateTo = navigateTo;

export const renderHeader = () => {
    const pageTitle = LAZR.APP_DATA.getAppName();
    LAZR.DOM.setHTMLTitle(pageTitle);

    const logo = LAZR.DOM.createImgElement('headerLogo', 'header-logo', './medias/images/LOGO.png', 'logo appli')
    HEADER.edit(
        false, 
        logo, 
        false
    );
}

const getGamesButtons = () => {
    let string = '';
    GAMES.forEach(game => {
        string += `
            <button 
                class="game-button ${game.name == 'San Andreas' ? '' : 'inactive-button'}" 
                style="background-image: url(./medias/images/covers/${game.cover}.png" 
                ${game.name == 'San Andreas' ? '' : 'disabled'}
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


