import * as LAZR from '../../../lazR/lazR.js';

// Constants ------------------------------------------------------------------

// Methods --------------------------------------------------------------------

export const menuIsVisible = () => {
    return isMenuVisible;
}

const openMenu = () => {
    document.getElementById('burgerMenuBackground').style.display = 'flex';
    setTimeout(() => {
        document.getElementById('burgerMenuBackground').style.opacity = '50%';
    }, 10);

    document.getElementById('headerBurgerMenuButton').style.opacity = '0%';
    setTimeout(() => {
        document.getElementById('headerBurgerMenuButton').innerHTML = `
            <img src="./medias/images/font-awsome/xmark-solid.svg" class="burger-menu-header-button-icon" style="filter: ${LAZR.CSS.getRootColorFilterValue('--on-primary')}" />`;
        document.getElementById('headerBurgerMenuButton').style.opacity = '100%';
    }, 100);
    
    document.getElementById('burgerMenu').style.right = 0;
    
    isMenuVisible = true;
}

export const closeMenu = () => {
    document.getElementById('burgerMenuBackground').style.opacity = '0%';
    
    document.getElementById('headerBurgerMenuButton').style.opacity = '0%';
    setTimeout(() => {
        document.getElementById('headerBurgerMenuButton').innerHTML = `
            <img src="./medias/images/font-awsome/bars-solid.svg" class="burger-menu-header-button-icon" style="filter: ${LAZR.CSS.getRootColorFilterValue('--on-primary')};" />`;
        document.getElementById('headerBurgerMenuButton').style.opacity = '100%';
    }, 100);
    
    LAZR.BREAKPOINTS.isTablet
        ? document.getElementById('burgerMenu').style.right = '-40%'
        : document.getElementById('burgerMenu').style.right = '-70%';
    setTimeout(() => {
        document.getElementById('burgerMenuBackground').style.display = 'none';
    }, 200);

    isMenuVisible = false;
}

const getBurgerMenuInnerHTML = () => {
    return `
    <div class="burger-menu-pages">
        <a onclick="burgerNavigateTo('./')" class="burger-menu-page">Accueil</a>
    </div>
    <div class="burger-menu-bottom">
        <div class="burger-menu-utils">   
            ${(LAZR.STORAGE.isUserDev() && LAZR.STORAGE.getUserSetting('jsonWizard').isActive) ? `
            <a onclick="burgerNavigateTo('./?page=jsonWizard')" class="burger-menu-page burger-menu-util">
                <div class="util-icon-area">
                    <img class="util-icon" src="./medias/images/font-awsome/wand-magic-sparkles-solid.svg" alt="a magic wand with sparkles" style="filter: ${LAZR.CSS.getRootColorFilterValue('--on-primary')}" />
                </div>                    
                <span>JSON Wizard</span>
            </a>` : ''}
            <a onclick="burgerNavigateTo('./?page=settings')" class="burger-menu-page burger-menu-util">
                <div class="util-icon-area">
                    <img class="util-icon" src="./medias/images/font-awsome/gear-solid.svg" alt="gear" style="filter: ${LAZR.CSS.getRootColorFilterValue('--on-primary')}" />
                </div>                    
                <span>Paramètres</span>
            </a>
            <a onclick="burgerNavigateTo('./?page=about')" class="burger-menu-page burger-menu-util">
                <div class="util-icon-area">
                    <img class="util-icon" src="./medias/images/font-awsome/circle-info-solid.svg" alt="information mark" style="filter: ${LAZR.CSS.getRootColorFilterValue('--on-primary')}" />
                </div>                    
                <span>À propos</span>
            </a>
        </div>
        <div class="burger-menu-app-data">
            <span style="user-select: none;" onclick="handleVersionNumberClick()">v${LAZR.APP_DATA.getAppVersionNumber()}</span>
            <span>&copy; ${new Date().getFullYear()} • laz_R</span>
        </div>
    </div>`
};

export const refreshBurgerMenu = () => {
    document.getElementById('burgerMenu').innerHTML = getBurgerMenuInnerHTML();
}

const burgerNavigateTo = (URL) => {
    closeMenu();
    LAZR.ROUTER.navigateTo(URL);
}
window.burgerNavigateTo = burgerNavigateTo;

const handleVersionNumberClick = () => { 
    versionNumberClick += 1;
    if (versionNumberClick == 6) {
        if (!LAZR.STORAGE.isUserDev()) {
            let user = LAZR.STORAGE.getUser();
            user.isDev = true;
            LAZR.STORAGE.setUser(user);
            window.alert('Vous avez désormais accès à la section "Avancé" des paramètres.');
        } else {
            let user = LAZR.STORAGE.getUser();
            user.isDev = false;
            LAZR.STORAGE.setUser(user);
            window.alert('Vous perdez accès à la section "Avancé" des paramètres.');
        }
        closeMenu();
        LAZR.ROUTER.navigateTo(`./?page=settings`);
        versionNumberClick = 0;
        refreshBurgerMenu();
    }
}
window.handleVersionNumberClick = handleVersionNumberClick;

export const renderView = () => {
    const headerBurgerMenuButtonArea = LAZR.DOM.createElement('div', 'headerBurgerMenuButtonArea', 'header-burger-menu-button-area', ``);
    const headerBurgerMenuButton = LAZR.DOM.createElement('button', 'headerBurgerMenuButton', 'header-burger-menu-button', `
        <img src="./medias/images/font-awsome/bars-solid.svg" class="burger-menu-header-button-icon" style="filter: ${LAZR.CSS.getRootColorFilterValue('--on-primary')}" />`);
    headerBurgerMenuButton.onclick = () => isMenuVisible ? closeMenu() : openMenu();
    headerBurgerMenuButtonArea.appendChild(headerBurgerMenuButton);
    document.getElementById('header').appendChild(headerBurgerMenuButtonArea);

    const burgerMenuBackground = LAZR.DOM.createElement('div', 'burgerMenuBackground', 'burger-menu-background', '');
    burgerMenuBackground.onclick = () => closeMenu();
    document.getElementById('body').appendChild(burgerMenuBackground);

    const burgerMenu = LAZR.DOM.createElement('div', 'burgerMenu', 'burger-menu', getBurgerMenuInnerHTML());
    document.getElementById('body').appendChild(burgerMenu);
}

// Execution ------------------------------------------------------------------

let isMenuVisible = false;
let versionNumberClick = 0;