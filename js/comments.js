import { getRandomArrayElement, getRandomInteger, generateUniqueIds } from './util.js';
import { MESSAGES, NAMES, MIN_COMMENTS_COUNT, MAX_COMMENTS_COUNT, MIN_MESSAGES_COUNT, MAX_MESSAGES_COUNT } from './constants.js';

const generateMessage = () => {
  const messageCount = getRandomInteger(MIN_MESSAGES_COUNT, MAX_MESSAGES_COUNT);
  const selectedMessages = [];

  for (let i = 0; i < messageCount; i++) {
    selectedMessages.push(getRandomArrayElement(MESSAGES));
  }

  return selectedMessages.join(' ');
};

const createComments = () => {
  const commentsCount = getRandomInteger(MIN_COMMENTS_COUNT, MAX_COMMENTS_COUNT);
  const commentIds = generateUniqueIds(commentsCount);

  return Array.from({ length: commentsCount }, (_, index) => ({
    id: commentIds[index],
    avatar: `img/avatar-${getRandomInteger(1, 6)}.svg`,
    message: generateMessage(),
    name: getRandomArrayElement(NAMES)
  }));
};

export { createComments };
