import {FlatList, RefreshControl} from 'react-native';
import React, {useMemo} from 'react';
import CardView from './CardView';
import {IDataCustomers} from '../../../models/types';
import isEqual from 'react-fast-compare';
import SkeletonLoading from '../../Visit/SkeletonLoading';

type Props = {
  data: IDataCustomers[];
  onLoadData?: () => void;
  listFooter?: () => React.JSX.Element;
  onRefresh: () => Promise<void>;
  loading: boolean;
};

const ListCard = (props: Props) => {
  const renderItem = ({item, index}: {item: IDataCustomers; index: number}) => (
    <CardView {...item} key={index} />
  );
  const memorizedValue = useMemo(() => renderItem, [props.data]);

  return props.loading ? (
    <SkeletonLoading />
  ) : (
    // <SafeAreaView edges={['bottom']}>

    <FlatList
      data={props.data}
      style={{marginBottom: 20}}
      decelerationRate={'fast'}
      onEndReached={() => props.onLoadData!()}
      showsVerticalScrollIndicator={false}
      onEndReachedThreshold={0.5}
      maxToRenderPerBatch={2}
      updateCellsBatchingPeriod={20}
      initialNumToRender={5}
      refreshControl={
        <RefreshControl
          onRefresh={() => props.onRefresh()}
          refreshing={props.loading}
        />
      }
      removeClippedSubviews={true}
      ListFooterComponent={props.listFooter}
      keyExtractor={(item, index) => item.name}
      renderItem={memorizedValue}
    />
  );
  // </SafeAreaView>
};

export default React.memo(ListCard, isEqual);
