import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

Notify.init({
  position: 'center-top',
  clickToClose: true,
});

const refs = {
  input: document.querySelector('input'),
  list: document.querySelector('.country-list'),
  country: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(onSearchCountry, DEBOUNCE_DELAY));

function onSearchCountry() {
  if (refs.input.value === '') {
    clearMarkup();
  } else {
    fetchCountries(refs.input.value.trim())
      .then(filterArrayCountry)
      .catch(() => Notify.failure('Oops, there is no country with that name'));
  }
}

function filterArrayCountry(array) {
  if (array.length > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
  }
  if (array.length >= 2 && array.length <= 10) {
    renderCountries(array);
  }
  if (array.length === 1) {
    renderCountryCard(array);
  }
}

function renderCountryCard(array) {
  const markup = array
    .map(country => {
      return `<div class="container">
      <img src= ${country.flags.svg} alt=${country.name.official} width="50">
       <h1>${country.name.official}</h1>
       </div>
        <p><span class="country_options">Capital:</span> ${country.capital}</p>
        <p><span class="country_options">Population:</span> ${
          country.population
        }</p>
        <p><span class="country_options">Languages:</span> ${Object.values(
          country.languages
        )}</p>`;
    })
    .join('');

  refs.list.innerHTML = markup;
}

function renderCountries(array) {
  const markup = array
    .map(country => {
      return `<li class="container">
    <img src= ${country.flags.svg} alt=${country.name.official} width="50">
    <p class="country_name">${country.name.official}</p>
    </li>`;
    })
    .join('');
  refs.list.innerHTML = markup;
}

function clearMarkup() {
  refs.list.innerHTML = '';
  refs.list.innerHTML = '';
}
