import * as CORE_APP_DATA from './core/appData/appData.js';
import * as CORE_CSS from './core/css/css.js';
import * as CORE_DOM from './core/DOM/DOM.js';
import * as CORE_MATHS from './core/maths/maths.js';
import * as CORE_ROUTER from './core/router/router.js';
import * as CORE_STORAGE from './core/storage/storage.js';
import * as CORE_URL from './core/URL/URL.js';
import * as CORE_WAKE_LOCK from './core/wakeLock.js';

// APP Data -------------------------------------------------------------------
export const APP_DATA = {
    getAppVersionNumber: () => CORE_APP_DATA.getAppVersionNumber(),
    getAppName: () => CORE_APP_DATA.getAppName()
}

// CSS ------------------------------------------------------------------------
export const CSS = {
    getCssRootVariableValue: (variableName) => CORE_CSS.getCssRootVariableValue(variableName),
    getFilterStringForHexValue: (hexValue) => CORE_CSS.getFilterStringForHexValue(hexValue),
    applyColorFilterOnElement: (element, hexValue) => CORE_CSS.applyColorFilterOnElement(element,hexValue),
    getRootColorFilterValue: (rootVariableName) => CORE_CSS.getRootColorFilterValue(rootVariableName)
}

// DOM ------------------------------------------------------------------------
export const DOM = {
    setViewportSize: () => CORE_DOM.setViewportSize(),
    setHTMLTitle: (pageTitle) => CORE_DOM.setHTMLTitle(pageTitle),
    getElementFromHTMLString: (html) => CORE_DOM.getElementFromHTMLString(html),
    createElement: (element, id, className, innerHtml) => CORE_DOM.createElement(element, id, className, innerHtml),
    createImgElement: (id, className, src, alt) => CORE_DOM.createImgElement(id, className, src, alt),
    createHexColoredSVGElement: (id, className, src, alt, hexValue) => CORE_DOM.createHexColoredSVGElement(id, className, src, alt, hexValue),
    createRootVariableColoredSVGElement: (id, className, src, alt, rootColorVariableName) => CORE_DOM.createRootVariableColoredSVGElement(id, className, src, alt, rootColorVariableName),
}
// Breakpoints ----------------------------------------------------------------
export const BREAKPOINTS = {
    isPhone: CORE_DOM.isPhone,
    isTablet: CORE_DOM.isTablet,
    isTabletOrUp: CORE_DOM.isTabletOrUp,
    isLaptop: CORE_DOM.isLaptop,
    isLaptopOrUp: CORE_DOM.isLaptopOrUp,
    isDesktop: CORE_DOM.isDesktop
}

// Maths ----------------------------------------------------------------------
export const MATHS = {
    getRandomIntegerBetween: (min, max) => CORE_MATHS.getRandomIntegerBetween(min, max),
    roundTo: (n, digits) => CORE_MATHS.roundTo(n, digits)
};

// Router ---------------------------------------------------------------------
export const ROUTER = {
    navigateTo: (URL) => CORE_ROUTER.navigateTo(URL),
    navigateForward: (page) => CORE_ROUTER.navigateForward(page),
    navigateBackward: (page) => CORE_ROUTER.navigateBackward(page)
}

// Storage --------------------------------------------------------------------
export const STORAGE = {
    getUser: () => CORE_STORAGE.getUser(),
    setUser: (user) => CORE_STORAGE.setUser(user),
    getUserSetting: (id) => CORE_STORAGE.getUserSetting(id),
    isUserDev: () => CORE_STORAGE.isUserDev()
}

// URL ------------------------------------------------------------------------
export const URL = {
    getURLParameter: (parameterName) => CORE_URL.getURLParameter(parameterName)
}

// Wake Lock ------------------------------------------------------------------
export const WAKE_LOCK = {
    requestWakeLock: async () => await CORE_WAKE_LOCK.requestWakeLock()
}
