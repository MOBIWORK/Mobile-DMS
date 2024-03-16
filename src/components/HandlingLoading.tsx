import React, {FC} from 'react';



import {AppLoading} from './common';
import { useSelector } from '../config/function';

const HandlingLoading: FC = () => {
  const isLoading = useSelector( state => state.app.isProcessing);

  return <>{Boolean(isLoading) && <AppLoading />}</>;
};

export default HandlingLoading;
