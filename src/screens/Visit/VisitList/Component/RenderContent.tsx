import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  RefreshControl,
} from 'react-native';
import React, {useTransition} from 'react';
import isEqual from 'react-fast-compare';
import {Block, AppText as Text} from '../../../../components/common';
import {VisitListItemResult, VisitListItemType} from '../../../../models/types';
import {GeolocationResponse} from '@react-native-community/geolocation';
import {CameraRef} from '@rnmapbox/maps/lib/typescript/src/components/Camera';
// @ts-ignore
import StringFormat from 'string-format';
import {useTheme} from '../../../../layouts/theme';
import {useTranslation} from 'react-i18next';
import VisitItem from '../VisitItem';
import {AppConstant} from '../../../../const';
import {MapView} from './MapView';
import {CommonUtils} from '../../../../utils';
import {HEIGHT} from '../../../../const/app.const';
import SkeletonLoading from '../../../Visit/SkeletonLoading';

type Props = {
  isShowListVisit: boolean;
  flatListRef: React.RefObject<FlatList<any>>;
  customerDataSort: VisitListItemType[] | undefined;
  listCustomer: VisitListItemResult;
  loading: boolean;
  visitItemSelected: VisitListItemType | null;
  location: GeolocationResponse | null;
  mapboxCameraRef: React.RefObject<CameraRef>;
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  onRefreshData: () => Promise<void>;
  setVisitItemSelected: React.Dispatch<
    React.SetStateAction<VisitListItemType | null>
  >;
  slideSizeRef: React.MutableRefObject<number>;
  onPressToDetail: (item: VisitListItemType) => void;
  handleCompareDistance: (item: VisitListItemType, isDetail: boolean) => void;
  handleRegainLocation: () => Promise<void>;
  handleEnabledPressed: (
    item?: VisitListItemType,
    type?: boolean,
  ) => Promise<void>;
  setShowListVisit: (value: React.SetStateAction<boolean>) => void;
  onEndReachedThreshold: () => void;
};

const RenderContentVisit = ({
  isShowListVisit,
  flatListRef,
  customerDataSort,
  listCustomer,
  loading,
  location,
  mapboxCameraRef,
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
  onEndReachedThreshold,
}: Props) => {
  const {colors} = useTheme();
  const {t: getLabel} = useTranslation();
  const [isPending, startTransition] = useTransition();

  const getItemLayout = React.useCallback(
    (data: ArrayLike<VisitListItemType> | null | undefined, index: number) => ({
      length: slideSizeRef.current,
      offset: 50 * index,
      index,
    }),
    [],
  );

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
  }, []);

  return (
    <Block marginTop={8}>
      {isShowListVisit ? (
        <Block marginTop={16} paddingHorizontal={16}>
          <Text style={{color: colors.text_secondary, paddingBottom: 10}}>
            {StringFormat(getLabel('customerVisitedCount'), {
              customerCheckinCount: listCustomer.total_checkin,
              allCustomer: listCustomer?.total > 0 ? listCustomer.total : 0,
            })}
          </Text>
          {loading ? (
            <SkeletonLoading />
          ) : (
            <FlatList
              ref={flatListRef}
              removeClippedSubviews={true}
              style={{height: '85%', paddingVertical: 8}}
              showsVerticalScrollIndicator={false}
              data={
                customerDataSort && customerDataSort.length > 0
                  ? customerDataSort
                  : listCustomer.data
              }
              keyExtractor={(item, index) => `${item.customer_code} - ${index}`}
              decelerationRate={'normal'}
              bounces={true}
              initialNumToRender={25}
              onMomentumScrollEnd={onScroll}
              refreshControl={
                <RefreshControl
                  refreshing={loading}
                  onRefresh={onRefreshData}
                />
              }
              maxToRenderPerBatch={30}
              getItemLayout={getItemLayout}
              contentContainerStyle={{rowGap: 16, paddingBottom: 50}}
              updateCellsBatchingPeriod={2}
              windowSize={31}
              renderItem={({item}) => (
                <VisitItem
                  item={item}
                  handlePressDetail={onPressToDetail}
                  handlePressing={handleEnabledPressed}
                  handleOpenMap={() => startTransition(() => presentMap(item))}
                />
              )}
              onEndReached={onEndReachedThreshold}
              onEndReachedThreshold={0.2}
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
          customerDataSort={listCustomer.data}
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
