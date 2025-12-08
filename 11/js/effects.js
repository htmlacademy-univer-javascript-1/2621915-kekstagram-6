const form = document.querySelector('.img-upload__form');

const imageElement = form.querySelector('.img-upload__preview img');
const filterBtnsContainerElement = form.querySelector('.effects__list');
const sliderElement = form.querySelector('.effect-level__slider');
const filterValueElement = form.querySelector('.effect-level__value');

const Effects = {
  NONE: {
    range: { min: 0, max: 1 },
    start: 1,
    step: 0.1,
    connect: 'lower',
    format: {
      to(value) { return value; },
      from(value) { return parseFloat(value); }
    }
  },
  CHROME: {
    range: { min: 0, max: 1 },
    start: 1,
    step: 0.1,
    format: {
      to(value) { return value.toFixed(1); },
      from(value) { return parseFloat(value); }
    }
  },
  SEPIA: {
    range: { min: 0, max: 1 },
    start: 1,
    step: 0.1,
    format: {
      to(value) { return value.toFixed(1); },
      from(value) { return parseFloat(value); }
    }
  },
  MARVIN: {
    range: { min: 0, max: 100 },
    start: 100,
    step: 1,
    format: {
      to(value) { return `${value}%`; },
      from(value) { return parseFloat(value); }
    }
  },
  PHOBOS: {
    range: { min: 0, max: 3 },
    start: 3,
    step: 0.1,
    format: {
      to(value) { return `${value.toFixed(1)}px`; },
      from(value) { return parseFloat(value); }
    }
  },
  HEAT: {
    range: { min: 1, max: 3 },
    start: 3,
    step: 0.1,
    format: {
      to(value) { return value.toFixed(1); },
      from(value) { return parseFloat(value); }
    }
  }
};

let filterType = 'none';

const customiseFilter = (filterID) => {
  let filterClass;
  let options;

  switch (filterID) {
    case 'effect-none':
      filterClass = 'effects__preview--none';
      filterType = 'none';
      sliderElement.setAttribute('hidden', true);
      options = Effects.NONE;
      break;

    case 'effect-chrome':
      filterClass = 'effects__preview--chrome';
      filterType = 'grayscale';
      sliderElement.removeAttribute('hidden');
      options = Effects.CHROME;
      break;

    case 'effect-sepia':
      filterClass = 'effects__preview--sepia';
      filterType = 'sepia';
      sliderElement.removeAttribute('hidden');
      options = Effects.SEPIA;
      break;

    case 'effect-marvin':
      filterClass = 'effects__preview--marvin';
      filterType = 'invert';
      sliderElement.removeAttribute('hidden');
      options = Effects.MARVIN;
      break;

    case 'effect-phobos':
      filterClass = 'effects__preview--phobos';
      filterType = 'blur';
      sliderElement.removeAttribute('hidden');
      options = Effects.PHOBOS;
      break;

    case 'effect-heat':
      filterClass = 'effects__preview--heat';
      filterType = 'brightness';
      sliderElement.removeAttribute('hidden');
      options = Effects.HEAT;
      break;
  }

  imageElement.className = '';
  imageElement.classList.add(filterClass);

  sliderElement.noUiSlider.updateOptions(options);
};

const filterChangeHandler = (evt) => {
  if (evt.target.closest('.effects__item')) {
    customiseFilter(evt.target.id);
  }
};

const addFilter = () => {
  filterValueElement.value = 1;
  filterType = 'none';
  sliderElement.setAttribute('hidden', true);

  noUiSlider.create(sliderElement, Effects.NONE);

  filterBtnsContainerElement.addEventListener('change', filterChangeHandler);

  sliderElement.noUiSlider.on('update', () => {
    const value = sliderElement.noUiSlider.get();
    filterValueElement.value = parseFloat(value);

    imageElement.style.filter =
      filterType !== 'none'
        ? `${filterType}(${value})`
        : '';
  });
};

const removeFilters = () => {
  filterBtnsContainerElement.removeEventListener('change', filterChangeHandler);
  imageElement.className = '';
  imageElement.style.filter = '';
  document.querySelector('#effect-none').checked = true;

  sliderElement.noUiSlider.destroy();
};

export { addFilter, removeFilters };
