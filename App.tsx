import {useEffect} from 'react';
import {registerTranslation} from 'react-native-paper-dates';
import './src/language';

import {
  BackHandler,
  KeyboardAvoidingView,
  LogBox,
  Platform,
  UIManager,
} from 'react-native';

import './src/language';

import {Provider} from 'react-redux';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import AppNavigationContainer from './src/navigation';
import HandlingLoading from './src/components/HandlingLoading';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import codePush from 'react-native-code-push';
import {store} from './src/redux-store/';
import {isIos} from './src/config/function';
import {PortalProvider} from './src/components/common/portal';
import React from 'react';
import ErrorBoundary from 'react-native-error-boundary';
import ErrorFallBack from './src/layouts/ErrorFallBack';
import {storage} from './src/utils/commom.utils';

let codePushOptions = {
  checkFrequency: codePush.CheckFrequency.MANUAL,
  rollbackRetryOptions: {
    delayInHours: 12,
    maxRetryAttempts: 2,
  },
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



  const errorHandler = (error: Error) => {
    storage.set('error', JSON.stringify(error));
  };

  return (
    <SafeAreaProvider>
      <ErrorBoundary FallbackComponent={ErrorFallBack} onError={errorHandler}>
        <Provider store={store}>
          <KeyboardAvoidingView
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{flex: 1}}>
            <GestureHandlerRootView style={{flex: 1}}>
              <PortalProvider>
                <AppNavigationContainer />
              </PortalProvider>
            </GestureHandlerRootView>
            <HandlingLoading />
          </KeyboardAvoidingView>
        </Provider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
  // return(
  //   <Block block middle >
  //       <AppText>Hello from the another side </AppText>
  //   </Block>
  // )
}

export default codePush(codePushOptions)(App);
