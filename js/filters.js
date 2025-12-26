import { debounce, shuffleArray } from './util.js';
import { renderThumbnails, removePictures } from './thumbnails.js';

const COUNT_RANDOM_PHOTOS = 10;
const ACTIVE_CLASS = 'img-filters__button--active';

const imgFilters = document.querySelector('.img-filters');
const imgFiltersForm = imgFilters.querySelector('.img-filters__form');

let photosData = [];

const filterDefault = (photos) => [...photos];
const filterRandom = (photos) => shuffleArray([...photos]).slice(0, COUNT_RANDOM_PHOTOS);
const filterDiscussed = (photos) => [...photos].sort((a, b) => b.comments.length - a.comments.length);

const availableFilters = {
  'filter-default': filterDefault,
  'filter-random': filterRandom,
  'filter-discussed': filterDiscussed
};

const onFilterClick = debounce((evt) => {
  const button = evt.target.closest('.img-filters__button');
  if (!button) {
    return;
  }

  const filterId = button.id;
  const filterFunction = availableFilters[filterId];

  if (!filterFunction) {
    return;
  }

  removePictures();
  const filteredPhotos = filterFunction(photosData);
  renderThumbnails(filteredPhotos);
});

const onButtonClick = (evt) => {
  const button = evt.target.closest('.img-filters__button');
  if (!button) {
    return;
  }

  const selectedButton = imgFiltersForm.querySelector(`.${ACTIVE_CLASS}`);
  if (selectedButton) {
    selectedButton.classList.remove(ACTIVE_CLASS);
  }

  button.classList.add(ACTIVE_CLASS);
};

const initFilters = (photos) => {
  if (photos && Array.isArray(photos)) {
    photosData = [...photos];
  }

  imgFilters.classList.remove('img-filters--inactive');

  imgFiltersForm.addEventListener('click', (evt) => {
    onButtonClick(evt);
    onFilterClick(evt);
  });

  const defaultButton = imgFiltersForm.querySelector('#filter-default');
  if (defaultButton) {
    defaultButton.classList.add(ACTIVE_CLASS);
  }
};

export { initFilters };
