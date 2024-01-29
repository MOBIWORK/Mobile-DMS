import {useEffect} from 'react';
import {
  EmitterSubscription,
  NativeEventEmitter,
  NativeModules,
} from 'react-native';
import {isIos, hexStringFromCSSColor} from '../config/function';
import {storage} from '../utils/commom.utils';

const {AppModule} = NativeModules;

export const getVersion = (): string => {
  return AppModule.getVersion();
};
export const getAppName = (): string => {
  return AppModule.getAppName();
};
export const getDeviceId = (): string => {
  return AppModule.getDeviceId();
};
export const setAppBadges = (count: number) => {
  if (typeof count !== 'number' || !isIos) {
    return;
  }
  AppModule.setBadges(count);
};

export const clearCache = () => {
  AppModule.clearCache();
};

export const getBuildNumber = (): string => {
  return AppModule.getBuildNumber();
};
export const registerPhotosChanges = () => {
  if (isIos) {
    AppModule.registerPhotosChanges();
  }
};

export const usePhotosPermissionChange = (callback: () => void) => {
  // effect
  useEffect(() => {
    let photosChangeEvent: NativeEventEmitter,
      subscription: EmitterSubscription;
    if (isIos) {
      photosChangeEvent = new NativeEventEmitter(AppModule);
      subscription = photosChangeEvent.addListener('PhotosChange', callback);
    }
    return () => {
      if (isIos) {
        photosChangeEvent.removeSubscription(subscription);
      }
    };
  }, [callback]);

  return null;
};
export type MMKVOption = {
  id: string;
  cryptKey: string;
};
export const MMKVStorage = {
  setString: async (key: string, value: string) => {
    storage.set(key, value);
  },
  setNumber: async (key: string, value: number, option?: MMKVOption) => {
    const res: boolean = await AppModule.mmkvSetNumber(
      key,
      value,
      option?.id ?? undefined,
      option?.cryptKey ?? undefined,
    );
    return res;
  },
  setBoolean: async (key: string, value: boolean, option?: MMKVOption) => {
    const res: boolean = await AppModule.mmkvSetBoolean(
      key,
      value,
      option?.id ?? undefined,
      option?.cryptKey ?? undefined,
    );
    return res;
  },
  getString: async (key: string) => {
    return storage.getString(key);
  },
  getNumber: async (key: string, option?: MMKVOption) => {
    const res: number = await AppModule.mmkvGetNumber(
      key,
      option?.id ?? undefined,
      option?.cryptKey ?? undefined,
    );
    return res;
  },
  getBoolean: async (key: string, option?: MMKVOption) => {
    const res: boolean = await AppModule.mmkvGetBoolean(
      key,
      option?.id ?? undefined,
      option?.cryptKey ?? undefined,
    );
    return res;
  },
  getAllKeys: async (option?: MMKVOption) => {
    const res: Array<string> = await AppModule.mmkvGetAllKeys(
      option?.id ?? undefined,
      option?.cryptKey ?? undefined,
    );
    return res;
  },
  clearAll: async (option?: MMKVOption) => {
    const res: Array<string> = await AppModule.mmkvClearAll(
      option?.id ?? undefined,
      option?.cryptKey ?? undefined,
    );
    return res;
  },
  delete: async (key: string, option?: MMKVOption) => {
    const res: boolean = await AppModule.mmkvDelete(
      key,
      option?.id ?? undefined,
      option?.cryptKey ?? undefined,
    );
    return res;
  },
};

export const setEnableIQKeyboard = (enable: boolean) => {
  if (!isIos) {
    return;
  }
  AppModule.setIQKeyboardOption({enable});
};

export const setIQKeyboardOption = (options: {
  enable?: boolean;
  layoutIfNeededOnUpdate?: boolean;
  enableDebugging?: boolean;
  keyboardDistanceFromTextField?: number;
  enableAutoToolbar?: boolean;
  toolbarDoneBarButtonItemText?: string;
  toolbarManageBehaviourBy?: 'subviews' | 'tag' | 'position';
  toolbarPreviousNextButtonEnable?: boolean;
  toolbarTintColor?: string;
  toolbarBarTintColor?: string;
  shouldShowToolbarPlaceholder?: boolean;
  overrideKeyboardAppearance?: boolean;
  keyboardAppearance?: 'default' | 'light' | 'dark';
  shouldResignOnTouchOutside?: boolean;
  shouldPlayInputClicks?: boolean;
  resignFirstResponder?: boolean;
  reloadLayoutIfNeeded?: boolean;
}) => {
  if (!isIos) {
    return;
  }
  const actualOption = {...options};
  if (options.toolbarBarTintColor) {
    actualOption.toolbarBarTintColor = hexStringFromCSSColor(
      options.toolbarBarTintColor,
    );
  }
  if (options.toolbarTintColor) {
    actualOption.toolbarTintColor = hexStringFromCSSColor(
      options.toolbarTintColor,
    );
  }
  AppModule.setIQKeyboardOption(actualOption);
};
