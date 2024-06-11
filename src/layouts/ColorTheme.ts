import {Colors} from '../assets';

export const ColorDefault = {
  primary: '#C4161C',
  secondary: '#8E33FF',
  info: '#00B8D9',
  success: '#22C55E',
  warning: '#FFAB00',
  error: '#FF5630',
  action: '#1877F2',
  divider: Colors.gray_200,
  border: Colors.gray_300,
  bg_default: Colors.white,
  bg_paper: Colors.white,
  bg_neutral: Colors.gray_200,
  bg_disable: Colors.gray_400,
  text_primary: Colors.gray_800,
  text_secondary: Colors.gray_600,
  text_disable: Colors.gray_500,
  background: Colors.white,
  card: Colors.white,
  text: Colors.gray_800,
  notification: '#C4161C',
  black: 'black',
  white: 'white',
  blue700: '#1976D2',
  green01: '#22C55E14',
  yellow_100: '#FFAB0014',
  main: 'rgba(0, 167, 111, 1)',
  backgroundSwitch: '#919EAB7A',
  orangeBackground:'rgba(255, 171, 0, 0.08)',
  purpleBackground:'#8E33FF14',
  blueBackground:'#1877F214',
  greenBackground:'#22C55E14',
  redBackground:'#FF563014',
  undoBackground:'#00B8D914',
  primaryBackground:'#C4161C14',
  facebook:'#1877F2'



};
export const ColorDark = {
  primary: '#881111',
  secondary: '#5119B7',
  info: '#006C9C',
  success: '#118D57',
  warning: '#B76E00',
  error: '#B71D18',
  action: '#1877F2',
  divider: Colors.darker,
  border: Colors.gray_600,
  bg_default: Colors.gray_800,
  bg_paper: Colors.gray_700,
  bg_neutral: Colors.gray_900,
  bg_disable: Colors.gray_600,
  text_primary: Colors.white,
  text_secondary: Colors.gray_500,
  text_disable: Colors.gray_600,
  background: Colors.gray_800,
  card: '#212B36',
  text: 'gray',
  notification: '#C4161C',
  black: 'black',
  white: 'white',
  blue700: '#1976D2',
  green01: '#22C55E14',
  yellow_100: '#FFAB0014',
  main: 'rgba(0, 167, 111, 1)',
  backgroundSwitch: '#919EAB7A',
  orangeBackground:'rgba(255, 171, 0, 0.08)',
  purpleBackground:'#8E33FF14',
  blueBackground:'#1877F214',
  greenBackground:'#22C55E14',
  redBackground:'#FF563014',
  undoBackground:'#00B8D914',
  primaryBackground:'#C4161C14',
  facebook:'#1877F2'

};

type ColorDefaultType = typeof ColorDefault;

export function getRandomColor(): ColorDefaultType[keyof ColorDefaultType] {
  const keys = Object.keys(ColorDefault) as (keyof ColorDefaultType)[];
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  return ColorDefault[randomKey];
}