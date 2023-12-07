import React, {FC} from 'react';
import {useSelector} from 'react-redux';
import {AppSelector} from '../redux-store';

import {AppLoading} from './common';

const HandlingLoading: FC = () => {
  const isLoading = useSelector(AppSelector.getProcessingStatus);

  return <>{Boolean(isLoading) && <AppLoading />}</>;
};

export default HandlingLoading;
