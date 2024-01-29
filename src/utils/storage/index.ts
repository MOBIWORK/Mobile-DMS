/* eslint-disable @typescript-eslint/no-explicit-any */

import { AppModule } from '../../native-module';



/**
 * Loads a string from storage.
 *
 * @param key The key to fetch.
 */
export async function loadString(key: string, option?: AppModule.MMKVOption) {
  try {
    return await AppModule.MMKVStorage.getString(
      key,

    );
  } catch {
    return null;
  }
}

/**
 * Saves a string to storage.
 *
 * @param key The key to fetch.
 * @param value The value to store.
 */
export async function saveString(
  key: string,
  value: string,
) {
  try {
    await AppModule.MMKVStorage.setString(
      key,
      value,
    );
    return true;
  } catch {
    return false;
  }
}

/**
 * Loads something from storage and runs it thru JSON.parse.
 *
 * @param key The key to fetch.
 */
export async function load(key: string, option?: AppModule.MMKVOption) {
  try {
    const almostThere = await AppModule.MMKVStorage.getString(
      key,

    );
    return typeof almostThere === 'string' ? JSON.parse(almostThere) : null;
  } catch {
    return null;
  }
}

/**
 * Saves an object to storage.
 *
 * @param key The key to fetch.
 * @param value The value to store.
 */
export async function save(
  key: string,
  value: any,
  option?: AppModule.MMKVOption,
) {
  try {
    await AppModule.MMKVStorage.setString(
      key,
      JSON.stringify(value),
      // StyleSheet.flatten([ option]),
    );
    return true;
  } catch {
    return false;
  }
}

/**
 * Removes something from storage.
 *
 * @param key The key to kill.
 */
export async function remove(key: string, option?: AppModule.MMKVOption) {
  try {
    await AppModule.MMKVStorage.delete(
      key,
    );
  } catch {}
}

interface Storage {
  getItem(key: string, ...args: Array<any>): any;
  setItem(key: string, value: any, ...args: Array<any>): any;
  removeItem(key: string, ...args: Array<any>): any;
}
export const reduxPersistStorage: Storage = {
  setItem: async (key: string, value: string | number | boolean) => {
    if (typeof value === 'string') {
      await AppModule.MMKVStorage.setString(key, value);
    }
    if (typeof value === 'boolean') {
      await AppModule.MMKVStorage.setBoolean(key, value);
    }
    if (typeof value === 'number') {
      await AppModule.MMKVStorage.setNumber(key, value);
    }
    return Promise.resolve(true);
  },
  getItem: async (key: string) => {
    const res = await AppModule.MMKVStorage.getString(key);
    return Promise.resolve(res);
  },
  removeItem: async (key: string) => {
    await AppModule.MMKVStorage.delete(key);
    return Promise.resolve();
  },
};
