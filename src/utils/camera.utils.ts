import {PermissionsAndroid} from 'react-native';
import {
  ImageLibraryOptions,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import {storage} from './commom.utils';
import moment from 'moment';

export default async function base64File(url: string) {
  const data = await fetch(url);
  const blob = await data.blob();
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      const base64data = reader.result;
      resolve(base64data);
    };
  });
}

export const openImagePickerCamera = async (
  callBack: (
    image: string | undefined,
    base64?: string,
    timeStamp?: any,
  ) => void,
) => {
  const options: ImageLibraryOptions = {
    mediaType: 'photo',
    includeBase64: true,
    quality: 0.5,
    maxHeight: 1000,
    maxWidth: 1000,
    presentationStyle: 'fullScreen',
  };
  let base64Image: string;

  await launchCamera(options, async response => {
    const timeStamp = moment(new Date()).valueOf();
    storage.set('time', String(timeStamp));
    if (response.didCancel) {
    } else if (response.errorMessage) {
    } else if (
      response?.assets?.[0].uri ||
      (response.assets && response.assets.length > 0)
    ) {
      const selectedImage = response?.assets?.[0].uri;
      base64Image = response.assets[0].base64 as string;
      callBack(selectedImage, base64Image, response.assets[0].timestamp);
    }
  });
};

export const openImagePicker = async (
  callBack: (image: string | undefined, base64?: any, timeStamp?: any) => void,
  maxWidth?: number,
  maxHeight?: number,
) => {
  (maxWidth = 2000), (maxHeight = 2000);
  const options: ImageLibraryOptions = {
    mediaType: 'photo',
    includeBase64: true,
    maxHeight: maxWidth,
    maxWidth: maxHeight,
    presentationStyle: 'fullScreen',
    quality: 0.5,
  };
  let base64Image: string;

  await launchImageLibrary(options, async response => {
    const timeStamp = moment(new Date()).valueOf();
    storage.set('time', String(timeStamp));
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.errorMessage) {
      console.log('Image picker error: ', response.errorMessage);
    } else if (response.assets && response.assets.length > 0) {
      const selectedImage = response.assets[0].uri;
      // base64Image = await RNFS.readFile(selectedImage!, 'base64').then(res => {
      //   return res;
      // });
      base64Image = response.assets[0].base64 as string;
      callBack(selectedImage, base64Image, response.assets[0].timestamp);
    }
  });
};
