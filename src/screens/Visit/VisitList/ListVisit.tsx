import React, {
  FC,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AppHeader, FilterView } from '../../../components/common';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { ImageAssets } from '../../../assets';
import { useNavigation, useTheme } from '@react-navigation/native';
import { NavigationProp } from '../../../navigation';
import { VisitListItemType } from '../../../models/types';
import VisitItem, { LocationProps } from './VisitItem';
import BottomSheet from '@gorhom/bottom-sheet';
import FilterContainer from './FilterContainer';
import { AppConstant, ScreenConstant } from '../../../const';
import Mapbox from '@rnmapbox/maps';
import BackgroundGeolocation, {
  Location,
} from 'react-native-background-geolocation';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import SkeletonLoading from '../SkeletonLoading';
import { useSelector } from '../../../config/function';

import { appActions } from '../../../redux-store/app-reducer/reducer';
import { customerActions } from '../../../redux-store/customer-reducer/reducer';
import { dispatch } from '../../../utils/redux';
import { getCustomerVisit } from '../../../services/appService';
//config Mapbox
Mapbox.setAccessToken(AppConstant.MAPBOX_TOKEN);

const ListVisit = () => {
  const { colors } = useTheme();
  const { bottom } = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();

  const filterRef = useRef<BottomSheet>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const systemConfig = useSelector(state => state.app.systemConfig);
  const listCustomer: VisitListItemType[] = useSelector(
    state => state.customer.listCustomerVisit,
  );
  const appLoading = useSelector(state => state.app.loadingApp);
  const [isShowListVisit, setShowListVisit] = useState<boolean>(true);
  const [location, setLocation] = useState<Location | null>(null);
  const system = useSelector(state => state.app.systemConfig);
  const [error, setError] = useState<string>('');
  const mounted = useRef<boolean>(true);
  const [visitItemSelected, setVisitItemSelected] =
    useState<VisitListItemType | null>(null);
  const backgroundErrorListener = useCallback((errorCode: number) => {
    // Handle background location errors
    switch (errorCode) {
      case 0:
        setError(
          'Không thể lấy được vị trí GPS. Bạn nên di chuyển đến vị trí không bị che khuất và thử lại.',
        );
        break;
      case 1:
        setError('GPS đã bị tắt. Vui lòng bật lại.');
        break;
      default:
        setError('Kết nỗi mạng không ổn định. Bạn nên kết nối lại và thử lại');
    }
  }, []);

  const customerCheckinCount = useMemo(() => {
    if (listCustomer.length > 0) {
      return listCustomer.filter(item => item.is_checkin).length;
    } else {
      return '';
    }
  }, [listCustomer]);

  const handleBackground = () => {
    BackgroundGeolocation.getCurrentPosition(
      { samples: 1, timeout: 3 },
      location => {
        console.log('location: ', location);
      },
      backgroundErrorListener,
    );
  };

  const MarkerItem: FC<MarkerItemProps> = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={{ alignItems: 'center', justifyContent: 'center' }}
        onPress={() => setVisitItemSelected(item)}>
        <Image
          source={ImageAssets.TooltipIcon}
          style={{ width: 20, height: 20, marginBottom: -5 }}
          resizeMode={'contain'}
          tintColor={colors.text_primary}
        />
        <Text style={{ color: colors.bg_default, position: 'absolute', top: 0 }}>
          {index + 1}
        </Text>
        <Image
          source={ImageAssets.MapPinFillIcon}
          style={{ width: 32, height: 32 }}
          tintColor={item.is_checkin ? colors.success : colors.warning}
          resizeMode={'cover'}
        />
      </TouchableOpacity>
    );
  };

  const _renderHeader = () => {
    return (
      <View style={{ paddingHorizontal: 16 }}>
        <AppHeader
          hiddenBackButton
          label={'Viếng thăm'}
          labelStyle={{ textAlign: 'left' }}
          rightButton={
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity
                onPress={() => setShowListVisit(!isShowListVisit)}>
                <Image
                  source={
                    isShowListVisit ? ImageAssets.MapIcon : ImageAssets.ListIcon
                  }
                  style={{ width: 28, height: 28 }}
                  tintColor={colors.text_secondary}
                  resizeMode={'cover'}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate(ScreenConstant.SEARCH_VISIT)
                }>
                <Image
                  source={ImageAssets.SearchIcon}
                  style={{ width: 28, height: 28, marginLeft: 16 }}
                  tintColor={colors.text_secondary}
                  resizeMode={'cover'}
                />
              </TouchableOpacity>
            </View>
          }
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            marginTop: 16,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
              padding: 8,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: colors.border,
              maxWidth: 180,
            }}>
            <Text style={{ color: colors.text_secondary }}>Khoảng cách:</Text>
            <Text style={{ color: colors.text_primary, marginLeft: 8 }}>
              Gần nhất
            </Text>
          </View>
          <FilterView
            style={{ marginLeft: 12 }}
            onPress={() =>
              bottomSheetRef.current && bottomSheetRef.current.snapToIndex(0)
            }
          />
        </View>
      </View>
    );
  };

  const _renderContent = () => {
    return (
      <View style={{ marginTop: 8 }}>
        {isShowListVisit ? (
          <View style={{ marginTop: 16, paddingHorizontal: 16 }}>
            <Text style={{ color: colors.text_secondary }}>
              Viếng thăm {customerCheckinCount}/{listCustomer?.length} khách
              hàng
            </Text>
            {listCustomer && (
              <FlatList
                style={{ height: '90%' }}
                showsVerticalScrollIndicator={false}
                data={listCustomer}
                renderItem={({ item }) => (
                  <VisitItem item={item} onPress={handleBackground} />
                )}
              />
            )}
          </View>
        ) : (
          <View style={styles.map as ViewStyle}>
            <Mapbox.MapView
              pitchEnabled={false}
              attributionEnabled={false}
              scaleBarEnabled={false}
              styleURL={Mapbox.StyleURL.Street}
              logoEnabled={false}
              style={{ flex: 1 }}>
              <Mapbox.Camera
                // ref={mapboxCameraRef}
                centerCoordinate={[
                  location?.coords.longitude ?? 0,
                  location?.coords.latitude ?? 0,
                ]}
                animationMode={'flyTo'}
                animationDuration={500}
                zoomLevel={12}
              />
              {listCustomer &&
                listCustomer.map((item, index) => {
                  const location: LocationProps = JSON.parse(
                    item.customer_location_primary!,
                  );
                  return (
                    <Mapbox.MarkerView
                      key={index}
                      coordinate={[
                        Number(location.long),
                        Number(location.lat),
                      ]}>
                      <MarkerItem item={item} index={index} />
                    </Mapbox.MarkerView>
                  );
                })}
              <Mapbox.UserLocation
                visible={true}
                animated
                androidRenderMode="gps"
                showsUserHeadingIndicator={true}
              />
              {visitItemSelected && (
                <View
                  style={{
                    position: 'absolute',
                    bottom: bottom + 70,
                    left: 24,
                    right: 24,
                  }}>
                  <VisitItem
                    item={visitItemSelected}
                    handleClose={() => setVisitItemSelected(null)}
                  />
                </View>
              )}
            </Mapbox.MapView>
          </View>
        )}
      </View>
    );
  };

  useLayoutEffect(() => {
    // setLoading(true);

    if (Object.keys(systemConfig).length < 0) {
      dispatch(appActions.onGetSystemConfig());
    }
    dispatch(customerActions.onGetCustomerVisit());
    BackgroundGeolocation.getCurrentPosition({
      samples: 1,
      timeout: 3,
    })
      .then(location => setLocation(location))
      .catch(e => console.log('err', e));

    // setLoading(false);
  }, []);

  const getCustomer = async () => {
    await getCustomerVisit().then((res: any) => {
      if (Object.keys(res?.result).length > 0) {
        const data: VisitListItemType[] = res?.result.data;
        const newData = data.filter(item => item.customer_location_primary);
        dispatch(customerActions.setCustomerVisit(newData));
      }
    });
  };

  useEffect(() => {
    mounted.current = true;
    getCustomer();
    return () => {
      mounted.current = false;
    };
  }, []);

  return (
    <SafeAreaView
      style={{ backgroundColor: colors.bg_neutral, paddingHorizontal: 0 }}>
      {_renderHeader()}
      {/* <SkeletonLoading loading={true}  /> */}
      {appLoading ? (
        <SkeletonLoading loading={appLoading!} />
      ) : (
        _renderContent()
      )}

      <FilterContainer bottomSheetRef={bottomSheetRef} filterRef={filterRef} />
    </SafeAreaView>
  );
};

