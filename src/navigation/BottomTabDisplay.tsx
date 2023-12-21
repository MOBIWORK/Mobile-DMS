import {
  StyleSheet,
  Text,
  View,
  Platform,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
  ImageStyle,
} from 'react-native';
import React, {createRef} from 'react';
import {useTranslation} from 'react-i18next';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import {
  NavigationContainerRef,
} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {RootStackParamList} from '.';
import {ScreenConstant} from '../const';
import AppImage from '../components/common/AppImage';
import { AppTheme,useTheme } from '../layouts/theme';
import { useSelector } from 'react-redux';
import { AppSelector } from '../redux-store';

const BottomTabDisplay = (props: BottomTabBarProps) => {
  const {state, navigation} = props;
  const theme = useTheme();
  const {t: getLabel} = useTranslation();
  const styles = bottomStyles(theme);
  const navigationRef = createRef<NavigationContainerRef<RootStackParamList>>();
  const showModal = useSelector(AppSelector.getShowModal)
  const pressNavigator = React.useCallback(
    (curTab: any) => {
      const previousRouteName = navigationRef?.current?.getCurrentRoute()?.name;
      const currentRouteName = state.routes[curTab].name;
      if (curTab === 0 || curTab === 1 || curTab === 2) {
        navigation.emit({
          type: 'tabPress',
          target: state.routes[curTab].name,
          canPreventDefault: true,
        });
        navigation.navigate(state.routes[curTab].name);
        if (curTab === 0) {
          if (previousRouteName != currentRouteName) {
            navigation.navigate(ScreenConstant.HOME_SCREEN);
          }
        }
      } else {
        navigation.navigate(ScreenConstant.LOOKING_MORE);
      }
    },
    [navigation, state],
  );


  return (
    <SafeAreaView edges={['right', 'left', 'bottom']} style={showModal ? styles.container :{}}>
      {showModal && 
      <>
      <TouchableOpacity style={styles.item} onPress={() => pressNavigator(0)}>
        <View pointerEvents="none">
          {state.index === 0 ? (
            <AppImage source="IconHomeActive" style={styles.iconStyle} />
          ) : (
            <AppImage source="IconHome" style={styles.iconStyle} />
          )}
        </View>
        <Text style={styles.txtItem(state.index, 0)}>{getLabel('home')}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.item} onPress={() => pressNavigator(1)}>
        <View pointerEvents="none">
          {state.index === 1 ? (
            <AppImage source="IconVisitActive" style={styles.iconStyle} />
          ) : (
            <AppImage source="IconVisit" style={styles.iconStyle} />
          )}
        </View>
        <Text style={styles.txtItem(state.index, 1)}>{getLabel('visit')}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.item} onPress={() => pressNavigator(2)}>
        <View pointerEvents="none">
          {state.index === 2 ? (
            <AppImage source="IconCustomerActive" style={styles.iconStyle} />
          ) : (
            <AppImage source="IconCustomer" style={styles.iconStyle} />
          )}
        </View>
        <Text style={styles.txtItem(state.index, 2)}>
          {getLabel('customer')}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.item} onPress={() => pressNavigator(3)}>
        <View pointerEvents="none">
          {state.index === 3 ? (
            <AppImage source="IconLookingMoreActive" style={styles.iconStyle} />
          ) : (
            <AppImage source="IconLookingMore" style={styles.iconStyle} />
          )}
        </View>
        <Text style={styles.txtItem(state.index, 3)}>
          {getLabel('lookingMore')}
        </Text>
      </TouchableOpacity>
      </>
}
    </SafeAreaView>
  );
};

export default BottomTabDisplay;

const bottomStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.white,
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-around',
      paddingHorizontal: 10,
      borderTopLeftRadius: 26,
      borderTopRightRadius: 26,

      paddingVertical: 20,
      width: '100%',
      ...Platform.select({
        android: {
          elevation: 12,
          borderTopColor: theme.colors.bg_neutral,
          borderTopWidth: 2,
          shadowColor: theme.colors.action,
        },
        ios: {
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 1,
          },
          elevation: 10,
          shadowOpacity: 0.225,
          shadowRadius: 5.56,
        },
      }),
    } as ViewStyle,
    item: {
      alignItems: 'center',
      justifyContent: 'center',
      width: '20%',
    } as ViewStyle,
    txtItem: (index: number, curIndex: number) =>
      ({
        color: index === curIndex ? theme.colors.primary : theme.colors.text_secondary,
        textAlign: 'center',
        fontSize: 10,
      } as TextStyle),
    itemIndicator: {
      height: 3,
      width: '100%',
      // marginBottom: 10,
      borderBottomLeftRadius: 15,
      borderBottomRightRadius: 15,
    } as ViewStyle,
    iconStyle: {
      width: 29,
      height: 29,
    } as ImageStyle,
  });