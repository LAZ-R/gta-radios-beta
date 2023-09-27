import * as LAZR from '../../../lazR/lazR.js';
import * as HEADER from '../../../components/header/header.component.js';
import { getGameById } from '../../../services/games.service.js';
import { getRadiosByGameId } from '../../../services/radios.service.js';

const navigateTo = (URL) => {
    LAZR.ROUTER.navigateTo(URL);
}
window.navigateTo = navigateTo;

export const renderPage = () => {
    const getIdRegex = /(?<=gameId=)\w+/g;
    let array = window.location.hash.match(getIdRegex);
    let gameId = '';
    if (array != null) {
        gameId = array[0];
    }
    const game = getGameById(gameId);

    const getRadioIcon = (radio) => {
        return `
            <div class="radio-icon-small" style="border: 3px solid ${radio.color}">
                <img src="./medias/images/radio-icons/${radio.icon}.png" class="radio-icon-img-small" />
            </div>
        `;
    }
    
    const getRadioButton = (radio) => {
        return `
            <button *
                class="radio-button"
                onclick="navigateTo('./?page=radio&gameId=${game.id}&radioId=${radio.id}')">
                ${getRadioIcon(radio)}
                <div class="radio-infos">
                    <span class="radio-name">${radio.name}</span>
                    <span class="radio-genre">${radio.genre}</span>
                </div>
            </button>
        `;
    }
    
    const getRadiosButtons = (radios) => {
        let display = '';
        radios.forEach(radio => {
            display += getRadioButton(radio);
        });
        return display;
    }

    const pageTitle = game.name;
    LAZR.DOM.setHTMLTitle(pageTitle);

    const RADIOS = getRadiosByGameId(gameId);

    const headerTitle = LAZR.DOM.createElement('h1', 'headerTitle', 'header-title', `
        Grand Theft Auto
        <br>
        <b>${pageTitle}</b>
    `);
    HEADER.edit(
        true, 
        headerTitle, 
        false
    );
    const page = LAZR.DOM.createElement('div', 'gameRadiosPage', 'page', `
        ${getRadiosButtons(RADIOS)}
    `);
    page.style.padding = '0 var(--horizontal-padding)';
    return page;
}

