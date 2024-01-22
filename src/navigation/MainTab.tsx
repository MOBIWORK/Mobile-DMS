import React, {useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {ScreenConstant} from '../const';
import {Customer, Home, Visits, WidgetScreen} from '../screens';
import BottomTabDisplay from './BottomTabDisplay';
import BackgroundGeolocation, {
  Subscription,
} from 'react-native-background-geolocation';

export type TabParamList = {
  [ScreenConstant.HOME_SCREEN]: undefined;
  [ScreenConstant.VISIT]: undefined;
  [ScreenConstant.CUSTOMER]: undefined;
  [ScreenConstant.WIDGET_SCREEN]: undefined;
};

const Tab = createBottomTabNavigator();

const MainTab = () => {
  //background-geolocation
  useEffect(() => {
    // /// 1.  Subscribe to events.
    // const onLocation: Subscription = BackgroundGeolocation.onLocation(
    //   location => {
    //     console.log('[onLocation]', location);
    //   },
    // );
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
      logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
      stopOnTerminate: false, // <-- Allow the background-service to continue tracking when user closes the app.
      startOnBoot: true, // <-- Auto start tracking when device is powered-up.
      // HTTP / SQLite config
      url: 'https://api.ekgis.vn/tracking/locationHistory/position/64dae1bf20309bc61366a2b1?api_key=dCceCixTANM4zeayfXslpTNTcbONf9aBsDCFWxIs',
      batchSync: true, // <-- [Default: false] Set true to sync locations to server in a single HTTP request.
      autoSync: true, // <-- [Default: true] Set true to sync each location to server as it arrives.
      autoSyncThreshold: 5,
      maxBatchSize: 50,
      locationsOrderDirection: 'DESC',
      maxDaysToPersist: 14,
      // headers: {
      //   // <-- Optional HTTP headers
      //   "X-FOO": "bar",
      // },
      // params: {
      //   // <-- Optional HTTP params
      //   auth_token: "maybe_your_server_authenticates_via_token_YES?",
      // },
    }).then(state => {
      console.log(
        '- BackgroundGeolocation is configured and ready: ',
        state.enabled,
      );
      BackgroundGeolocation.start();
    });

    return () => {
      // Remove BackgroundGeolocation event-subscribers when the View is removed or refreshed
      // during development live-reload.  Without this, event-listeners will accumulate with
      // each refresh during live-reload.
      // onLocation.remove();
      // onMotionChange.remove();
      // onActivityChange.remove();
      // onProviderChange.remove();
      onHttp.remove();
    };
  }, []);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={props => <BottomTabDisplay {...props} />}>
      <Tab.Screen name={ScreenConstant.HOME_SCREEN} component={Home} />
      <Tab.Screen name={ScreenConstant.VISIT} component={Visits} />
      <Tab.Screen name={ScreenConstant.CUSTOMER} component={Customer} />
      <Tab.Screen
        name={ScreenConstant.WIDGET_SCREEN}
        component={WidgetScreen}
      />
    </Tab.Navigator>
  );
};
export default MainTab;