interface MarkerItemProps {
  item: VisitListItemType;
  index: number;
}
export default ListVisit;

const styles = StyleSheet.create({
  map: {
    overflow: 'hidden',
    width: '100%',
    height: AppConstant.HEIGHT * 0.8,
  },
});

// export const VisitListData: VisitListItemType[] = [
//   {
//     label: 'Nintendo',
//     useName: 'Chu Quýnh Anh',
//     status: true,
//     address: '191 đường Lê Văn Thọ, Phường 8, Gò Vấp, Thành phố Hồ Chí Minh',
//     phone_number: '+84 667 435 265',
//     lat: 37.785839,
//     long: -122.4267,
//     distance: 1,
//   },
//   {
//     label: "McDonald's",
//     useName: 'Chu Quýnh Anh',
//     status: false,
//     address:
//       'Lô A, Khu Dân Cư Cityland, 99 Nguyễn Thị Thập, Tân Phú, Quận 7, Thành phố Hồ Chí Minh, Việt Nam',
//     phone_number: '+84 234 234 456',
//     lat: 37.784839,
//     long: -122.4467,
//     distance: 1.5,
//   },
//   {
//     label: 'General Electric',
//     useName: 'Chu Quýnh Anh',
//     status: false,
//     address:
//       '495A Cách Mạng Tháng Tám, Phường 13, Quận 10, Thành phố Hồ Chí Minh',
//     phone_number: '+84 234 234 456',
//     lat: 37.785839,
//     long: -122.4667,
//     distance: 2,
//   },
//   {
//     customer_name: "McDonald's",
//     useName: 'Chu Quýnh Anh',
//     status: false,
//     address:
//       'Lô A, Khu Dân Cư Cityland, 99 Nguyễn Thị Thập, Tân Phú, Quận 7, Thành phố Hồ Chí Minh, Việt Nam',
//     phone_number: '+84 234 234 456',
//     lat: 37.789839,
//     long: -122.4667,
//     distance: 1.5,
//   },
// ];
