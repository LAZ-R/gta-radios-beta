import * as PAGE_INDEX from './layout/pages/index/index.page.js';
import * as PAGE_GAME_RADIOS from './layout/pages/gameRadios/gameRadios.page.js';
import * as PAGE_RADIO from './layout/pages/radio/radio.page.js';
import * as PAGE_ABOUT from './layout/pages/about/about.page.js';
import * as PAGE_SETTINGS from './layout/pages/settings/settings.page.js';
import * as PAGE_JSON_WIZARD from './layout/pages/jsonWizard/jsonWizard.page.js';

// Constants ------------------------------------------------------------------

// Methods --------------------------------------------------------------------

export const pushView = (parentComponent, page) => {
    switch (page) {
        case 'about':
            parentComponent.appendChild(PAGE_ABOUT.renderPage());
            break;
        case 'settings':
            parentComponent.appendChild(PAGE_SETTINGS.renderPage());
            break;
        case 'jsonWizard':
            parentComponent.appendChild(PAGE_JSON_WIZARD.renderPage());
            break;
        case 'gameRadios':
            parentComponent.appendChild(PAGE_GAME_RADIOS.renderPage());
            break;
        case 'radio':
            parentComponent.appendChild(PAGE_RADIO.renderPage());
            break;
        default:
            parentComponent.appendChild(PAGE_INDEX.renderPage());
            break;
    } 
}

// Execution ------------------------------------------------------------------