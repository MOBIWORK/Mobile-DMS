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
import {AppModule} from './src/native-module';

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

  const [updateMessage, setUpdateMessage] = React.useState('');
  const [updateStatus, setUpdateStatus] = React.useState(-1);


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
  const onSyncStatusChanged = React.useCallback((syncStatus: number) => {
    console.log('syncStatus', syncStatus);
    switch (syncStatus) {
      case codePush.SyncStatus.CHECKING_FOR_UPDATE: {
        setUpdateMessage('Đang kiểm tra bản cập nhật...');
        break;
      }
      case codePush.SyncStatus.DOWNLOADING_PACKAGE: {
        setUpdateMessage('Đang tải xuống bản cập nhật...');
        break;
      }
      case codePush.SyncStatus.INSTALLING_UPDATE: {
        setUpdateMessage('Đang cài đặt bản cập nhật...');
        break;
      }
      case codePush.SyncStatus.UPDATE_INSTALLED: {
        codePush.notifyAppReady();
        setUpdateMessage('Hoàn tất cập nhật. Xin vui lòng đợi trong giây lát!');
        break;
      }
      case codePush.SyncStatus.UNKNOWN_ERROR: {
        setUpdateMessage('Cập nhật thất bại!');
      
        setTimeout(() => {
          codePush.restartApp();
        }, 800);
        break;
      }
      case codePush.SyncStatus.UP_TO_DATE: {
        // codePush.notifyAppReady();
        // setTimeout(() => {
          codePush.restartApp();
        // }, 800);
        break;
      }
      default: {
        break;
      }
    }
    setUpdateStatus(syncStatus);
  }, []);


  useEffect(() =>{
    codePush.sync({
      updateDialog:{
        appendReleaseDescription:true,
        
      }, 
      
      installMode: codePush.InstallMode.ON_NEXT_RESTART,
      mandatoryInstallMode: codePush.InstallMode.ON_NEXT_RESTART,
      
     
  },
  onSyncStatusChanged
  );
  },[onSyncStatusChanged])


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
            <AppNavigationContainer>
              <StatusBar backgroundColor={'#fff'} />
              <HandlingError />
              <SnackBar />
            </AppNavigationContainer>
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
