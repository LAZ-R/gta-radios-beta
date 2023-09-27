import * as LAZR from '../../../lazR/lazR.js';

const redirectToJSONWSubPage = (type) => {
    window.location = `./?page=jsonWizard&data=${type}`;
}
window.redirectToJSONWSubPage = redirectToJSONWSubPage;

const copyToClipboard = () => {
    const textarea = document.getElementById('exportTextarea').select();
    document.execCommand("copy");
}
window.copyToClipboard = copyToClipboard;

export const handleSubmitData = () => {
    const sumbittedDataString = document.getElementById('importTextarea').value;
    let isParsable = false;
    try {
        JSON.parse(sumbittedDataString);
        isParsable = true;
    } catch (error) {
        window.alert('Vos données ne sont pas formattables en JSON :(')
    }
    if (isParsable) {
        let isFormattedProperly = false;
        const newUser = JSON.parse(sumbittedDataString.trim());
        //console.log('is formatted properly :)');
        try {
            newUser.settings[0].settings[0].id == 'keepScreenAwake'
            isFormattedProperly = true;
        } catch (error) {
            window.alert(`Votre JSON n'est pas formatté correctement pour fonctionner avec cette apllication.`);
        }
        if (isFormattedProperly) {
            LAZR.STORAGE.setUser(newUser);
            window.location = './';
        }
    }
}
window.handleSubmitData = handleSubmitData;

export const renderPage = () => {

    const dataOption = LAZR.URL.getURLParameter('data');

    const primaryFilter = LAZR.CSS.getFilterStringForHexValue(LAZR.CSS.getCssRootVariableValue('--primary'));
    const onPrimaryFilter = LAZR.CSS.getFilterStringForHexValue(LAZR.CSS.getCssRootVariableValue('--on-primary'));

    const page = LAZR.DOM.createElement('div', 'jsonWizardPage', 'page', '');

    switch (dataOption) {
        case 'export':
            LAZR.DOM.setHTMLTitle('Export de données');
            const exportTopPart = LAZR.DOM.createElement('div', 'exportTopPart', 'json-wizard-category json-wizard-export-top-part', `
                <div class="json-wizard-intro-area">
                    <h1>Export de données</h1>
                    <span>
                        Ici vous pouvez exporter vos données au format JSON pour les garder pour plus tard (nettoyage du cache, mise à jour d'appareil, changement d'appareil, etc.)
                    </span>
                </div>`);
            page.appendChild(exportTopPart);

            const exportMiddlePart = LAZR.DOM.createElement('div', 'exportMiddlePart', 'json-wizard-category json-wizard-export-middle-part', `
                <textarea id="exportTextarea" class="export-textarea" readonly >${JSON.stringify(LAZR.STORAGE.getUser())}</textarea>`);
            page.appendChild(exportMiddlePart);

            const exportBottomPart = LAZR.DOM.createElement('div', 'exportBottomPart', 'json-wizard-category json-wizard-export-bottom-part', `  
                <button id="copyClipboardButton" class="primary-button json-wizard-button" onclick="copyToClipboard()">
                    <span class="json-wizard-category-title">Copier dans le presse-papier</span>
                    <img class="json-wizard-category-icon" src="./medias/images/font-awsome/clipboard-regular.svg" alt="an arrow to the right comming into a rectangle" style="filter: ${onPrimaryFilter};" />
                </button>`);
            page.appendChild(exportBottomPart);
            break;
        case 'import':
            LAZR.DOM.setHTMLTitle('Importation de données');
            const importTopPart = LAZR.DOM.createElement('div', 'importTopPart', 'json-wizard-category json-wizard-import-top-part', `
                <div class="json-wizard-intro-area">
                    <h1>Importation de données</h1>
                    <span>
                        <span style="color: var(--lazr-red)">
                        <b>Cette fonctionalité est réservée aux utilisateurs expérimentés.</b><br>
                        <b>Utilisez la à vos risques et périls.</b><br>
                        <br>
                        Ici vous pouvez coller un JSON sous forme de chaîne de caractères qui sera utilisé comme base de données locale, le but principal étant la restauration de backup préalablement exporté.<br>
                        Attention, celui-ci doit être formatté <b>exactement</b> comme celui exporté.<br>
                        <br>
                        <b>Cette application VA planter si la moindre donnée n'est pas correctement formattée.</b>
                        </span>
                    </span>
                </div>`);
            page.appendChild(importTopPart);

            const importMiddlePart = LAZR.DOM.createElement('div', 'importMiddlePart', 'json-wizard-category json-wizard-import-middle-part', `
                <textarea id="importTextarea" class="export-textarea" placeholder="Coller ici"></textarea>`);
            page.appendChild(importMiddlePart);

            const importBottomPart = LAZR.DOM.createElement('div', 'importBottomPart', 'json-wizard-category json-wizard-import-bottom-part', `  
                <button id="submitDataButton" class="warning-button json-wizard-button" onclick="handleSubmitData()">
                    <span>Importer les données</span>
                </button>`);
            page.appendChild(importBottomPart);
            break;
        default:
            LAZR.DOM.setHTMLTitle('JSON Wizard');
            const topPart = LAZR.DOM.createElement('div', 'topPart', 'json-wizard-category json-wizard-top-part', `
                <div class="json-wizard-intro-area">
                    <h1>JSON Wizard</h1>
                    <span>
                        Ici vous pouvez exporter les données issues de votre stockage local, ou y importer des données externes.
                    </span>
                    <div class="json-wizard-icon-area">
                        <img class="json-wizard-icon" src="./medias/images/font-awsome/wand-magic-sparkles-solid.svg" alt="a magic wand with sparkles" style="filter: ${primaryFilter};" />
                    </div>
                </div>`);
            page.appendChild(topPart);

            const middlePart = LAZR.DOM.createElement('div', 'middlePart', 'json-wizard-category json-wizard-middle-part', `
                <button class="primary-button json-wizard-button" onclick="redirectToJSONWSubPage('export')">
                    <span class="json-wizard-category-title">Export des données</span>
                    <img class="json-wizard-category-icon" src="./medias/images/font-awsome/right-from-bracket-solid.svg" alt="une flèche vers la droite qui sort d'un rectangle" style="filter: ${onPrimaryFilter};" />
                </button>`);
            page.appendChild(middlePart);

            const bottomPart = LAZR.DOM.createElement('div', 'bottomPart', 'json-wizard-category json-wizard-bottom-part', `  
                <button class="primary-button json-wizard-button" onclick="redirectToJSONWSubPage('import')">
                    <span class="json-wizard-category-title">Importation des données</span>
                    <img class="json-wizard-category-icon" src="./medias/images/font-awsome/right-to-bracket-solid.svg" alt="une flèche vers la droite qui rentre dans un rectangle" style="filter: ${onPrimaryFilter};" />
                </button>`);
            page.appendChild(bottomPart);
            break;
    }

    return page;
}