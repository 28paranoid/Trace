import * as ImageManipulator from 'expo-image-manipulator';
import { config } from '@/constants/config';

export async function resizeImage(uri, maxWidth = config.imageMaxWidth, maxHeight = config.imageMaxHeight) {
  const result = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: maxWidth, height: maxHeight } }],
    { compress: config.imageQuality, format: ImageManipulator.SaveFormat.JPEG }
  );
  return result;
}

export async function createThumbnail(uri, size = config.thumbnailSize) {
  const result = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: size, height: size } }],
    { compress: 0.6, format: ImageManipulator.SaveFormat.JPEG }
  );
  return result;
}

export function generateFileName(extension = 'jpg') {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${timestamp}_${random}.${extension}`;
}
