import Pristine from './pristine/pristine.min.js';

const form = document.querySelector('.img-upload__form');
const inputFile = form.querySelector('.img-upload__input');
const cancelButton = form.querySelector('.img-upload__cancel');
const hashtagsInput = form.querySelector('.text__hashtags');
const commentInput = form.querySelector('.text__description');
const previewImage = form.querySelector('.img-upload__preview img');
const overlay = document.querySelector('.img-upload__overlay');

const ESC_KEY = 'Escape';

const pristine = new Pristine(form, {
  classTo: 'img-upload__field-wrapper',
  errorClass: 'img-upload__field--invalid',
  successClass: 'img-upload__field--valid',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextTag: 'span',
  errorTextClass: 'img-upload__error',
});

const validateHashtags = (value) => {
  if (!value) {return true;}

  const tags = value.trim().toLowerCase().split(/\s+/);
  if (tags.length > 5) {return false;}

  const seen = new Set();
  return tags.every((tag) => {
    if (!/^#[a-z0-9]{1,19}$/.test(tag)) {return false;}
    if (seen.has(tag)) {return false;}
    seen.add(tag);
    return true;
  });
};

const getHashtagsError = (value) => {
  if (!value) {return '';}
  const tags = value.trim().toLowerCase().split(/\s+/);

  if (tags.length > 5) {return 'Нельзя указывать больше пяти хэш-тегов';}

  const seen = new Set();
  for (const tag of tags) {
    if (!/^#[a-z0-9]{1,19}$/.test(tag)) {
      return 'Хэш-тег должен начинаться с # и содержать буквы и цифры, не более 20 символов';
    }
    if (seen.has(tag)) {return 'Хэш-теги не должны повторяться';}
    seen.add(tag);
  }
  return '';
};

pristine.addValidator(hashtagsInput, validateHashtags, getHashtagsError);

pristine.addValidator(
  commentInput,
  (value) => value.length <= 140,
  'Комментарий не может быть длиннее 140 символов'
);

const onFileChange = () => {
  const file = inputFile.files[0];
  if (!file) {return;}

  const reader = new FileReader();
  reader.addEventListener('load', () => {
    previewImage.src = reader.result;
  });
  reader.readAsDataURL(file);

  overlay.classList.remove('hidden');
  document.body.classList.add('modal-open');
};

const closeForm = () => {
  overlay.classList.add('hidden');
  document.body.classList.remove('modal-open');
  form.reset();
  pristine.reset();
};

const onFieldEsc = (evt) => {
  if (evt.key === ESC_KEY) {
    evt.stopPropagation();
  }
};

const onDocumentEsc = (evt) => {
  if (evt.key === ESC_KEY && !hashtagsInput.matches(':focus') && !commentInput.matches(':focus')) {
    closeForm();
  }
};

const onFormSubmit = async (evt) => {
  evt.preventDefault();
  const isValid = pristine.validate();
  if (!isValid) {return;}

  const submitButton = form.querySelector('.img-upload__submit');
  submitButton.disabled = true;

  const formData = new FormData(form);

  const response = await fetch(form.action, {
    method: form.method,
    body: formData,
  });

  if (response.ok) {
    closeForm();
  }

  submitButton.disabled = false;
};

const initForm = () => {
  inputFile.addEventListener('change', onFileChange);
  cancelButton.addEventListener('click', closeForm);
  hashtagsInput.addEventListener('keydown', onFieldEsc);
  commentInput.addEventListener('keydown', onFieldEsc);
  document.addEventListener('keydown', onDocumentEsc);
  form.addEventListener('submit', onFormSubmit);
};

export {initForm};
