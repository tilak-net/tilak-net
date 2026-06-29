const POKEMON_DATABASE = [
    { id: 1, name: 'Bulbasaur', hp: 45, atk: 49, def: 49, spa: 65, spd: 65, spd: 45, gen: 1 },
    { id: 4, name: 'Charmander', hp: 39, atk: 52, def: 43, spa: 60, spd: 50, spd: 65, gen: 1 },
    { id: 7, name: 'Squirtle', hp: 44, atk: 48, def: 65, spa: 50, spd: 64, spd: 43, gen: 1 },
    { id: 25, name: 'Pikachu', hp: 35, atk: 55, def: 40, spa: 50, spd: 50, spd: 90, gen: 1 },
    { id: 94, name: 'Gengar', hp: 45, atk: 65, def: 60, spa: 130, spd: 75, spd: 130, gen: 1 },
    { id: 149, name: 'Dragonite', hp: 91, atk: 134, def: 95, spa: 100, spd: 100, spd: 80, gen: 1 },
    { id: 59, name: 'Arcanine', hp: 75, atk: 110, def: 80, spa: 100, spd: 80, spd: 95, gen: 1 },
    { id: 131, name: 'Lapras', hp: 130, atk: 85, def: 80, spa: 85, spd: 95, spd: 60, gen: 1 },
    { id: 143, name: 'Snorlax', hp: 150, atk: 110, def: 65, spa: 65, spd: 110, spd: 30, gen: 1 },
    { id: 150, name: 'Mewtwo', hp: 106, atk: 110, def: 90, spa: 154, spd: 100, spd: 130, gen: 1 },
    { id: 152, name: 'Chikorita', hp: 45, atk: 49, def: 65, spa: 49, spd: 65, spd: 45, gen: 2 },
    { id: 155, name: 'Cyndaquil', hp: 39, atk: 52, def: 43, spa: 60, spd: 50, spd: 65, gen: 2 },
    { id: 158, name: 'Totodile', hp: 50, atk: 65, def: 64, spa: 59, spd: 63, spd: 43, gen: 2 },
    { id: 245, name: 'Suicune', hp: 100, atk: 75, def: 115, spa: 81, spd: 125, spd: 85, gen: 2 },
    { id: 250, name: 'Ho-Oh', hp: 106, atk: 130, def: 90, spa: 110, spd: 154, spd: 90, gen: 2 },
];

function getPokemonByName(name) {
    return POKEMON_DATABASE.find(p => p.name.toLowerCase() === name.toLowerCase());
}

function getTotalStats(pokemon) {
    return pokemon.hp + pokemon.atk + pokemon.def + pokemon.spa + pokemon.spd + pokemon.spd;
}