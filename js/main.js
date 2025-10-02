const DESCRIPTIONS = [
  'Прекрасный день!',
  'Захватывающий вид.',
  'Наконец-то отпуск.',
  'Просто красивое фото.',
  'Воспоминания.',
  'Сделано с душой.',
  'Удачный кадр.',
  'Мой любимый момент.',
  'Как же здесь хорошо!',
  'Путешествие продолжается.',
];

const MESSAGES = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

const NAMES = [
  'Артём', 'Мария', 'Дмитрий', 'Анна', 'Сергей',
  'Елена', 'Алексей', 'Ольга', 'Иван', 'Наталья',
  'Павел', 'Юлия', 'Михаил', 'Виктория', 'Александр'
];

const getRandomInteger = (min, max) => {
  const lower = Math.ceil(Math.min(Math.abs(min), Math.abs(max)));
  const upper = Math.floor(Math.max(Math.abs(min), Math.abs(max)));
  const result = Math.random() * (upper - lower + 1) + lower;
  return Math.floor(result);
};

const getRandomArrayElement = (elements) => elements[getRandomInteger(0, elements.length - 1)];

const generateUniqueIds = (count) => {
  const ids = new Set();
  while (ids.size < count) {
    ids.add(getRandomInteger(1, 1000));
  }
  return Array.from(ids);
};

const generateMessage = () => {
  const messageCount = getRandomInteger(1, 2);
  const selectedMessages = [];

  for (let i = 0; i < messageCount; i++) {
    selectedMessages.push(getRandomArrayElement(MESSAGES));
  }

  return selectedMessages.join(' ');
};

const createComments = () => {
  const commentsCount = getRandomInteger(0, 30);
  const commentIds = generateUniqueIds(commentsCount);

  return Array.from({ length: commentsCount }, (_, index) => ({
    id: commentIds[index],
    avatar: `img/avatar-${getRandomInteger(1, 6)}.svg`,
    message: generateMessage(),
    name: getRandomArrayElement(NAMES)
  }));
};

const createPhoto = (index) => ({
  id: index,
  url: `photos/${index}.jpg`,
  description: getRandomArrayElement(DESCRIPTIONS),
  likes: getRandomInteger(15, 200),
  comments: createComments()
});

const generatePhotos = () => {
  const photosArr = [];
  for (let i = 1; i <= 25; i++) {
    photosArr.push(createPhoto(i));
  }
  return photosArr;
};

const photos = generatePhotos();

export { photos };
