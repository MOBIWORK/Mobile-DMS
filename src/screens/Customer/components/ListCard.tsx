import {FlatList, RefreshControl} from 'react-native';
import React, {useMemo} from 'react';
import CardView from './CardView';
import {IDataCustomers} from '../../../models/types';
import isEqual from 'react-fast-compare';
import SkeletonLoading from '../../Visit/SkeletonLoading';
import {Block, AppText as Text} from '../../../components/common';

type Props = {
  data: IDataCustomers[];
  onLoadData?: () => void;
  listFooter?: () => React.JSX.Element;
  onRefresh: () => Promise<void>;
  loading: boolean;
};

const ListCard = (props: Props) => {
  const renderItem = ({item, index}: {item: IDataCustomers; index: number}) => (
    <CardView data={item as any} key={index} index={index} {...item} />
  );
  const memorizedValue = useMemo(() => renderItem, [props.data, props.loading]);
  // console.log(props.data,'data')
  return props.data && props.data.length > 0 ? (
    
    <FlatList
      data={props.data}
      style={{marginBottom: 20}}
      decelerationRate={'fast'}
      onEndReached={() => props.onLoadData!()}
      showsVerticalScrollIndicator={false}
      onEndReachedThreshold={0}
      maxToRenderPerBatch={10}
      updateCellsBatchingPeriod={5}
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
      keyExtractor={(item, index) => item.name}
      renderItem={memorizedValue}
    />
  ) : (
    <Block block justifyContent="center" alignItems="center">
      <Text
        fontSize={16}
        fontWeight="500"
        lineHeight={24}
        colorTheme="text_primary">
        Không tìm thấy khách hàng
      </Text>
    </Block>
  );
  // </SafeAreaView>
};

export default React.memo(ListCard, isEqual);
