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
  onEndReachedThreshold: () => void;
  listFooter?: () => React.JSX.Element;
  onRefresh: () => Promise<void>;
  loading: boolean;
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  currentIndex: number;
};

const ListCard = (props: Props) => {
  const {onScroll, onRefresh, onEndReachedThreshold} = props;
  const renderItem = ({item, index}: {item: IDataCustomers; index: number}) => (
    <CardView data={item as any} key={index} index={index} {...item} />
  );

  const flatListRef = useRef<FlatList>(null);

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
      onEndReachedThreshold={0.6}
      maxToRenderPerBatch={30}
      updateCellsBatchingPeriod={2}
      windowSize={31}
      initialNumToRender={25}
      refreshControl={
        <RefreshControl onRefresh={onRefresh} refreshing={props.loading} />
      }
      removeClippedSubviews={true}
      ListFooterComponent={props.listFooter}
      keyExtractor={(item, index) =>
        item.customer_code.toString() + index.toString()
      }
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
