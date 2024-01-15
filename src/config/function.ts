import moment from 'moment';
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import isEqual from 'react-fast-compare';
import {BackHandler, Keyboard, Platform, processColor} from 'react-native';
import BackgroundGeolocation, {
  Location,
} from 'react-native-background-geolocation';
import { RootState } from '../redux-store/all-reducer';
import {useSelector as useReduxSelector} from 'react-redux';

type TypesBase =
  | 'bigint'
  | 'boolean'
  | 'function'
  | 'number'
  | 'object'
  | 'string'
  | 'symbol'
  | 'undefined';

export type CustomOmit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
const formatMoney = (amount: number | string | any) => {
  return `${amount}`.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
};
const formatPhoneNumber = (phoneNumber: string) => {
  const numericPhoneNumber = phoneNumber.replace(/\D/g, '');
  if (numericPhoneNumber.length === 10 && numericPhoneNumber.startsWith('0')) {
    return `+84 ${numericPhoneNumber.substring(1)}`;
  }

  return phoneNumber;
};
const randomUniqueId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    // eslint-disable-next-line no-bitwise
    const r = (Math.random() * 16) | 0,
      // eslint-disable-next-line no-bitwise
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};
const onCheckType = (source: any, type: TypesBase): source is TypesBase => {
  return typeof source === type;
};
const isIos = Platform.OS === 'ios';
function useDisableBackHandler(disabled: boolean, callback?: () => void) {
  // function
  const onBackPress = useCallback(() => {
    if (onCheckType(callback, 'function')) {
      callback();
    }
    return true;
  }, [callback]);

  useEffect(() => {
    if (disabled) {
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
    } else {
      BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }
    return () =>
      BackHandler.removeEventListener('hardwareBackPress', onBackPress);
  }, [disabled, onBackPress]);
}

const useDeepCompareEffect = (
  callback: React.EffectCallback,
  dependencies: React.DependencyList | any,
) => {
  const currentDependenciesRef = useRef();

  if (!isEqual(currentDependenciesRef.current, dependencies)) {
    currentDependenciesRef.current = dependencies;
  }

  useEffect(callback, [currentDependenciesRef.current]);
};

function useDismissKeyboard(isHide: boolean) {
  useEffect(() => {
    if (isHide) {
      Keyboard.dismiss();
    }
  }, [isHide]);
}

const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number => {
  const R = 6371; // Earth radius in kilometers

  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c; // Distance in kilometers

  return distance;
};

export const hexStringFromCSSColor = (color: string) => {
  const processedColor = processColor(color);
  const colorStr = `${(processedColor ?? '').toString(16)}`;
  const withoutAlpha = colorStr.substring(2, colorStr.length);
  const alpha = colorStr.substring(0, 2);
  return `#${withoutAlpha}${alpha}`;
};

const useBackgroundLocation = () => {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string>('');

  const backgroundLocationListener = (location: Location) => {
    // Handle the retrieved location data
    setLocation(location);

  };

  const backgroundErrorListener = (errorCode: number) => {
    // Handle background location errors
    switch (errorCode) {
      case 0:
        setError(
          'Không thể lấy được vị trí GPS. Bạn nên di chuyển đến vị trí không bị che khuất và thử lại.',
        );
        break;
      case 1:
        setError('GPS đã bị tắt. Vui lòng bật lại.');
        break;
      default:
        setError(
          'Không thể lấy được vị trí GPS. Bạn nên di chuyển đến vị trí không bị che khuất và thử lại.',
        );
    }
  };

  useEffect(() => {
    // Add listeners
    BackgroundGeolocation.onLocation((location) =>{
      backgroundLocationListener(location)
    },error =>{
      backgroundErrorListener(error)
    });
   

    // Start background geolocation
    BackgroundGeolocation.start();

    // Clean up
    return () => {
      BackgroundGeolocation.un('location', backgroundLocationListener);
      BackgroundGeolocation.un('locationError', backgroundErrorListener);
    };
  }, []);

  const memoizedValue = useMemo(() => ({ location, error }), [location, error]);

  return memoizedValue;
};

function calculateDateDifference(targetDate:string) {
  const currentDate = moment();
  const targetDateObj = moment(targetDate, 'DD/MM/YYYY');

  const daysDifference = currentDate.diff(targetDateObj, 'days');
  const monthsDifference = currentDate.diff(targetDateObj, 'months');
  const yearsDifference = currentDate.diff(targetDateObj, 'years');

  const remainingDays = daysDifference - (monthsDifference * 30);

  return {
    years: yearsDifference,
    months: monthsDifference,
    days: remainingDays,
  };
}

function useSelector<T>(
  selector: (state: RootState) => T,
  equalityFn = isEqual,
): T {
  return useReduxSelector<RootState, T>(selector, equalityFn);
}

export {
  formatPhoneNumber,
  formatMoney,
  useDeepCompareEffect,
  randomUniqueId,
  useDisableBackHandler,
  onCheckType,
  isIos,
  useDismissKeyboard,
  calculateDistance,
  useBackgroundLocation,
  calculateDateDifference,
  useSelector
};
