const MAX_SYMBOLS = 20;
const MAX_HASHTAGS = 5;

function initForm() {
  const formUpload = document.querySelector('.img-upload__form');
  const fileInput = formUpload.querySelector('.img-upload__input');
  const overlay = document.querySelector('.img-upload__overlay');
  const cancelButton = overlay.querySelector('#upload-cancel');
  const inputHashtag = formUpload.querySelector('.text__hashtags');
  const inputComment = formUpload.querySelector('.text__description');
  const submitButton = formUpload.querySelector('.img-upload__submit');

  const pristine = new Pristine(formUpload, {
    classTo: 'img-upload__item',
    errorClass: 'img-upload__item--invalid',
    successClass: 'img-upload__item--valid',
    errorTextParent: 'img-upload__item',
    errorTextTag: 'div',
    errorTextClass: 'img-upload__error',
  });

  let errorMessage = '';
  const getError = () => errorMessage;

  const hashtagsHandler = (value) => {
    errorMessage = '';

    const inputText = value.toLowerCase().trim();
    if (!inputText) {return true;}

    const inputArray = inputText.split(/\s+/);

    const rules = [
      {
        check: inputArray.some((item) => item.indexOf('#', 1) >= 1),
        error: 'Хэш-теги должны разделяться одним пробелом',
      },
      {
        check: inputArray.some((item) => item[0] !== '#'),
        error: 'Хэш-тег должен начинаться с символа #',
      },
      {
        check: inputArray.some((item, num, arr) => arr.includes(item, num + 1)),
        error: 'Хэш-теги не должны повторяться',
      },
      {
        check: inputArray.some((item) => item.length > MAX_SYMBOLS),
        error: `Максимальная длина одного хэш-тега ${MAX_SYMBOLS} символов, включая решётку`,
      },
      {
        check: inputArray.length > MAX_HASHTAGS,
        error: `Нельзя указать больше ${MAX_HASHTAGS} хэш-тегов`,
      },
      {
        check: inputArray.some((item) => !/^#[a-zа-яё0-9]{1,19}$/i.test(item)),
        error: 'Хэш-тег содержит недопустимые символы',
      },
    ];

    return rules.every((rule) => {
      if (rule.check) {errorMessage = rule.error;}
      return !rule.check;
    });
  };

  pristine.addValidator(inputHashtag, hashtagsHandler, getError, 2, false);

  pristine.addValidator(
    inputComment,
    (value) => value.length <= 140,
    'Комментарий не должен превышать 140 символов'
  );

  const updateSubmitButton = () => {
    const isValid = pristine.validate();

    if (isValid) {
      submitButton.disabled = false;
      submitButton.removeAttribute('title');
    } else {
      submitButton.disabled = true;
      submitButton.setAttribute('title', 'Исправьте ошибки в форме');
    }
  };

  const onHashtagInput = () => updateSubmitButton();
  const onCommentInput = () => updateSubmitButton();

  const openForm = () => {
    if (!fileInput.files[0]) {return;}
    overlay.classList.remove('hidden');
    document.body.classList.add('modal-open');
  };

  const closeForm = () => {
    overlay.classList.add('hidden');
    document.body.classList.remove('modal-open');

    formUpload.reset();
    pristine.reset();
    fileInput.value = '';

    submitButton.disabled = false;
    submitButton.removeAttribute('title');
  };

  fileInput.addEventListener('change', openForm);
  cancelButton.addEventListener('click', closeForm);

  inputHashtag.addEventListener('input', onHashtagInput);
  inputComment.addEventListener('input', onCommentInput);

  const onDocumentKeydown = (evt) => {
    if (evt.key === 'Escape') {
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
  });

  formUpload.addEventListener('submit', (evt) => {
    evt.preventDefault();

    if (pristine.validate()) {
      formUpload.reset();
      pristine.reset();
      closeForm();
    } else {
      updateSubmitButton();
    }
  });

  updateSubmitButton();
}

export { initForm };
