import {FlatList} from 'react-native';
import React from 'react';
import CardView from './CardView';
import {IDataCustomers} from '../../../models/types';
import isEqual from 'react-fast-compare';
import SkeletonLoading from '../../Visit/SkeletonLoading';

type Props = {
  data: IDataCustomers[];
  appLoading: boolean;
  onLoadData?:() => void;
  listFooter:React.ReactElement
};

const ListCard = (props: Props) => {
  if (props.appLoading) {
    return  <SkeletonLoading />;
  }
  return (
    <FlatList
      data={props.data}
      style={{marginBottom: 100}}
      decelerationRate={'fast'}
      onEndReached={() => props.onLoadData!()}
      showsVerticalScrollIndicator={false}
      onEndReachedThreshold={2}
      ListFooterComponent={props.listFooter}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({item, index}) => {
        return <CardView {...item} key={index} />;
      }}
    />
  );
};

export default React.memo(ListCard, isEqual);
