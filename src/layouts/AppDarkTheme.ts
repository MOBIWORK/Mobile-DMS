import {ExtendedTheme} from '@react-navigation/native';
import {Colors} from '../assets';

const AppDarkTheme: ExtendedTheme = {
  dark: true,
  colors: {
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
    main : Colors.main

  },
};

export default AppDarkTheme;
