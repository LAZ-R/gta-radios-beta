import { RADIOS } from "../data/radios.data.js"

export const getRadiosByGameId = (gameId) => {
    let radios = [];
    RADIOS.forEach(array_radio => {
        if (array_radio.game_id == gameId) {
            radios.push(array_radio);
        }
    });
    return radios;
}

export const getRadioById = (radioId) => {
    let radio;
    RADIOS.forEach(radioFromArray => {
        if (radioFromArray.id == radioId) {
            radio = radioFromArray
        };
    });
    return radio
}