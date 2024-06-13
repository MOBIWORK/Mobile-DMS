import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import React, { useTransition } from 'react';
import isEqual from 'react-fast-compare';
import {
  Block,
  SkeletonLoading,
  AppText as Text,
} from '../../../../components/common';
import {VisitListItemResult, VisitListItemType} from '../../../../models/types';
import {GeolocationResponse} from '@react-native-community/geolocation';
import {CameraRef} from '@rnmapbox/maps/lib/typescript/src/components/Camera';
// @ts-ignore
import StringFormat from 'string-format';
import {useTheme} from '../../../../layouts/theme';
import {useTranslation} from 'react-i18next';
import VisitItem from '../VisitItem';
import { AppConstant } from '../../../../const';
import { MapView } from './MapView';
import { CommonUtils } from '../../../../utils';


type Props = {
  isShowListVisit: boolean;
  ref: React.RefObject<FlatList<any>>;
  customerDataSort: VisitListItemType[] | undefined;
  listCustomer: VisitListItemResult;
  loading: boolean;
  visitItemSelected: VisitListItemType | null;
  location: GeolocationResponse | null;
  mapboxCameraRef: React.RefObject<CameraRef>;
  customerCheckinCount: number;
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  onRefreshData: () => Promise<void>;
  setVisitItemSelected: React.Dispatch<React.SetStateAction<VisitListItemType | null>>
  slideSizeRef: React.MutableRefObject<number>;
  onPressToDetail: (item: VisitListItemType) => void;
  handleCompareDistance: (item: VisitListItemType, isDetail: boolean) => void;
  handleRegainLocation: () => Promise<void>
  handleEnabledPressed: (item?: VisitListItemType, type?: boolean) => Promise<void>
  setShowListVisit: (value: React.SetStateAction<boolean>) => void;
  onEndReachedThreshold: () => null | undefined

};

const RenderContentVisit = ({
  isShowListVisit,
  ref,
  customerDataSort,
  listCustomer,
  loading,
  location,
  mapboxCameraRef,
  customerCheckinCount,
  onScroll,
  onRefreshData,
  slideSizeRef,
  visitItemSelected,
  setVisitItemSelected,
  onPressToDetail,
  handleCompareDistance,
  handleRegainLocation,
  handleEnabledPressed,
  setShowListVisit,
  onEndReachedThreshold

}: Props) => {
  const {colors} = useTheme();
  const {t: getLabel} = useTranslation();
const [isPending,startTransition] = useTransition()

  const getItemLayout = React.useCallback((
    data: ArrayLike<VisitListItemType> | null | undefined,
    index: number,
  ) => ({length: slideSizeRef.current, offset: 50 * index, index}),[]);

  const presentMap = React.useCallback((item: VisitListItemType) => {
    const item_location: any = JSON.parse(item.customer_location_primary);
    CommonUtils.sleep(100).then(() => {
      mapboxCameraRef.current &&
        mapboxCameraRef.current.moveTo(
          [Number(item_location.long), Number(item_location.lat)],
          1000,
        );
    });

    setShowListVisit(false);
    setVisitItemSelected(item);
  },[]);


  return (
    <Block marginTop={8}>
      {isShowListVisit ? (
        <Block marginTop={16} paddingHorizontal={16}>
          <Text style={{color: colors.text_secondary}}>
            {StringFormat(getLabel('customerVisitedCount'), {
              customerCheckinCount: customerCheckinCount,
              allCustomer: listCustomer?.total > 0 ? listCustomer.total : 0,
            })}
          </Text>
          {loading ? (
            <SkeletonLoading />
          ) : (
            <FlatList
              ref={ref}
              style={{height: '85%', paddingVertical: 8}}
              showsVerticalScrollIndicator={false}
              data={customerDataSort ?? listCustomer.data}
              keyExtractor={(item, index) => `${item.customer_code} - ${index}`}
              decelerationRate={'normal'}
              bounces={true}
              initialNumToRender={10}
              // onScroll={onScroll}
              onMomentumScrollEnd={onScroll}
              refreshControl={
                <RefreshControl
                  refreshing={loading}
                  onRefresh={onRefreshData}
                />
              }
              maxToRenderPerBatch={10}
              getItemLayout={getItemLayout}
              updateCellsBatchingPeriod={4}
              windowSize={21}
              contentContainerStyle={{rowGap: 16}}
              renderItem={({item}) => (
                <VisitItem
                  item={item}
                  handlePressDetail={onPressToDetail}
                  handlePressing={handleEnabledPressed}
                  handleOpenMap={() => startTransition(() => presentMap(item))}
                />
              )}
              onEndReached={onEndReachedThreshold}
              onEndReachedThreshold={0.5}
              ListEmptyComponent={
                <Block
                  alignSelf="center"
                  height={AppConstant.HEIGHT * 0.5}
                  justifyContent="center">
                  <Text fontSize={20} color={colors.text_primary}>
                    {getLabel('noVisit')}
                  </Text>
                </Block>
              }
            />
          )}
        </Block>
      ) : (
        <MapView
          visitItemSelected={visitItemSelected || null}
          location={location}
          customerDataSort={customerDataSort}
          mapboxCameraRef={mapboxCameraRef}
          setVisitItemSelected={setVisitItemSelected}
          onPressToDetail={onPressToDetail}
          handleCompareDistance={handleCompareDistance}
          handleRegainLocation={handleRegainLocation}
        />
      )}
    </Block>
  );
};

export default React.memo(RenderContentVisit, isEqual);


