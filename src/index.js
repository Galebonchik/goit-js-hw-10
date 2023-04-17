import './css/styles.css';
import debounce from "lodash.debounce";
import Notiflix from "notiflix";
import { fetchCountries } from "./fetchCountries";

const DEBOUNCE_DELAY = 300;


const inputElement = document.getElementById("search-box");
const listElement = document.querySelector(".country-list");
const infoElement = document.querySelector(".country-info");

const cleanMarkup = ref => (ref.innerHTML = '');

const inputHandler = event => {
  const textInput = event.target.value.trim();

  if (!textInput) {
    cleanMarkup(listElement);
    cleanMarkup(infoElement);
    return;
  }

  fetchCountries(textInput)
    .then(data => {
      console.log(data);
      if (data.length > 10) {
        Notiflix.Notify.info("Too many matches found. Please enter a more specific name.", { fontSize: '20px', },);
        return;
      }
      renderMarkup(data);
    })
    .catch(error => {
      cleanMarkup(listElement);
      cleanMarkup(infoElement);
      Notiflix.Notify.failure("Oops, there is no country with that name", { fontSize: '20px', },);
    });
};

const renderMarkup = data => {
  if (data.length === 1) {
    cleanMarkup(listElement);
    const infoMarkup = createInfoMarkup(data);
    infoElement.innerHTML = infoMarkup;
  } else {
    cleanMarkup(infoElement);
    const markupList = createListMarkup(data);
    listElement.innerHTML = markupList;
  }
};

const createListMarkup = data => {
  return data
    .map(
      ({ name, flags }) =>
        `<li><img src="${flags.svg}" alt="${name.official}" width="60" height="40">${name.official}</li>`,
    )
    .join('');
};

const createInfoMarkup = data => {
  return data.map(
    ({ name, capital, population, flags, languages }) =>
      `<h1><img src="${flags.svg}" alt="${name.official}" width="60" height="40">${name.official}</h1>
      <p>Capital: ${capital}</p>
      <p>Population: ${population}</p>
      <p>Languages: ${Object.values(languages)}</p>`,
  );
};

inputElement.addEventListener('input', debounce(inputHandler, DEBOUNCE_DELAY));