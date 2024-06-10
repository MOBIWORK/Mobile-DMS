import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  RefreshControl,
} from 'react-native';
import React, {useCallback, useMemo, useRef} from 'react';
import CardView from './CardView';
import {IDataCustomers} from '../../../models/types';
import isEqual from 'react-fast-compare';
import {Block, AppText as Text} from '../../../components/common';
import SkeletonLoading from '../../Visit/SkeletonLoading';

type Props = {
  data: IDataCustomers[];
  onLoadData?: () => void;
  listFooter?: () => React.JSX.Element;
  onRefresh: () => Promise<void>;
  loading: boolean;
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  currentIndex: number;
};

const ListCard = (props: Props) => {
  const {onScroll} = props;
  const renderItem = ({item, index}: {item: IDataCustomers; index: number}) => (
    <CardView data={item as any} key={index} index={index} {...item} />
  );

  const flatListRef = useRef<FlatList>(null);

  const onEndReachedThreshold = () => {
    if (props.onLoadData && typeof props.onLoadData === 'function') {
      props.onLoadData();
      // flatListRef.current?.scrollToIndex({
      //   animated: true,
      //   index: props.data && props.data.length -1,
      // });
    }
  };
  const onLoadingData = () => {
    if (props.onRefresh && typeof props.onRefresh === 'function') {
      props.onRefresh();
      // flatListRef.current?.scrollToIndex({
      //   animated: true,
      //   index: props.currentIndex,
      // });
    }
  };

  // const memorizedValue = useCallback(() => renderItem, [props.data, props.loading]);
  // console.log(props.data,'data')
  return !props.loading ? (
    <FlatList
      data={props.data}
      style={{marginBottom: 20}}
      decelerationRate={'normal'}
      ref={flatListRef}
      onScroll={onScroll}
      onEndReached={onEndReachedThreshold}
      showsVerticalScrollIndicator={false}
      onEndReachedThreshold={0}
      maxToRenderPerBatch={10}
      updateCellsBatchingPeriod={50}
      scrollEventThrottle={100}
      windowSize={21}
      
      initialNumToRender={5}
      refreshControl={
        <RefreshControl onRefresh={onLoadingData} refreshing={props.loading} />
      }
      removeClippedSubviews={true}
      ListFooterComponent={props.listFooter}
      keyExtractor={(item, index) => index.toString()}
      renderItem={renderItem}
    />
  ) : (
    <Block block>
      <SkeletonLoading />
    </Block>
  );
  // </SafeAreaView>
};

export default React.memo(ListCard, isEqual);
