import {useCallback, useEffect, useRef} from 'react';
import isEqual from 'react-fast-compare';
import {BackHandler, Keyboard, Platform} from 'react-native';

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
 const onCheckType = (
  source: any,
  type: TypesBase,
): source is TypesBase => {
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

export {
  formatPhoneNumber,
  formatMoney,
  useDeepCompareEffect,
  randomUniqueId,
  useDisableBackHandler,
  onCheckType,
  isIos,
  useDismissKeyboard
}