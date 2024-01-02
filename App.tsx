import React, {useEffect} from 'react';
import 'react-native-gesture-handler';
import {registerTranslation} from 'react-native-paper-dates';

import './src/language';

import {
  BackHandler,
  KeyboardAvoidingView,
  LogBox,
  Platform,
  StatusBar,
} from 'react-native';

import 'react-native-gesture-handler';
import './src/language';

import {Provider} from 'react-redux';
import store from './src/redux-store';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import AppNavigationContainer from './src/navigation';
import HandlingError from './src/components/HandlingError';
import HandlingLoading from './src/components/HandlingLoading';
import {SnackBar} from './src/components/common/AppSnack';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {PortalProvider} from './src/components/common';
import {PortalHost} from './src/components/common/Portal/components/portal-host';

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
  // useEffect(() => {
  //   // /// 1.  Subscribe to events.
  //   // const onLocation: Subscription = BackgroundGeolocation.onLocation(
  //   //   location => {
  //   //     console.log('[onLocation]', location);
  //   //   },
  //   // );
  //   //
  //   // const onMotionChange: Subscription = BackgroundGeolocation.onMotionChange(
  //   //   (event) => {
  //   //     console.log("[onMotionChange]", event);
  //   //   }
  //   // );
  //   //
  //   // const onActivityChange: Subscription =
  //   //   BackgroundGeolocation.onActivityChange((event) => {
  //   //     console.log("[onActivityChange]", event);
  //   //   });
  //   //
  //   // const onProviderChange: Subscription =
  //   //   BackgroundGeolocation.onProviderChange((event) => {
  //   //     console.log("[onProviderChange]", event);
  //   //   });
  //
  //   // const onHttp: Subscription = BackgroundGeolocation.onHttp((httpEvent) => {
  //   //   console.log(httpEvent.responseText);
  //   //   console.log("[http] ", httpEvent.success, httpEvent.status);
  //   // });
  //
  //   /// 2. ready the plugin.
  //   BackgroundGeolocation.ready({
  //     // Geolocation Config
  //     desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
  //     distanceFilter: 10,
  //     // Activity Recognition
  //     stopTimeout: 5,
  //     // Application config
  //     debug: false, // <-- enable this hear sounds for background-geolocation life-cycle.
  //     logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
  //     stopOnTerminate: false, // <-- Allow the background-service to continue tracking when user closes the app.
  //     startOnBoot: true, // <-- Auto start tracking when device is powered-up.
  //     // HTTP / SQLite config
  //     // url: "https://api.ekgis.vn/tracking/locationHistory/position/64dae1bf20309bc61366a2b1?api_key=dCceCixTANM4zeayfXslpTNTcbONf9aBsDCFWxIs",
  //     // batchSync: true, // <-- [Default: false] Set true to sync locations to server in a single HTTP request.
  //     autoSync: true, // <-- [Default: true] Set true to sync each location to server as it arrives.
  //     autoSyncThreshold: 5,
  //     maxBatchSize: 50,
  //     locationsOrderDirection: 'DESC',
  //     maxDaysToPersist: 14,
  //     // headers: {
  //     //   // <-- Optional HTTP headers
  //     //   "X-FOO": "bar",
  //     // },
  //     // params: {
  //     //   // <-- Optional HTTP params
  //     //   auth_token: "maybe_your_server_authenticates_via_token_YES?",
  //     // },
  //   }).then(state => {
  //     console.log(
  //       '- BackgroundGeolocation is configured and ready: ',
  //       state.enabled,
  //     );
  //     BackgroundGeolocation.start();
  //   });
  //
  //   return () => {
  //     // Remove BackgroundGeolocation event-subscribers when the View is removed or refreshed
  //     // during development live-reload.  Without this, event-listeners will accumulate with
  //     // each refresh during live-reload.
  //     // onLocation.remove();
  //     // onMotionChange.remove();
  //     // onActivityChange.remove();
  //     // onProviderChange.remove();
  //     // onHttp.remove();
  //   };
  // }, []);

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <KeyboardAvoidingView
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{flex: 1}}>
          <GestureHandlerRootView style={{flex: 1}}>
            <PortalProvider>
              <AppNavigationContainer>
                <PortalHost name={'AppModal'} />
                <StatusBar backgroundColor={'#fff'} />
                <HandlingError />
                <SnackBar />
              </AppNavigationContainer>
            </PortalProvider>
          </GestureHandlerRootView>
          <HandlingLoading />
        </KeyboardAvoidingView>
      </SafeAreaProvider>
    </Provider>
  );
}

export default App;
