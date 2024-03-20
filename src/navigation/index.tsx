import React, {FC} from 'react';

import {NavigationContainer} from '@react-navigation/native';

import {MyAppTheme} from '../layouts/theme';

import linking from '../utils/linking.utils';
import {useSelector} from '../config/function';
import {RXStore} from '../utils/redux';
import {PortalHost} from '../components/common/portal';
import {StatusBar} from 'react-native';
import {navigationRef} from './navigation-service';

import RootNavigation from './root-navigation';
import HandlingError from '../components/HandlingError';

const AppNavigationContainer: FC<AppNavigationContainerProps> = ({}) => {
  const theme = useSelector(state => state.app.theme);

  return (
    <NavigationContainer
      theme={MyAppTheme[theme]}
      linking={linking}
      ref={navigationRef}>
      <StatusBar backgroundColor={'transparent'} translucent />
      <>
        <RootNavigation />
        <HandlingError />
        <PortalHost name={'Bottom-Sheet'} />
      </>
      <RXStore />
    </NavigationContainer>
  );
};

interface AppNavigationContainerProps {
  children?: any;
}

export default AppNavigationContainer;
