import { RADIOS } from "../data/radios.data.js"
import * as LAZR from '../lazR/lazR.js';

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

export const getLikedRadios = () => {
    let radios = [];
    let user = LAZR.STORAGE.getUser();
    RADIOS.forEach(radio => {
        user.liked.forEach(like => {
            if (radio.id == like) {
                radios.push(radio);
            }
        });
        
    });
    return radios;
}