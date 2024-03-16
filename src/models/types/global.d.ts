import '@react-navigation/native';
declare module '@react-navigation/native' {
  export type ExtendedTheme = {
    dark: boolean;
    colors: {
      primary: string;
      secondary: string;
      info: string;
      success: string;
      warning: string;
      action: string;
      error: string;
      divider: string;
      border: string;
      bg_default: string;
      bg_paper: string;
      bg_neutral: string;
      bg_disable: string;
      text_primary: string;
      text_secondary: string;
      text_disable: string;
      main :string
    };
  };
  export type ColorSchema = ExtendedTheme
  export function useTheme(): ExtendedTheme;
}
