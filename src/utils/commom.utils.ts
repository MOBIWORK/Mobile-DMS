import {MMKV} from 'react-native-mmkv';
import {Dimensions, InteractionManager, Keyboard, Linking, Platform, StyleSheet} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import store, {AppActions} from '../redux-store';
import * as LocalAuthentication from 'expo-local-authentication';
import {AppConstant} from '../const';
import * as Location from 'expo-location';
import {LocationAccuracy} from 'expo-location';

export const storage = new MMKV();

export const sleep = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms));

export const padTo2Digits = (num: number) => {
  return num.toString().padStart(2, '0');
};

//format dateTime to hh:pp dd//mm//yyyy
export const convertDateToString = (dateTime: number) => {
  const date = new Date(dateTime);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
  const year = date.getFullYear();

  return `${hours}:${minutes} - ${day}/${month}/${year}`;
};

export const minutesLate = (
  dateTime1: number | string,
  dateTime2: number | string,
) => {
  const date1 = new Date(dateTime1).getTime();
  const date2 = new Date(dateTime2).getTime();

  const differenceInMinutes = (date2 - date1) / (1000 * 60);
  return parseInt(differenceInMinutes.toString(), 10);
};

export const getHoursMinutes = (dateTime: number | string) => {
  const date = new Date(dateTime);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${hours}:${minutes}`;
};

export const getHoursMinutesSeconds = (milliseconds: number, getLabel: any) => {
  let seconds = Math.floor(milliseconds / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);

  seconds = seconds % 60;
  minutes = minutes % 60;

  return `${padTo2Digits(hours)} ${getLabel('hours')} ${padTo2Digits(
    minutes,
  )} ${getLabel('minutes')} ${padTo2Digits(seconds)} ${getLabel('seconds')}`;
};

export const convertTimeDate = (dateTime: number, language: string) => {
  const date = new Date().getTime();
  const firstDate = new Date(dateTime).getTime();
  const timeDiffMillis = date - firstDate;

  // Tính thời gian theo giờ, phút và giây
  const hours = Math.floor(timeDiffMillis / (60 * 60 * 1000));
  const minutes = Math.floor((timeDiffMillis % (60 * 60 * 1000)) / (60 * 1000));
  const seconds = Math.floor((timeDiffMillis % (60 * 1000)) / 1000);

  let type, dataReturn, unit;

  if (hours >= 1 && hours < 24) {
    type = 'hour';
    dataReturn = hours;
  } else if (hours > 24) {
    dataReturn = convertDateToString(dateTime);
  } else if (minutes >= 1) {
    type = 'minute';
    dataReturn = minutes;
  } else {
    type = 'second';
    dataReturn = seconds;
  }

  switch (type) {
    case 'hour':
      unit = language === 'vi' ? 'giờ trước' : 'hours ago';
      break;
    case 'minute':
      unit = language === 'vi' ? 'phút trước' : 'minutes ago';
      break;
    case 'second':
      unit = language === 'vi' ? 'giây trước' : 'seconds ago';
      break;
    default:
      unit = '';
      break;
  }

  return `${dataReturn} ${unit}`;
};

export function convertHoursMinutes(gioPhutGiay: string) {
  if (!gioPhutGiay) {
    return '';
  }
  const gioPhutGiayArr = gioPhutGiay.split(':');
  if (gioPhutGiayArr.length !== 3) {
    return gioPhutGiay;
  }
  const gio = gioPhutGiayArr[0];
  const phut = gioPhutGiayArr[1];
  return `${gio}:${phut}`;
}
//format dateTime to dd//mm//yyyy
export const convertDate = (time: number) => {
  const date = new Date(time);
  return `${padTo2Digits(date.getDate())}/${padTo2Digits(
    date.getMonth() + 1,
  )}/${date.getFullYear()}`;
};

//format date to hh:mm:ss
export const formatTime2 = (timeStamp: number) => {
  const date = new Date(timeStamp);
  return [
    padTo2Digits(date.getHours()),
    padTo2Digits(date.getMinutes()),
    padTo2Digits(date.getSeconds()),
  ].join(':');
};

//format dateTime to mm/yyyy
export const convertMonthYear = (time: number) => {
  const date = new Date(time);
  return `${padTo2Digits(date.getMonth() + 1)}/${date.getFullYear()}`;
};

export const convertDateTimeToTimestamp = (dateTime: number | string) => {
  const date = new Date(dateTime).getTime();
  return date / 1000;
};

export const formatAMPM = (date: Date) => {
  let hours = date.getHours();
  let minutes: string | number = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  return hours + ':' + minutes + ' ' + ampm;
};

export const isToday = (dateTime: number) => {
  const date = new Date(dateTime);
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

export const openMaps = async (latitude: number, longitude: number) => {
  const daddr = `${latitude},${longitude}`;
  const company = Platform.OS === 'ios' ? 'apple' : 'google';
  await Linking.openURL(`http://maps.${company}.com/maps?daddr=${daddr}`);
};

