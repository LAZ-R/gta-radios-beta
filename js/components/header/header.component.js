import * as LAZR from '../../lazR/lazR.js';
import * as FILTER from '../../lazR/core/css/filter/filter.js'
import * as BURGER_MENU from './burgerMenu/burgerMenu.component.js';

const headerNavigateTo = (URL) => {
    /* if (BURGER_MENU.menuIsVisible()) {
        BURGER_MENU.closeMenu();
    } */
    LAZR.ROUTER.navigateTo(URL);
}
window.headerNavigateTo = headerNavigateTo;

const headerGoBack = () => {
    /* if (BURGER_MENU.menuIsVisible()) {
        BURGER_MENU.closeMenu();
    } */
    window.innerDocClick = false;
    history.back();
}
window.headerGoBack = headerGoBack;

export const hideEverything = () => {
    const headerPreviousArea = document.getElementById('headerPreviousArea');
    const headerCenterArea = document.getElementById('headerCenterArea');
    const headerAboutArea = document.getElementById('headerAboutArea');

    headerPreviousArea.style.opacity = 0;
    headerCenterArea.style.opacity = 0;
    headerAboutArea.style.opacity = 0;
}

/**
 * 
 * @param {boolean} shouldShowPreviousButton 
 * @param {ChildNode} centerAreaNode 
 * @param {boolean} shouldShowLikedButton 
 */
export const edit = (shouldShowPreviousButton, centerAreaNode, shouldShowLikedButton) => {
    const headerPreviousArea = document.getElementById('headerPreviousArea');
    const headerCenterArea = document.getElementById('headerCenterArea');
    const headerAboutArea = document.getElementById('headerAboutArea');

    setTimeout(() => {
        headerPreviousArea.setAttribute('onclick', shouldShowPreviousButton ? 'headerGoBack()' : '');
        headerPreviousArea.style.opacity = shouldShowPreviousButton ? '1' : '0';

        headerCenterArea.innerHTML = '';
        headerCenterArea.appendChild(centerAreaNode);
        headerCenterArea.style.opacity = 1;
    
        headerAboutArea.setAttribute( 'onclick',shouldShowLikedButton ? "headerNavigateTo('./?page=gameRadios&gameId=liked')" : '' );
        headerAboutArea.style.opacity = shouldShowLikedButton ? '1' : '0';
    }, 200);
}

export const renderView = () => {
    const header = document.getElementById('header');

    const headerPreviousArea = LAZR.DOM.createElement(
        'a', 
        'headerPreviousArea',
        'header-previous-area', 
        '');
    headerPreviousArea.setAttribute('onclick', 'headerGoBack()');
    const headerPreviousIcon = LAZR.DOM.createRootVariableColoredSVGElement(
        'headerPreviousIcon', 
        'header-previous-icon', 
        './medias/images/font-awsome/angle-left-solid.svg', 
        'Pointe de flèche vers la gauche', 
        '--on-primary');
    headerPreviousArea.appendChild(headerPreviousIcon);
    headerPreviousArea.style.opacity = 0;
    header.appendChild(headerPreviousArea);

    const headerCenterArea = LAZR.DOM.createElement(
        'div', 
        'headerCenterArea', 
        'header-center-area', 
        '');

    const headerTitle = LAZR.DOM.createElement('h1', 'headerTitle', 'header-title', 'Default');
    headerCenterArea.appendChild(headerTitle);
    headerCenterArea.style.opacity = 0;
    header.appendChild(headerCenterArea);

    const headerAboutArea = LAZR.DOM.createElement(
        'a', 
        'headerAboutArea', 
        'header-about-area', 
        '');
        const headerAboutIcon = `
            <img 
                id="headerAboutIcon" 
                class="header-about-icon" 
                src="./medias/images/font-awsome/heart-solid.svg" 
                alt="coeur" 
                style="filter: ${FILTER.getFilterStringForHexValue('#ff93ff')}"></img>`;
    headerAboutArea.innerHTML = headerAboutIcon;
    headerAboutArea.style.opacity = 0;
    header.appendChild(headerAboutArea);
}