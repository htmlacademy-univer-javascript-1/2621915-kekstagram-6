const MAX_SYMBOLS = 20;
const MAX_HASHTAGS = 5;

function initForm() {
  const formUpload = document.querySelector('.img-upload__form');
  const fileInput = formUpload.querySelector('.img-upload__input');
  const overlay = document.querySelector('.img-upload__overlay');
  const cancelButton = overlay.querySelector('#upload-cancel');
  const inputHashtag = formUpload.querySelector('.text__hashtags');
  const inputComment = formUpload.querySelector('.text__description');

  const pristine = new Pristine(formUpload, {
    classTo: 'img-upload__field-wrapper',
    errorClass: 'img-upload__field-wrapper--invalid',
    successClass: 'img-upload__field-wrapper--valid',
    errorTextParent: 'img-upload__field-wrapper',
    errorTextTag: 'div',
    errorTextClass: 'img-upload__error'
  });

  const validateHashtags = (value) => {
    const inputText = value.trim();

    if (inputText === '') {
      return true;
    }

    const hashtags = inputText.split(/\s+/);

    if (hashtags.length > MAX_HASHTAGS) {
      return false;
    }

    const lowerCaseHashtags = new Set();

    for (let i = 0; i < hashtags.length; i++) {
      const hashtag = hashtags[i];

      if (hashtag[0] !== '#') {
        return false;
      }

      if (hashtag === '#') {
        return false;
      }

      if (hashtag.length > MAX_SYMBOLS) {
        return false;
      }

      if (!/^#[a-zа-яё0-9-]{1,19}$/i.test(hashtag)) {
        return false;
      }

      if (hashtag.includes(' ', 1)) {
        return false;
      }

      const lowerCaseTag = hashtag.toLowerCase();
      if (lowerCaseHashtags.has(lowerCaseTag)) {
        return false;
      }
      lowerCaseHashtags.add(lowerCaseTag);
    }

    return true;
  };

  const getHashtagErrorMessage = (value) => {
    const inputText = value.trim();

    if (inputText === '') {
      return '';
    }

    const hashtags = inputText.split(/\s+/);

    if (hashtags.length > MAX_HASHTAGS) {
      return `Нельзя указать больше ${MAX_HASHTAGS} хэш-тегов`;
    }

    for (let i = 0; i < hashtags.length; i++) {
      const hashtag = hashtags[i];

      if (hashtag[0] !== '#') {
        return 'Хэш-тег должен начинаться с символа #';
      }

      if (hashtag === '#') {
        return 'Хэштег не может состоять только из решётки';
      }

      if (hashtag.length > MAX_SYMBOLS) {
        return `Максимальная длина хэштега ${MAX_SYMBOLS} символов`;
      }

      if (!/^#[a-zа-яё0-9-]{1,19}$/i.test(hashtag)) {
        return 'Хэштег содержит недопустимые символы';
      }

      if (hashtag.includes(' ', 1)) {
        return 'Хэштеги должны разделяться пробелами';
      }
    }

    const lowerCaseTags = hashtags.map((tag) => tag.toLowerCase());
    const uniqueTags = [...new Set(lowerCaseTags)];
    if (uniqueTags.length !== hashtags.length) {
      return 'Хэштеги не должны повторяться';
    }

    return '';
  };

  pristine.addValidator(
    inputHashtag,
    validateHashtags,
    getHashtagErrorMessage,
    2,
    false
  );

  pristine.addValidator(
    inputComment,
    (value) => value.length <= 140,
    'Длина комментария не может превышать 140 символов',
    2,
    false
  );

  const updateSubmitButton = () => {
    const submitButton = formUpload.querySelector('.img-upload__submit');
    const isValid = pristine.validate();

    if (isValid) {
      submitButton.disabled = false;
      submitButton.removeAttribute('title');
    } else {
      submitButton.disabled = true;
      submitButton.setAttribute('title', 'Исправьте ошибки в форме');
    }
  };

  const openForm = () => {
    if (!fileInput.files[0]) {
      return;
    }
    overlay.classList.remove('hidden');
    document.body.classList.add('modal-open');
    updateSubmitButton();
  };

  const closeForm = () => {
    overlay.classList.add('hidden');
    document.body.classList.remove('modal-open');
    formUpload.reset();
    pristine.reset();
    fileInput.value = '';

    const submitButton = formUpload.querySelector('.img-upload__submit');
    submitButton.disabled = false;
    submitButton.removeAttribute('title');
  };

  const onInput = () => {
    pristine.validate();
    updateSubmitButton();
  };

  fileInput.addEventListener('change', openForm);
  cancelButton.addEventListener('click', closeForm);

  const onDocumentKeydown = (evt) => {
    if (evt.key === 'Escape' && !overlay.classList.contains('hidden')) {
      closeForm();
    }
  };

  document.addEventListener('keydown', onDocumentKeydown);

  [inputHashtag, inputComment].forEach((field) => {
    field.addEventListener('keydown', (evt) => {
      if (evt.key === 'Escape') {
        evt.stopPropagation();
      }
    });

    field.addEventListener('input', onInput);
  });

  formUpload.addEventListener('submit', (evt) => {
    evt.preventDefault();

    const isValid = pristine.validate();

    if (isValid) {
      formUpload.submit();
    } else {
      pristine.validate();
      updateSubmitButton();
    }
  });

  fileInput.addEventListener('change', () => {
    pristine.reset();
    updateSubmitButton();
  });
}

export { initForm };