//format 1000 to 1,000
export const convertNumber = (value: number) => {
  return new Intl.NumberFormat().format(value).replaceAll(',', '.');
};

export const removeVietnamesePunctuation = (str: string) => {
  const punctuationMarks = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g;
  const vietnameseMarks =
    /[áàảãạăắằẳẵặâấầẩẫậđéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵ]/g;

  const removePunctuation = str.replace(punctuationMarks, '');
  return removePunctuation.replace(vietnameseMarks, '');
};

export const handleSearch = (
  text: string,
  setValue: (text: string) => void,
  masterData: any[],
  setData: any,
) => {
  if (text) {
    setValue(text);

    const newData = masterData.filter(item => {
      const itemData = item.label
        ? removeVietnamesePunctuation(item.label).trim().toUpperCase()
        : ''.toUpperCase();
      const textData = removeVietnamesePunctuation(text).trim().toUpperCase();
      return itemData.indexOf(textData) > -1;
    });

    setData(newData);
  } else {
    setData(masterData);
    setValue('');
  }
};

export const handleSearchStaff = (
  text: string,
  setValue: (text: string) => void,
  masterData: any,
  setData: any,
) => {
  if (text) {
    setValue(text);

    const newData = masterData.data.filter((item: any) => {
      const itemData = item.employee_name
        ? removeVietnamesePunctuation(item.employee_name).trim().toUpperCase()
        : ''.toUpperCase();
      const textData = removeVietnamesePunctuation(text).trim().toUpperCase();
      return itemData.indexOf(textData) > -1;
    });

    setData({
      ...masterData,
      data: newData,
    });
  } else {
    setData(masterData);
    setValue('');
  }
};

export const CheckNetworkState = async () => {
  const state = await NetInfo.fetch();
  if (!state.isConnected) {
    store.dispatch(
      AppActions.setError({
        title: null,
        message: 'Không có kết nối mạng',
        viewOnly: true,
      }),
    );
    store.dispatch(AppActions.setProcessingStatus(false));
    return;
  }
};

export const dismissKeyboard = async (func: () => void) => {
  await Keyboard.dismiss();
  await sleep(100);
  InteractionManager.runAfterInteractions(() => {
    if (typeof func === 'function') {
      func();
    }
  });
};

export const getDayName = (getLabel: any, dateTime?: number) => {
  let curDay;
  if (dateTime) {
    curDay = new Date(dateTime).getDay();
  } else {
    curDay = new Date().getDay();
  }
  switch (curDay) {
    case 0:
      return getLabel('Sunday');
    case 1:
      return getLabel('Monday');
    case 2:
      return getLabel('Tuesday');
    case 3:
      return getLabel('Wednesday');
    case 4:
      return getLabel('Thursday');
    case 5:
      return getLabel('Friday');
    case 6:
      return getLabel('Saturday');
  }
};

export const biometric = async (setBiometricType: any, setOpenDialog: any) => {
  const supportType =
    await LocalAuthentication.supportedAuthenticationTypesAsync();
  const isSupported = await LocalAuthentication.hasHardwareAsync();
  //Nếu thiết bị có hỗ trợ nhưng supported = false thì -> người dùng đã tắt chức năng này => show popup vào cài đặt để mở lại
  if (setBiometricType.length > 0 && !isSupported) {
    setOpenDialog(true);
  } else if (isSupported && supportType.length > 0) {
    if (Platform.OS === 'ios') {
      setBiometricType(
        setBiometricType[0] === '1'
          ? AppConstant.BiometricType.TouchID
          : AppConstant.BiometricType.FaceID,
      );
    } else {
      setBiometricType(AppConstant.BiometricType.TouchID);
    }
  } else {
    setBiometricType(AppConstant.BiometricType.null);
  }
};

export const isObjectEmpty = (objectName: any | string) => {
  return Object.keys(objectName).length === 0;
};

