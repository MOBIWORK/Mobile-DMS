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

import './src/language';

import {Provider} from 'react-redux';

import {GestureHandlerRootView} from 'react-native-gesture-handler';
import AppNavigationContainer from './src/navigation';
import HandlingLoading from './src/components/HandlingLoading';
import {SnackBar} from './src/components/common/AppSnack';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import codePush from 'react-native-code-push';
import {store} from './src/redux-store/';
import {isIos} from './src/config/function';
import {PortalProvider} from './src/components/common/portal';
import BackgroundGeolocation, {
  Subscription,
} from 'react-native-background-geolocation';
import RNInstalledApplication from 'react-native-installed-application';
import {AppService} from './src/services';

let codePushOptions = {
  checkFrequency: codePush.CheckFrequency.ON_APP_START,
  installMode: codePush.InstallMode.ON_NEXT_RESTART,
};

if (!isIos) {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}
function App(): JSX.Element {
  const [enable, setEnable] = React.useState<boolean>(false);

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

  //background-geolocation
  useEffect(() => {
    // /// 1.  Subscribe to events.
    const onLocation: Subscription = BackgroundGeolocation.onLocation(
      location => {
        if (Platform.OS === 'android' && location.mock) {
          RNInstalledApplication.getApps()
            .then((apps: any) => {
              const allListAppName = apps.map((item: any) => item.appName);
              const filter = 'com';
              // const listName = alllistAppName.filter((item: any) => {
              //   return item.test(filter);
              // });
              const listName = allListAppName.filter(function (str: string) {
                return str.indexOf(filter) === -1;
              });
              AppService.addFakeGPS({
                datetime_fake: new Date().getTime(),
                location_fake: {
                  lat: location.coords.latitude,
                  long: location.coords.longitude,
                },
                list_app: JSON.stringify(listName),
              });
            })
            .catch((error: any) => {
              console.log(error);
            });
        }
      },
    );
    //
    // const onMotionChange: Subscription = BackgroundGeolocation.onMotionChange(
    //   (event) => {
    //     console.log("[onMotionChange]", event);
    //   }
    // );
    //
    // const onActivityChange: Subscription =
    //   BackgroundGeolocation.onActivityChange((event) => {
    //     console.log("[onActivityChange]", event);
    //   });
    //
    // const onProviderChange: Subscription =
    //   BackgroundGeolocation.onProviderChange((event) => {
    //     console.log("[onProviderChange]", event);
    //   });

    const onHttp: Subscription = BackgroundGeolocation.onHttp(httpEvent => {
      console.log(httpEvent.responseText);
      console.log('[http] ', httpEvent.success, httpEvent.status);
    });

    /// 2. ready the plugin.
    BackgroundGeolocation.ready({
      // Geolocation Config
      desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
      distanceFilter: 10,
      // Activity Recognition
      stopTimeout: 5,
      // Application config
      debug: false, // <-- enable this hear sounds for background-geolocation life-cycle.
      stopOnTerminate: true, // <-- Allow the background-service to continue tracking when user closes the app.
      startOnBoot: false, // <-- Auto start tracking when device is powered-up.
      locationAuthorizationRequest: 'WhenInUse',
      // url: 'https://api.ekgis.vn/tracking/locationHistory/position/64dae1bf20309bc61366a2b1?api_key=dCceCixTANM4zeayfXslpTNTcbONf9aBsDCFWxIs',
      // autoSyncThreshold: 5,
      // maxBatchSize: 50,
      // locationsOrderDirection: 'DESC',
      // maxDaysToPersist: 14,
      // params: {
      //   projectId: '12333',
      //   objectId: '21111',
      // },
    }).then(state => {
      // setEnable(state.enabled);
      BackgroundGeolocation.start();
    });

    return () => {
      // Remove BackgroundGeolocation event-subscribers when the View is removed or refreshed
      // during development live-reload.  Without this, event-listeners will accumulate with
      // each refresh during live-reload.
      onLocation.remove();
      // onMotionChange.remove();
      // onActivityChange.remove();
      // onProviderChange.remove();
      onHttp.remove();
    };
  }, []);

  // useEffect(() => {
  //   if (enable) {
  //     BackgroundGeolocation.start();
  //   } else {
  //     BackgroundGeolocation.stop();
  //   }
  // }, [enable]);

  return (
    <SafeAreaProvider>
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
    </SafeAreaProvider>
  );
  // return(
  //   <Block block middle >
  //       <AppText>Hello from the another side </AppText>
  //   </Block>
  // )
}

export default codePush(codePushOptions)(App);
