import React, {useEffect} from 'react';
import {registerTranslation} from 'react-native-paper-dates';

import './src/language';

import {
  BackHandler,
  KeyboardAvoidingView,
  LogBox,
  Platform,
  StatusBar,
  UIManager,
} from 'react-native';

import 'react-native-gesture-handler';
import './src/language';

import {Provider} from 'react-redux';

import {GestureHandlerRootView} from 'react-native-gesture-handler';
import AppNavigationContainer from './src/navigation';
import HandlingError from './src/components/HandlingError';
import HandlingLoading from './src/components/HandlingLoading';
import {SnackBar} from './src/components/common/AppSnack';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import codePush from 'react-native-code-push';
import {store} from './src/redux-store/';
import {isIos} from './src/config/function';
import {PortalProvider} from './src/components/common/portal';

let codePushOptions = {
  checkFrequency: codePush.CheckFrequency.ON_APP_START,
  installMode: codePush.InstallMode.IMMEDIATE,
};

if (!isIos) {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}
function App(): JSX.Element {
  useEffect(() => {
    LogBox.ignoreAllLogs();
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true,
    );
    return () => backHandler.remove();
  }, []);

  registerTranslation('vi', {
    save: 'Lưu',
    selectSingle: 'Chọn ngày',
    selectMultiple: 'Chọn nhiều ngày',
    selectRange: 'Chọn khoảng thời gian',
    notAccordingToDateFormat: inputFormat =>
      `Ngày tháng được chọn phải có dạng ${inputFormat}`,
    mustBeHigherThan: date => `Phải sau thời điểm ${date}`,
    mustBeLowerThan: date => `Phải trước thời điểm ${date}`,
    mustBeBetween: (startDate, endDate) =>
      `Phải nằm giữa khoảng ${startDate} - ${endDate}`,
    dateIsDisabled: 'Ngày tháng được chọn không phù hợp',
    previous: 'Trước',
    next: 'Sau',
    typeInDate: 'Điền ngày tháng',
    pickDateFromCalendar: 'Chọn ngày tháng ',
    close: 'Đóng',
  });

  // Alert.alert(updateMessage)

  // Alert.alert(updateMessage)

  // Alert.alert(updateMessage)

  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <KeyboardAvoidingView
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{flex: 1}}>
          <GestureHandlerRootView style={{flex: 1}}>
            <PortalProvider>
              <AppNavigationContainer>
                <StatusBar backgroundColor={'#fff'} />
                <HandlingError />
                <SnackBar />
              </AppNavigationContainer>
            </PortalProvider>
          </GestureHandlerRootView>
          <HandlingLoading />
        </KeyboardAvoidingView>
      </Provider>
    </SafeAreaProvider>
  );
  // return(
  //   <Block block middle >
  //       <AppText>Hello from the another side </AppText>
  //   </Block>
  // )
}

export default codePush(codePushOptions)(App);
