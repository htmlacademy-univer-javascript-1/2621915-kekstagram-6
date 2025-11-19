const form = document.querySelector('.img-upload__form');
const hashtagInput = document.querySelector('.text__hashtags');
const commentInput = document.querySelector('.text__description');

const validateHashtags = (value) => {
  if (value.trim() === '') {
    return true;
  }

  const hashtags = value.trim().split(/\s+/);
  const hashtagRegex = /^#[a-zа-яё0-9]{1,19}$/i;

  if (hashtags.length > 5) {
    return false;
  }

  for (const hashtag of hashtags) {
    if (hashtag === '#') {
      return false;
    }

    if (!hashtagRegex.test(hashtag)) {
      return false;
    }
  }

  const lowerCaseHashtags = hashtags.map((tag) => tag.toLowerCase());
  const uniqueHashtags = new Set(lowerCaseHashtags);

  if (uniqueHashtags.size !== hashtags.length) {
    return false;
  }

  return true;
};

const getHashtagError = (value) => {
  if (value.trim() === '') {
    return '';
  }

  const hashtags = value.trim().split(/\s+/);

  if (hashtags.length > 5) {
    return 'Нельзя указать больше пяти хэш-тегов';
  }

  for (const hashtag of hashtags) {
    if (hashtag === '#') {
      return 'Хэш-тег не может состоять только из решётки';
    }

    if (!/^#[a-zа-яё0-9]{1,19}$/i.test(hashtag)) {
      return 'Неправильный формат хэш-тега';
    }
  }

  const lowerCaseHashtags = hashtags.map((tag) => tag.toLowerCase());
  const uniqueHashtags = new Set(lowerCaseHashtags);

  if (uniqueHashtags.size !== hashtags.length) {
    return 'Один и тот же хэш-тег не может быть использован дважды';
  }

  return 'Неправильно заполнены хэш-теги';
};

const validateComment = (value) => value.length <= 140;

const getCommentError = () => 'Длина комментария не может составлять больше 140 символов';

const pristine = new Pristine(form, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextClass: 'img-upload__field-error'
});

pristine.addValidator(
  hashtagInput,
  validateHashtags,
  getHashtagError
);

pristine.addValidator(
  commentInput,
  validateComment,
  getCommentError
);

export { pristine };
