import {ExtendedTheme} from '@react-navigation/native';
import {Colors} from '../assets';

const AppLightTheme: ExtendedTheme = {
  dark: false,
  colors: {
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
    main : Colors.main
  },
};

export default AppLightTheme;
