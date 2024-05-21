import React, {useState, useEffect, memo} from 'react';
import {Text, View, StyleSheet, Image, ViewStyle} from 'react-native';
import {BarCodeScanner} from 'expo-barcode-scanner';
import {AppDialog, AppHeader} from '../../../components/common';
import {useNavigation, useTheme} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ImageAssets} from '../../../assets';
import {AppConstant} from '../../../const';
import {useTranslation} from 'react-i18next';
import {CommonUtils} from '../../../utils';
import {useDispatch} from 'react-redux';
import {NavigationProp} from '../../../navigation/screen-type';
import {appActions} from '../../../redux-store/app-reducer/reducer';

const Scanner = () => {
  const navigation = useNavigation<NavigationProp>();
  const {t: getLabel} = useTranslation();
  const {colors} = useTheme();
  const dispatch = useDispatch();
  const {top: topSafeArea} = useSafeAreaInsets();

  const [hasPermission, setHasPermission] = useState<any>(null);
  const [scanned, setScanned] = useState(false);
  const [openErr, setOpenErr] = useState(false);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const {status} = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  // @ts-ignore
  const handleBarCodeScanned = ({data}) => {
    setScanned(true);
    console.log('dataaa', data);
    // onGetScanner(data);
  };

  const onGetScanner = async (data: string) => {
    dispatch(appActions.setProcessingStatus(true));
    await CommonUtils.CheckNetworkState();
    // const response: KeyAbleProps = await AppService.verifyOrganization({
    //   organization: data,
    // });
    // if (response.status === ApiConstant.STT_OK) {
    //   const {result} = response.data;
    //   setOrganization(result);
    //   dispatch(AppActions.setShowErrorModalStatus(true));
    //   navigation.navigate(ScreenConstant.SIGN_IN, {
    //     organizationName: data,
    //   });
    // } else {
    //   setOpenErr(true);
    // }
    dispatch(appActions.setProcessingStatus(false));
  };

  return (
    <View style={[styles.container, {backgroundColor: 'black'}]}>
      {hasPermission && (
        <BarCodeScanner
          barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      )}
      <AppHeader
        style={{
          flex: 0.5,
          marginTop: topSafeArea,
          marginHorizontal: 16,
        }}
        onBack={() => navigation.goBack()}
      />
      <View style={{flex: 9.5, alignItems: 'center', justifyContent: 'center'}}>
        <Image
          source={ImageAssets.ScannerFrame}
          style={{
            width: AppConstant.WIDTH * 0.65,
            height: AppConstant.WIDTH * 0.65,
          }}
          resizeMode={'cover'}
        />
        <View style={{marginTop: 16}}>
          <Text style={{color: colors.text_primary, fontSize: 16}}>
            {getLabel('moveCameraToQR')}
          </Text>
        </View>
      </View>
      <AppDialog
        open={openErr}
        viewOnly
        errorType
        showButton
        modalType={{width: '80%'}}
        message={getLabel('organizationNotActive')}
        submitLabel={getLabel('OK')}
        onSubmit={() => {
          setOpenErr(false);
          setScanned(false);
        }}
      />
    </View>
  );
};

export default memo(Scanner);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  } as ViewStyle,
});
