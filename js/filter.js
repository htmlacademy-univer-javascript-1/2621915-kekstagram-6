import { debounce, shuffleArray } from './util.js';
import { removePictures } from './thumbnails.js';

const COUNT_RANDOM_PHOTOS = 10;
const ACTIVE_CLASS = 'img-filters__button--active';

const imgFilters = document.querySelector('.img-filters');
const imgFiltersForm = imgFilters.querySelector('.img-filters__form');

let photosData = [];

const availableFilters = {
  'filter-default': (photos) => {
    if (!photos || !Array.isArray(photos)) {return [];}
    return [...photos];
  },
  'filter-random': (photos) => {
    if (!photos || !Array.isArray(photos) || photos.length === 0) {return [];}
    const shuffled = shuffleArray([...photos]);
    return shuffled.slice(0, COUNT_RANDOM_PHOTOS);
  },
  'filter-discussed': (photos) => {
    if (!photos || !Array.isArray(photos) || photos.length === 0) {return [];}
    const sorted = [...photos].sort((first, second) =>
      second.comments.length - first.comments.length
    );
    return sorted;
  }
};

const isButton = (evt) => evt.target.tagName === 'BUTTON';

let renderPhotos;

const onImgFiltersFormClick = debounce((evt) => {
  if (!isButton(evt)) {
    return;
  }

  const filterId = evt.target.id;
  const filterFunction = availableFilters[filterId];

  if (!filterFunction || !renderPhotos) {
    return;
  }

  removePictures();
  const filteredPhotos = filterFunction(photosData);

  if (filteredPhotos && filteredPhotos.length > 0) {
    renderPhotos(filteredPhotos);
  }
});

const onButtonClick = (evt) => {
  if (!isButton(evt)) {
    return;
  }

  const selectedButton = imgFiltersForm.querySelector(`.${ACTIVE_CLASS}`);

  if (selectedButton) {
    selectedButton.classList.remove(ACTIVE_CLASS);
  }

  evt.target.classList.add(ACTIVE_CLASS);
};

const initFilters = (photos, renderFunction) => {
  if (photos && Array.isArray(photos)) {
    photosData = [...photos];
  }

  if (renderFunction && typeof renderFunction === 'function') {
    renderPhotos = renderFunction;
  }

  imgFilters.classList.remove('img-filters--inactive');

  imgFiltersForm.addEventListener('click', (evt) => {
    onButtonClick(evt);
    onImgFiltersFormClick(evt);
  });

  const defaultButton = imgFiltersForm.querySelector('#filter-default');
  if (defaultButton) {
    defaultButton.classList.add(ACTIVE_CLASS);
  }
};

export { initFilters };
