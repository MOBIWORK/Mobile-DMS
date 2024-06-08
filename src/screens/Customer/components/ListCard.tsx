import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  RefreshControl,
} from 'react-native';
import React, {useCallback, useMemo} from 'react';
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
  ref?: React.RefObject<FlatList<any>>;
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
};

const ListCard = (props: Props) => {
  const {onScroll} = props;
  const renderItem = useCallback(
    ({item, index}: {item: IDataCustomers; index: number}) => (
      <CardView data={item as any} key={index} index={index} {...item} />
    ),
    [props.data, props.loading],
  );
  // const memorizedValue = useCallback(() => renderItem, [props.data, props.loading]);
  // console.log(props.data,'data')
  return props.data && props.data.length > 0 ? (
    <FlatList
      data={props.data}
      style={{marginBottom: 20}}
      decelerationRate={'normal'}
      ref={props.ref}
      onScroll={onScroll}
      onEndReached={() => props.onLoadData!()}
      showsVerticalScrollIndicator={false}
      onEndReachedThreshold={0}
      maxToRenderPerBatch={10}
      updateCellsBatchingPeriod={50}
      scrollEventThrottle={100}
      windowSize={21}
      initialNumToRender={5}
      refreshControl={
        <RefreshControl
          onRefresh={() => props.onRefresh()}
          refreshing={props.loading}
        />
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
