import {StyleSheet} from 'react-native';
import {FontDefault} from '../../layouts/AppTypoGraphy';
import {sizeScale} from '../../utils/commom.utils';
import {BG_SUCCESS} from '../../const/app.const';
export const textPresets = StyleSheet.create({
  linkTitle: {
    fontFamily: FontDefault.primary,
    fontSize: sizeScale(24),
    lineHeight: 32,
    fontWeight: '600',
    color: '#000000',
  },
  linkSubtitle: {
    fontFamily: FontDefault.primary,
    fontSize: sizeScale(20),
    lineHeight: 32,
    fontWeight: '600',
    color: '#000000',
  },
  linkLarge: {
    fontFamily: FontDefault.primary,
    fontSize: sizeScale(18),
    lineHeight: 34,
    fontWeight: '600',
    color: '#000000',
  },
  linkMedium: {
    fontFamily: FontDefault.primary,
    fontSize: sizeScale(16),
    lineHeight: 30,
    fontWeight: '600',
    color: '#000000',
  },
  linkSmall: {
    fontFamily: FontDefault.primary,
    fontSize: sizeScale(14),
    lineHeight: 20,
    fontWeight: '600',
    color: '#000000',
  },
  linkXSmall: {
    fontFamily: FontDefault.primary,
    fontSize: sizeScale(11),
    lineHeight: 20,
    fontWeight: '600',
    color: '#000000',
  },
  linkXXSmall: {
    fontFamily: FontDefault.primary,
    fontSize: sizeScale(9),
    lineHeight: 20,
    fontWeight: '600',
    color: '#000000',
  },
  textMedium: {
    fontFamily: FontDefault.secondary,
    fontSize: sizeScale(16),
    lineHeight: 30,
    fontWeight: 'normal',
    color: '#000000',
  },
  textSmall: {
    fontFamily: FontDefault.secondary,
    fontSize: sizeScale(14),
    lineHeight: 20,
    fontWeight: 'normal',
    color: '#000000',
  },
  textXSmall: {
    fontFamily: FontDefault.secondary,
    fontSize: sizeScale(11),
    lineHeight: 20,
    fontWeight: 'normal',
    color: '#000000',
  },
  textXXSmall: {
    fontFamily: FontDefault.secondary,
    fontSize: sizeScale(9),
    lineHeight: 20,
    fontWeight: 'normal',
    color: '#000000',
  },
  default: {},
});

export type TextPresetNames = keyof typeof textPresets;

export const snackStyle = StyleSheet.create({
  container: {
    minHeight: 100,
    paddingHorizontal: 15,
  },
  itemBar: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 5,
    backgroundColor: '#ffffff',
    position: 'absolute',
    width: '100%',
    alignSelf: 'center',
    marginHorizontal: 50,
    alignItems: 'center',
    flexDirection: 'row',
    borderLeftWidth: 40,
    borderLeftColor: BG_SUCCESS,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,

    elevation: 1,
  },
  text: {
    flex: 1,
  },
});
