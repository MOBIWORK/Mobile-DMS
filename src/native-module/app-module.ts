import {useEffect} from 'react';
import {
  EmitterSubscription,
  NativeEventEmitter,
  NativeModules,
} from 'react-native';
import {isIos, hexStringFromCSSColor} from '../config/function';
import {MMKV} from 'react-native-mmkv';

const {AppModule} = NativeModules;
const storage = new MMKV();
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
    const res = await storage.set(key, value);
    return res;
  },
  setNumber: async (key: string, value: number) => {
    const res = await storage.set(key, value);
    return res;
  },
  setBoolean: async (key: string, value: boolean) => {
    const res = await storage.set(key, value);
    return res;
  },
  getString: async (key: string) => {
    const res: string | any = await storage.getString(key);
    return res;
  },
  getNumber: async (key: string) => {
    const res: number | any = await storage.getNumber(key);
    return res;
  },
  getBoolean: async (key: string) => {
    const res: boolean | any = await storage.getBoolean(key);
    return res;
  },
  getAllKeys: async () => {
    const res: Array<string> = await storage.getAllKeys();
    return res;
  },
  clearAll: async () => {
    const res: void = await storage.clearAll();
    return res;
  },
  delete: async (key: string) => {
    const res: void = await storage.delete(key);
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
