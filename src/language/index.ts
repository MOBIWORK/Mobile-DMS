import i18next from 'i18next';
import {initReactI18next} from 'react-i18next';
import {LangConstant} from '../const';

import enLang from './resources/en';
import viLang from './resources/vi';

i18next.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  interpolation: {
    // React already does escaping
    escapeValue: false,
  },
  lng: LangConstant.DEFAULT_LANG_CODE,
  resources: {
    en: enLang,
    vi: viLang,
  },
  defaultNS: LangConstant.NS_COMMON,
  fallbackNS: LangConstant.NS_COMMON,
});

export default i18next;

export const getLabel = (key: string, otp = {}) =>
  i18next.getFixedT(i18next.language)(key, otp);

export const getLabelWithNS = (ns: string, key: string, otp = {}) =>
  i18next.getFixedT(i18next.language, ns)(key, otp);
