import React, {FC, useMemo} from 'react';
import { dispatch } from '../utils/redux';


import {AppDialog} from './common';
import {ApiConstant, ScreenConstant} from '../const';
import {useNavigation} from '@react-navigation/native';
import {NavigationProp} from '../navigation';
import {useTranslation} from 'react-i18next';
import { useSelector } from '../config/function';
import { appActions } from '../redux-store/app-reducer/reducer';

const HandlingError: FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const {t: getLabel} = useTranslation();

  const error = useSelector(state => state.app.error);
  const isShowModalError = useSelector(state => state.app.showModal);

  const open = useMemo(
    () =>
      Boolean(error) &&
      (isShowModalError ||
        error?.status === ApiConstant.STT_INTERNAL_SERVER ||
        error?.status === ApiConstant.STT_UNAUTHORIZED),
    [error, isShowModalError],
  );

  const msgError = useMemo(() => {
    if (error?.message) {
      switch (error?.status) {
        case ApiConstant.STT_INTERNAL_SERVER:
          return getLabel('serverErr');
        default:
          return error?.message;
      }
    } else {
      return getLabel('someThingErr');
    }
  }, [error]);

  const onSubmitDialog = () => {
    dispatch(appActions.setError(null));
    dispatch(appActions.setShowErrorModalStatus(true));
    if (error?.status === ApiConstant.STT_UNAUTHORIZED) {
      navigation.navigate(ScreenConstant.SIGN_IN, {});
    }
  };

  return (
    <>
      {Boolean(open) && (
        <AppDialog
          open={open}
          title={error?.title || ''}
          message={msgError}
          errorType
          showButton
          viewOnly={error?.viewOnly ?? true}
          onSubmit={onSubmitDialog}
          submitLabel={'OK'}
          modalType={{width: '80%'}}
        />
      )}
    </>
  );
};

export default HandlingError;
