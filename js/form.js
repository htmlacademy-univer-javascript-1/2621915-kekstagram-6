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
    classTo: 'img-upload__item',
    errorClass: 'img-upload__item--invalid',
    successClass: 'img-upload__item--valid',
    errorTextParent: 'img-upload__item',
    errorTextTag: 'div',
    errorTextClass: 'img-upload__error',
  });

  let errorMessage = '';

  const getErrorMessage = () => errorMessage;

  const hashtagsHandler = (value) => {
    errorMessage = '';
    const text = value.toLowerCase().trim();
    if (!text) {return true;}

    const items = text.split(/\s+/);

    const rules = [
      {
        check: items.some((item) => item.indexOf('#', 1) >= 1),
        error: 'Хэш-теги должны разделяться одним пробелом',
      },
      {
        check: items.some((item) => item[0] !== '#'),
        error: 'Хэш-тег должен начинаться с символа #',
      },
      {
        check: items.some((item, i, arr) => arr.includes(item, i + 1)),
        error: 'Хэш-теги не должны повторяться',
      },
      {
        check: items.some((item) => item.length > MAX_SYMBOLS),
        error: `Максимальная длина одного хэш-тега — ${MAX_SYMBOLS} символов`,
      },
      {
        check: items.length > MAX_HASHTAGS,
        error: `Нельзя указать больше ${MAX_HASHTAGS} хэш-тегов`,
      },
      {
        check: items.some((item) => !/^#[a-zа-яё0-9]{1,19}$/i.test(item)),
        error: 'Хэш-тег содержит недопустимые символы',
      },
    ];

    for (let i = 0; i < rules.length; i += 1) {
      if (rules[i].check) {
        errorMessage = rules[i].error;
        return false;
      }
    }

    return true;
  };

  pristine.addValidator(inputHashtag, hashtagsHandler, getErrorMessage, 2, false);

  pristine.addValidator(
    inputComment,
    (value) => value.length <= 140,
    'Комментарий не должен превышать 140 символов',
  );

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
  };

  fileInput.addEventListener('change', openForm);
  cancelButton.addEventListener('click', closeForm);

  document.addEventListener('keydown', (evt) => {
    if (evt.key === 'Escape') {closeForm();}
  });

  [inputHashtag, inputComment].forEach((field) => {
    field.addEventListener('keydown', (evt) => {
      if (evt.key === 'Escape') {evt.stopPropagation();}
    });
  });

  inputHashtag.addEventListener('input', () => {
    pristine.validate();
  });

  formUpload.addEventListener('submit', (evt) => {
    evt.preventDefault();
    if (pristine.validate()) {formUpload.submit();}
  });
}

export default initForm;
