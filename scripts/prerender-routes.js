const TOTAL_POKEMONS = 151;
const TOTAL_PAGES = 5;

(async () => {
  const fs = require("fs");
  const pokemonIDs = Array.from({ length: TOTAL_POKEMONS }, (_, i) => i + 1);
  const pokemonPages = Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1);
  const pokemonNameList = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=${TOTAL_POKEMONS}`
  ).then((res) => res.json());

  const fileContent = [
    ...pokemonIDs.map((id) => `/pokemons/${id}`),
    ...pokemonPages.map((page) => `/pokemons/page/${page}`),
    ...pokemonNameList.results.map(({ name }) => `/pokemons/${name}`),
  ].join("\n");

  fs.writeFileSync("routes.txt", fileContent);
  console.log("routes.txt generated!");
})();
