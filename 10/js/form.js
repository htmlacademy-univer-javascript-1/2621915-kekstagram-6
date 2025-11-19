import { pristine } from './validation.js';

const form = document.querySelector('.img-upload__form');
const fileInput = document.querySelector('#upload-file');
const overlay = document.querySelector('.img-upload__overlay');
const cancelButton = document.querySelector('#upload-cancel');
const hashtagInput = document.querySelector('.text__hashtags');
const commentInput = document.querySelector('.text__description');

const escKeydownHandler = null;

const closeForm = () => {
  form.reset();
  fileInput.value = '';
  overlay.classList.add('hidden');
  document.body.classList.remove('modal-open');
  if (escKeydownHandler) {
    document.removeEventListener('keydown', escKeydownHandler);
  }
  pristine.reset();
};

const onDocumentKeydown = (evt) => {
  if (evt.key === 'Escape' && !evt.target.matches('.text__hashtags, .text__description')) {
    evt.preventDefault();
    closeForm();
  }
};
const openForm = () => {
  overlay.classList.remove('hidden');
  document.body.classList.add('modal-open');
  document.addEventListener('keydown', onDocumentKeydown);
};

const stopPropagation = (evt) => {
  if (evt.key === 'Escape') {
    evt.stopPropagation();
  }
};

const onFileInputChange = () => {
  openForm();
};

const onCancelButtonClick = () => {
  closeForm();
};

const onHashtagInputKeydown = (evt) => {
  stopPropagation(evt);
};

const onCommentInputKeydown = (evt) => {
  stopPropagation(evt);
};

const onFormSubmit = (evt) => {
  if (!pristine.validate()) {
    evt.preventDefault();
  }
};

const initForm = () => {
  fileInput.addEventListener('change', onFileInputChange);
  cancelButton.addEventListener('click', onCancelButtonClick);
  hashtagInput.addEventListener('keydown', onHashtagInputKeydown);
  commentInput.addEventListener('keydown', onCommentInputKeydown);
  form.addEventListener('submit', onFormSubmit);
};

export { initForm, closeForm };
