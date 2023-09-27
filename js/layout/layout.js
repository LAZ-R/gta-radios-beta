import * as LAZR from '../lazR/lazR.js';
import * as HEADER from '../components/header/header.component.js';
import * as FOOTER from '../components/footer/footer.component.js';

// Constants ------------------------------------------------------------------

// Methods --------------------------------------------------------------------

export const renderLayout = async () => {
    if (LAZR.STORAGE.getUserSetting('keepScreenAwake').isActive) { await LAZR.WAKE_LOCK.requestWakeLock(); }
    HEADER.renderView();
    FOOTER.renderView();
    LAZR.DOM.setViewportSize();
}

// Execution ------------------------------------------------------------------
