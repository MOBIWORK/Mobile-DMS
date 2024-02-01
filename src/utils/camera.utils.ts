import {
  ImageLibraryOptions,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import RNFS from 'react-native-fs';
export const openImagePickerCamera = async(
  callBack: (image: string | undefined, base64?: string) => void,
) => {
  const options: ImageLibraryOptions = {
    mediaType: 'photo',
    includeBase64: true,
    maxHeight: 200,
    maxWidth:200,
    presentationStyle: 'fullScreen',
    quality:0.5
    
  };
  let base64Image: string;

  await launchCamera(options, async (response) => {
    if (response.didCancel) {
      console.log('User cancelled camera picker');
    } else if (response.errorMessage) {
      console.log('Camera picker error: ', response.errorMessage);
    } else if (
      response?.assets?.[0].uri ||
      (response.assets && response.assets.length > 0)
    ) {
      const selectedImage = response?.assets?.[0].uri;
      base64Image = await RNFS.readFile(selectedImage!, 'base64').then(res => {
        return res;
      });
      callBack(selectedImage, base64Image);
    }
  });
};

export const openImagePicker = (
  callBack: (image: string | undefined) => void,
  isUri?: boolean,
) => {
  const options: ImageLibraryOptions = {
    mediaType: 'photo',
    includeBase64: true,
    maxHeight: 2000,
    maxWidth: 2000,
    presentationStyle: 'fullScreen',
  };

  launchImageLibrary(options, response => {
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.errorMessage) {
      console.log('Image picker error: ', response.errorMessage);
    } else if (response.assets && response.assets.length > 0) {
      const selectedImage = isUri
        ? response.assets[0].base64
        : response.assets[0].uri;
      callBack(selectedImage);
    }
  });
};
