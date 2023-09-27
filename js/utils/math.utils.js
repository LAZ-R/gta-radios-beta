// UTILS ------------------------------------------------------------------------------------------
export const between = (min, max) => { return Math.floor(Math.random() * (max - min + 1) + min) }
export const getRandomAngle = () => { return between(-9000, 9000) / 100; }