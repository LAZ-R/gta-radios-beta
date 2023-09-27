import * as BurgerMenu from '../../../components/header/burgerMenu/burgerMenu.component.js';
import { getStack } from '../../../lazR/core/router/router.js';
import * as LAZR from '../../../lazR/lazR.js';
import { music } from '../../../app.js';
import * as HEADER from '../../../components/header/header.component.js';

const handleCheck = (id) => {
    let user = LAZR.STORAGE.getUser();

    let shoudlRefresh = false;
    user.settings.forEach(settingsGroups => {
        settingsGroups.settings.forEach(setting => {
            if (`${setting.id}${getStack()}`== id) {
                setting.isActive = document.getElementById(id).checked;
                if (setting.id == 'jsonWizard') shoudlRefresh = true;
                if (setting.id == 'menuMusic') {
                    if (setting.isActive) {
                        if (music.duration > 0 && !music.paused) {
                            console.log('Music is aldrady playing');
                        } else {
                            music.play();
                        }
                    } else {
                        if (music.duration > 0 && !music.paused) {
                            music.pause();
                        }
                    }
                }
            }
        });
    });

    LAZR.STORAGE.setUser(user);
    if (shoudlRefresh) {
        BurgerMenu.refreshBurgerMenu();
    }
};
window.handleCheck = handleCheck;

const renderSettingsGroup = (settingsGroup) => {
    let str = `
    <div id="settingsGroup${settingsGroup.id}" class="settings-group">
        <span class="settings-group-name">${settingsGroup.name}</span>`;

    settingsGroup.settings.forEach(setting => {
        str += `
        <div class="setting-tile">
            <div class="setting-label-area">
                <span class="setting-label">${setting.name}</span>
            </div>
            <div class="setting-switch-area">
                <label class="switch" for="${setting.id}${getStack()}">
                    <input id="${setting.id}${getStack()}" type="checkbox"
                        onclick="handleCheck('${setting.id}${getStack()}')" ${setting.isActive ? "checked" : ""} />
                    <span class="slider round"></span>
                </label>
            </div>    
        </div>`;
    });
    str += `</div>`;
    return str;
}


export const renderPage = () => {
    let user = LAZR.STORAGE.getUser();
    const pageTitle = 'Paramètres';
    LAZR.DOM.setHTMLTitle(pageTitle);

    const headerTitle = LAZR.DOM.createElement('h1', 'headerTitle', 'header-title', pageTitle);
    HEADER.edit(
        false, 
        headerTitle, 
        true
    );
    const page = LAZR.DOM.createElement('div', 'settingsPage', 'page', ``);
        user.settings.forEach(settingsGroup => {
        if ((settingsGroup.id == 'advanced' && LAZR.STORAGE.isUserDev()) || settingsGroup.id != 'advanced') {
            page.appendChild(LAZR.DOM.getElementFromHTMLString(renderSettingsGroup(settingsGroup)));
        }
    });

    //setFooterSelectedIcon('settingsIcon');

    return page;
}