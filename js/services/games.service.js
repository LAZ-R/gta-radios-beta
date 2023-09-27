import { GAMES } from "../data/games.data.js";

export const getGameById = (id) => {
    let gameJSON;
    GAMES.forEach(game => {
        if (game.id == id) gameJSON = game;
    });
    return gameJSON
}