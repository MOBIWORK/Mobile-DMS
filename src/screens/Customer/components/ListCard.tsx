import {FlatList} from 'react-native';
import React from 'react';
import CardView from './CardView';
import {IDataCustomers} from '../../../models/types';
import isEqual from 'react-fast-compare';
import SkeletonLoading from '../../Visit/SkeletonLoading';

type Props = {
  data: IDataCustomers[];
  appLoading:boolean
};


const ListCard = (props: Props) => {
  if(props.appLoading){
    <SkeletonLoading loading={props.appLoading} />
    
  }
  return (
    
    <FlatList
      data={props.data}
      decelerationRate={'fast'}
      showsVerticalScrollIndicator={false}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({item, index}) => {
        return <CardView {...item} key={index} />;
      }}
    />
  );
};

export default React.memo(ListCard, isEqual);
