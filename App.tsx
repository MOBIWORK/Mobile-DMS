import React, {useEffect} from 'react';
import 'react-native-gesture-handler';
import './src/language';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import BackgroundGeolocation, {
  Subscription,
} from 'react-native-background-geolocation';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    // /// 1.  Subscribe to events.
    const onLocation: Subscription = BackgroundGeolocation.onLocation(
      location => {
        console.log('[onLocation]', location);
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

    // const onHttp: Subscription = BackgroundGeolocation.onHttp((httpEvent) => {
    //   console.log(httpEvent.responseText);
    //   console.log("[http] ", httpEvent.success, httpEvent.status);
    // });

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
      // url: "https://api.ekgis.vn/tracking/locationHistory/position/64dae1bf20309bc61366a2b1?api_key=dCceCixTANM4zeayfXslpTNTcbONf9aBsDCFWxIs",
      // batchSync: true, // <-- [Default: false] Set true to sync locations to server in a single HTTP request.
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
      onLocation.remove();
      // onMotionChange.remove();
      // onActivityChange.remove();
      // onProviderChange.remove();
      // onHttp.remove();
    };
  }, []);

  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="Step One">
            Edit <Text style={styles.highlight}>App.tsx</Text> to change this
            screen and then come back to see your edits.
          </Section>
          <Section title="See Your Changes">
            <ReloadInstructions />
          </Section>
          <Section title="Debug">
            <DebugInstructions />
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>
          <LearnMoreLinks />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
