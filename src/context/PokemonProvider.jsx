import { useState, useEffect } from "react";
import { useForm } from "../hooks/useForm";
import { PokemonContext } from "./PokemonContext";

export const PokemonProvider = ({ children }) => {

  const [allPokemons, setAllPokemons] = useState([]);
  const [globalPokemons, setGlobalPokemons] = useState([]);
  const [offset, setoffset] = useState(0);

  // Utilizar CustomHooks y useForm para extraer datos de la API
  const { valueSearch, onInputChange, onResetForm } = useForm({
    valueSearch: "",
  });

  // Estados para la aplicación simples

  const [loading, setLoading] = useState(true)
  const [active, setActive] = useState(false)

  // Mostrar 50 pokemones de la API

  const getAllPokemons = async (limit=50) => {

    const baseURL = 'https://pokeapi.co/api/v2/'

    const response = await fetch(`${baseURL}pokemon?limit=${limit}&offset=${offset}`)
    const data = await response.json()

    const promises = data.results.map(async(pokemon) => {
      const response = await fetch(pokemon.url)
      const data = await response.json()
      return data
    })
    const results = await Promise.all(promises)

    setAllPokemons([...allPokemons, ...results])
    setLoading(false)

  }

  // Mostrar todos los pokemons de la API
  const getGlobalPokemons = async () => {
    const baseURL = "https://pokeapi.co/api/v2/";

    const response = await fetch(`${baseURL}pokemon?limit=100000&offset=0`);
    const data = await response.json();

    const promises = data.results.map(async (pokemon) => {
      const response = await fetch(pokemon.url);
      const data = await response.json();
      return data;
    });
    const results = await Promise.all(promises);

    setGlobalPokemons(results);
    setLoading(false);
  }

  // Mostrar pokemon por el ID
  const getPokemonById = async (id) => {
    const baseURL = "https://pokeapi.co/api/v2/";

    const response = await fetch(`${baseURL}pokemon/${id}`);
    const data = await response.json();

    return data;
  }

  useEffect(() => {
    getAllPokemons();
  }, []);

  useEffect(() => {
    getGlobalPokemons();
  }, []);
  

  return (
    <PokemonContext.Provider value={{valueSearch, onInputChange, onResetForm, allPokemons, globalPokemons, getPokemonById}}>
      {children}
    </PokemonContext.Provider>
  );
};
