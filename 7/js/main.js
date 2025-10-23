import { generatePhotos } from './photos.js';
import { renderThumbnails } from './thumbnails.js';

const photos = generatePhotos();

renderThumbnails(photos);
