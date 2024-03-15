import {FlatList} from 'react-native';
import React from 'react';
import CardView from './CardView';
import {IDataCustomers} from '../../../models/types';
import isEqual from 'react-fast-compare';

type Props = {
  data: IDataCustomers[]
  onLoadData?:() => void;
  listFooter:React.ReactElement
};

const ListCard = (props: Props) => {
  
  return (
    <FlatList
      data={props.data}
      style={{marginBottom: 100}}
      decelerationRate={'fast'}
      onEndReached={() => props.onLoadData!()}
      showsVerticalScrollIndicator={false}
      onEndReachedThreshold={0.5}
      initialNumToRender={4}
      maxToRenderPerBatch={2}
      updateCellsBatchingPeriod={50}
      ListFooterComponent={props.listFooter}
      keyExtractor={(item, index) => item.name}
      renderItem={({item, index}) => {
        return <CardView {...item} key={index} />;
      }}
    />
  );
};

export default React.memo(ListCard, isEqual);
