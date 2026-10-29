import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { config } from '@/constants/config';

export function useImagePicker() {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    setLoading(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: config.imageQuality,
      });

      if (!result.canceled) {
        setImage(result.assets[0]);
        return result.assets[0];
      }
    } catch (err) {
      console.error('Image picker error:', err);
    } finally {
      setLoading(false);
    }
    return null;
  };

  const takePhoto = async () => {
    setLoading(true);
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') return null;

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: config.imageQuality,
      });

      if (!result.canceled) {
        setImage(result.assets[0]);
        return result.assets[0];
      }
    } catch (err) {
      console.error('Camera error:', err);
    } finally {
      setLoading(false);
    }
    return null;
  };

  const clearImage = () => setImage(null);

  return { image, loading, pickImage, takePhoto, clearImage };
}
