import Pristine from './pristine/pristine.min.js';

const form = document.querySelector('.img-upload__form');
const inputFile = document.querySelector('.img-upload__input');
const overlay = document.querySelector('.img-upload__overlay');
const cancelButton = document.querySelector('.img-upload__cancel');
const hashtagsInput = document.querySelector('.text__hashtags');
const commentInput = document.querySelector('.text__description');
const previewImage = document.querySelector('.img-upload__preview img');

const openForm = () => {
  overlay.classList.remove('hidden');
  document.body.classList.add('modal-open');
};
const pristine = new Pristine(
  form,
  {
    classTo: 'img-upload__field-wrapper',
    errorTextParent: 'img-upload__field-wrapper',
    errorTextClass: 'img-upload__error',
  },
  false,
);

const closeForm = () => {
  overlay.classList.add('hidden');
  document.body.classList.remove('modal-open');

  form.reset();
  pristine.reset();
  inputFile.value = '';
};

const onEscKey = (evt) => {
  if (evt.key === 'Escape') {
    evt.preventDefault();
    closeForm();
  }
};

const stopEsc = (evt) => {
  evt.stopPropagation();
};

hashtagsInput.addEventListener('keydown', stopEsc);
commentInput.addEventListener('keydown', stopEsc);

inputFile.addEventListener('change', () => {
  const file = inputFile.files[0];

  if (file) {
    openForm();

    const reader = new FileReader();
    reader.onload = () => {
      previewImage.src = reader.result;
    };
    reader.readAsDataURL(file);

    document.addEventListener('keydown', onEscKey);
  }
});

cancelButton.addEventListener('click', () => {
  closeForm();
  document.removeEventListener('keydown', onEscKey);
});

const MAX_HASHTAGS = 5;
const HASHTAG_REGEXP = /^#[a-zа-яё0-9]{1,19}$/i;

const validateHashtags = (value) => {
  if (value.trim() === '') {
    return true;
  }

  const tags = value.toLowerCase().trim().split(/\s+/);

  if (tags.length > MAX_HASHTAGS) {
    return false;
  }

  const unique = new Set(tags);

  if (unique.size !== tags.length) {
    return false;
  }

  return tags.every((tag) => HASHTAG_REGEXP.test(tag));
};

const hashtagErrorMessage = (value) => {
  if (value.trim() === '') {
    return '';
  }

  const tags = value.toLowerCase().trim().split(/\s+/);

  if (tags.length > MAX_HASHTAGS) {
    return 'Не больше 5 хэш-тегов';
  }

  const unique = new Set(tags);

  if (unique.size !== tags.length) {
    return 'Хэш-теги не должны повторяться';
  }

  return 'Неверный формат хэш-тега';
};

pristine.addValidator(hashtagsInput, validateHashtags, hashtagErrorMessage);

const validateComment = (value) => value.length <= 140;

pristine.addValidator(commentInput, validateComment, 'Не более 140 символов');

form.addEventListener('submit', (evt) => {
  evt.preventDefault();

  const isValid = pristine.validate();

  if (isValid) {
    const submitButton = form.querySelector('.img-upload__submit');
    submitButton.disabled = true;

    const formData = new FormData(form);

    fetch('https://29.javascript.htmlacademy.pro/kekstagram', {
      method: 'POST',
      body: formData,
    })
      .then(() => {
        closeForm();
      })
      .finally(() => {
        submitButton.disabled = false;
      });
  }
});
