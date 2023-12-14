import React, {FC, memo, ReactNode} from 'react';
import {
  ImageBackground,
  Keyboard,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
  StyleSheet,
} from 'react-native';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme, ColorSchema} from '@react-navigation/native';

const MainLayout: FC<Props> = ({
  children,
  style,
  imgBackground,
  dismissHiddenKeyBoard,
}) => {
  const insets = useSafeAreaInsets();

  const theme = useTheme();
  return (
    <>
      {imgBackground ? (
        <ImageBackground
          source={imgBackground}
          resizeMode={'cover'}
          style={styles.root}>
          <HiddenKeyboard>
            <View
              style={[
                styles.firstCase(insets),
                {
                  ...style,
                },
              ]}>
              {children}
            </View>
          </HiddenKeyboard>
        </ImageBackground>
      ) : dismissHiddenKeyBoard ? (
        <View style={[styles.thirdCaseView(theme, insets), {...style}]}>
          {children}
        </View>
      ) : (
        <HiddenKeyboard>
          <View style={[styles.thirdCaseView(theme, insets), {...style}]}>
            {children}
          </View>
        </HiddenKeyboard>
      )}
    </>
  );
};
const styles = StyleSheet.create({
  thirdCaseView: (colors: ColorSchema, insets: EdgeInsets) => ({
    flex: 1,
    paddingTop: insets.top,
    paddingHorizontal: 16,
    backgroundColor: colors.colors.bg_default,
  }),
  root: {
    flex: 1,
    justifyContent: 'center',
  } as ViewStyle,
  firstCase: (insets: EdgeInsets) => ({
    flex: 1,
    paddingTop: insets.top,
    paddingHorizontal: 16,
  }),
});

const HiddenKeyboard: FC<HiddenKeyboardProp> = ({children}) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

interface HiddenKeyboardProp {
  children: JSX.Element;
}

interface Props {
  children: ReactNode;
  style?: ViewStyle;
  dismissHiddenKeyBoard?: boolean;
  imgBackground?: any;
}

export default memo(MainLayout);
