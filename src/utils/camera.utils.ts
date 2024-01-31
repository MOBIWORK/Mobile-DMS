import {
  ImageLibraryOptions,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';

export const openImagePickerCamera = (callBack: (image: string | undefined,base64?:string) => void) => {
  const options: ImageLibraryOptions = {
    mediaType: 'photo',
    includeBase64: true,
    maxHeight: 2000,
    maxWidth: 2000,
    presentationStyle: 'fullScreen',
  };

  launchCamera(options, (response) => {
    if (response.didCancel) {
      console.log('User cancelled camera picker');
    } else if (response.errorMessage) {
      console.log('Camera picker error: ', response.errorMessage);
    } else if (response?.assets?.[0].uri || (response.assets && response.assets.length > 0)) {
      const selectedImage = response?.assets?.[0].uri
      const base64Image = response?.assets[0].base64
      callBack(selectedImage,base64Image);
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
