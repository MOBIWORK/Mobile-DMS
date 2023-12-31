import React, {FC, useEffect, useLayoutEffect, useRef, useState} from 'react';
import {MainLayout} from '../../../layouts';
import {AppHeader, FilterView} from '../../../components/common';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {ImageAssets} from '../../../assets';
import {useTranslation} from 'react-i18next';
import {useNavigation, useTheme} from '@react-navigation/native';
import {NavigationProp} from '../../../navigation';
import {VisitListItemType} from '../../../models/types';
import VisitItem from './VisitItem';
import BottomSheet from '@gorhom/bottom-sheet';
import FilterContainer from './FilterContainer';
import {AppConstant, ScreenConstant} from '../../../const';
import {useSelector} from 'react-redux';
import {AppSelector} from '../../../redux-store';
import Mapbox from '@rnmapbox/maps';
import BackgroundGeolocation, {
  Location,
} from 'react-native-background-geolocation';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

//config Mapbox
Mapbox.setAccessToken(AppConstant.MAPBOX_TOKEN);

const ListVisit = () => {
  const {t: getLabel} = useTranslation();
  const {colors} = useTheme();
  const {bottom} = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();

  const filterRef = useRef<BottomSheet>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);

  const searchVisitValue = useSelector(AppSelector.getSearchVisitValue);

  const [isShowListVisit, setShowListVisit] = useState<boolean>(true);
  const [location, setLocation] = useState<Location | null>(null);
  const [visitItemSelected, setVisitItemSelected] =
    useState<VisitListItemType | null>(null);

  const MarkerItem: FC<MarkerItemProps> = ({item, index}) => {
    return (
      <TouchableOpacity
        style={{alignItems: 'center', justifyContent: 'center'}}
        onPress={() => setVisitItemSelected(item)}>
        <Image
          source={ImageAssets.TooltipIcon}
          style={{width: 20, height: 20, marginBottom: -5}}
          resizeMode={'contain'}
          tintColor={colors.text_primary}
        />
        <Text style={{color: colors.bg_default, position: 'absolute', top: 0}}>
          {index + 1}
        </Text>
        <Image
          source={ImageAssets.MapPinFillIcon}
          style={{width: 32, height: 32}}
          tintColor={item.status ? colors.success : colors.warning}
          resizeMode={'cover'}
        />
      </TouchableOpacity>
    );
  };

  const _renderHeader = () => {
    return (
      <View style={{paddingHorizontal: 16}}>
        <AppHeader
          hiddenBackButton
          label={'Viếng thăm'}
          labelStyle={{textAlign: 'left'}}
          rightButton={
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                onPress={() => setShowListVisit(!isShowListVisit)}>
                <Image
                  source={
                    isShowListVisit ? ImageAssets.MapIcon : ImageAssets.ListIcon
                  }
                  style={{width: 28, height: 28}}
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
                  style={{width: 28, height: 28, marginLeft: 16}}
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
            <Text style={{color: colors.text_secondary}}>Khoảng cách:</Text>
            <Text style={{color: colors.text_primary, marginLeft: 8}}>
              Gần nhất
            </Text>
          </View>
          <FilterView
            style={{marginLeft: 12}}
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
      <View style={{marginTop: 8}}>
        {isShowListVisit ? (
          <View style={{marginTop: 16, paddingHorizontal: 16}}>
            <Text style={{color: colors.text_secondary}}>
              Viếng thăm 3/10 khách hàng
            </Text>
            <FlatList
              style={{height: '90%'}}
              showsVerticalScrollIndicator={false}
              data={VisitListData}
              renderItem={({item}) => <VisitItem item={item} />}
            />
          </View>
        ) : (
          <View style={styles.map}>
            <Mapbox.MapView
              pitchEnabled={false}
              attributionEnabled={false}
              scaleBarEnabled={false}
              styleURL={Mapbox.StyleURL.Street}
              logoEnabled={false}
              style={{flex: 1}}>
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
              {VisitListData.map((item, index) => {
                return (
                  <Mapbox.MarkerView
                    key={index}
                    coordinate={[Number(item.long), Number(item.lat)]}>
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
                    bottom: bottom + 16,
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
    BackgroundGeolocation.getCurrentPosition({samples: 1, timeout: 3})
      .then(location => setLocation(location))
      .catch(e => console.log('err', e));
  }, []);

  return (
    <MainLayout
      style={{backgroundColor: colors.bg_neutral, paddingHorizontal: 0}}>
      {_renderHeader()}
      {_renderContent()}
      <FilterContainer bottomSheetRef={bottomSheetRef} filterRef={filterRef} />
    </MainLayout>
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

const VisitListData: VisitListItemType[] = [
  {
    label: 'Nintendo',
    useName: 'Chu Quýnh Anh',
    status: true,
    address: '191 đường Lê Văn Thọ, Phường 8, Gò Vấp, Thành phố Hồ Chí Minh',
    phone_number: '+84 667 435 265',
    lat: 37.785839,
    long: -122.4267,
    distance: 1,
  },
  {
    label: "McDonald's",
    useName: 'Chu Quýnh Anh',
    status: false,
    address:
      'Lô A, Khu Dân Cư Cityland, 99 Nguyễn Thị Thập, Tân Phú, Quận 7, Thành phố Hồ Chí Minh, Việt Nam',
    phone_number: '+84 234 234 456',
    lat: 37.784839,
    long: -122.4467,
    distance: 1.5,
  },
  {
    label: 'General Electric',
    useName: 'Chu Quýnh Anh',
    status: false,
    address:
      '495A Cách Mạng Tháng Tám, Phường 13, Quận 10, Thành phố Hồ Chí Minh',
    phone_number: '+84 234 234 456',
    lat: 37.785839,
    long: -122.4667,
    distance: 2,
  },
  {
    label: "McDonald's",
    useName: 'Chu Quýnh Anh',
    status: false,
    address:
      'Lô A, Khu Dân Cư Cityland, 99 Nguyễn Thị Thập, Tân Phú, Quận 7, Thành phố Hồ Chí Minh, Việt Nam',
    phone_number: '+84 234 234 456',
    lat: 37.789839,
    long: -122.4667,
    distance: 1.5,
  },
];
