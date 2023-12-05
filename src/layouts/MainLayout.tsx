import React, {FC, memo, ReactNode} from 'react';
import {
  ImageBackground,
  Keyboard,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from '@react-navigation/native';

const MainLayout: FC<Props> = ({
  children,
  style,
  imgBackground,
  dismissHiddenKeyBoard,
}) => {
  const insets = useSafeAreaInsets();
  const {colors} = useTheme();
  return (
    <>
      {imgBackground ? (
        <ImageBackground
          source={imgBackground}
          resizeMode={'cover'}
          style={{flex: 1, justifyContent: 'center'}}>
          <HiddenKeyboard>
            <View
              style={{
                flex: 1,
                paddingTop: insets.top,
                paddingHorizontal: 16,
                ...style,
              }}>
              {children}
            </View>
          </HiddenKeyboard>
        </ImageBackground>
      ) : dismissHiddenKeyBoard ? (
        <View
          style={{
            flex: 1,
            paddingTop: insets.top,
            paddingHorizontal: 16,
            backgroundColor: colors.bg_default,
            ...style,
          }}>
          {children}
        </View>
      ) : (
        <HiddenKeyboard>
          <View
            style={{
              flex: 1,
              paddingTop: insets.top,
              paddingHorizontal: 16,
              backgroundColor: colors.bg_default,
              ...style,
            }}>
            {children}
          </View>
        </HiddenKeyboard>
      )}
    </>
  );
};

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