const chars =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
export const Base64 = {
  btoa: (input: string = '') => {
    let str = input;
    let output = '';

    for (
      let block = 0, charCode, i = 0, map = chars;
      str.charAt(i | 0) || ((map = '='), i % 1);
      output += map.charAt(63 & (block >> (8 - (i % 1) * 8)))
    ) {
      charCode = str.charCodeAt((i += 3 / 4));

      if (charCode > 0xff) {
        throw new Error(
          "'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.",
        );
      }

      block = (block << 8) | charCode;
    }

    return output;
  },

  atob: (input: string = '') => {
    let str = input.replace(/[=]+$/, '');
    let output = '';

    if (str.length % 4 == 1) {
      throw new Error(
        "'atob' failed: The string to be decoded is not correctly encoded.",
      );
    }
    for (
      let bc = 0, bs = 0, buffer, i = 0;
      (buffer = str.charAt(i++));
      ~buffer && ((bs = bc % 4 ? bs * 64 + buffer : buffer), bc++ % 4)
        ? (output += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6))))
        : 0
    ) {
      buffer = chars.indexOf(buffer);
    }

    return output;
  },
};

export const Auth_header = (api_key: string, api_secret: string) => {
  return {
    Authorization: `Basic ${Base64.btoa(api_key + ':' + api_secret)}`,
    'content-type': 'application/json',
  };
};

export const handleOpenSettings = async () => {
  if (Platform.OS === 'ios') {
    await Linking.openURL('app-settings:');
  } else {
    await Linking.openSettings();
  }
};

export const getCurrentLocation = async () => {
  // const status = await Location.getForegroundPermissionsAsync();
  const isEnable = await Location.hasServicesEnabledAsync();
  if (isEnable) {
    const location = await Location.getCurrentPositionAsync({
      accuracy: LocationAccuracy.Balanced,
    });
    if (location) {
      return location;
    } else {
      return null;
    }
  } else {
    return null;
  }
};

export const formatCash = (str: string) => {
  if (!str) {
    return '';
  }
  return str
    .split('')
    .reverse()
    .reduce((prev, next, index) => {
      return (index % 3 ? next : next + '.') + prev;
    });
};
const guidelineBaseWidth = 350;
const scale = (size: number) => (shortDimension / guidelineBaseWidth) * size;
const {width, height} = Dimensions.get('window');
const [shortDimension] = width < height ? [width, height] : [height, width];
export const sizeScale = (size: number, factor = 0.5) =>
  size + (scale(size) - size) * factor;

  export const enhance = <T>(arrStyle: Array<T>) => {
    return StyleSheet.flatten<T>(arrStyle);
  };
  
  export const propsToStyle = <T = any>(arrStyle: Array<T>) => {
    return arrStyle
      .filter(
        (x:any) => x !== undefined && !Object.values(x).some(v => v === undefined),
      )
      .reduce((prev: any, curr: any) => {
        // eslint-disable-next-line prefer-destructuring
        const firstKey = Object.keys(curr)[0];
        const firstValue = curr[firstKey];
  
        if (
          !['opacity', 'zIndex', 'flex'].includes(firstKey as never) &&
          typeof firstValue === 'number'
        ) {
          curr[firstKey as string] = sizeScale(firstValue);
        }
        return {...prev, ...curr};
      }, {});
  };

const guidelineBaseWidth = 350;
const scale = (size: number) => (shortDimension / guidelineBaseWidth) * size;
const {width, height} = Dimensions.get('window');
const [shortDimension] = width < height ? [width, height] : [height, width];
export const sizeScale = (size: number, factor = 0.5) =>
  size + (scale(size) - size) * factor;

  export const enhance = <T>(arrStyle: Array<T>) => {
    return StyleSheet.flatten<T>(arrStyle);
  };
  
  export const propsToStyle = <T = any>(arrStyle: Array<T>) => {
    return arrStyle
      .filter(
        (x:any) => x !== undefined && !Object.values(x).some(v => v === undefined),
      )
      .reduce((prev: any, curr: any) => {
        // eslint-disable-next-line prefer-destructuring
        const firstKey = Object.keys(curr)[0];
        const firstValue = curr[firstKey];
  
        if (
          !['opacity', 'zIndex', 'flex'].includes(firstKey as never) &&
          typeof firstValue === 'number'
        ) {
          curr[firstKey as string] = sizeScale(firstValue);
        }
        return {...prev, ...curr};
      }, {});
  };