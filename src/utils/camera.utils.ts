import {
  ImageLibraryOptions,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';

export const openImagePickerCamera = (callBack: () => void) => {
  const options: ImageLibraryOptions = {
    mediaType: 'photo',
    includeBase64: true,
    maxHeight: 2000,
    maxWidth: 2000,
    presentationStyle: 'fullScreen',
  };

  launchCamera(options, response => {
    if (response.didCancel) {
      console.log('User cancelled camera picker');
    } else {
      // @ts-ignore
      if (response.error) {
        // @ts-ignore
        console.log('camera picker error: ', response.error);
      } else {
        // @ts-ignore
        callBack(response.uri || response.assets?.[0]?.base64);
      }
    }
  }).finally();
};

export const openImagePicker = (callBack: () => void, isUri?: boolean) => {
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
    } else {
      // @ts-ignore
      if (response.error) {
        // @ts-ignore
        console.log('Image picker error: ', response.error);
      } else {
        callBack(
          // @ts-ignore
          isUri ? response.assets?.[0]?.base64 : response.assets?.[0]?.uri,
        );
      }
    }
  }).finally();
};