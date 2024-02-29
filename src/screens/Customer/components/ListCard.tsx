import {FlatList} from 'react-native';
import React from 'react';
import CardView from './CardView';
import {IDataCustomers} from '../../../models/types';
import isEqual from 'react-fast-compare';

type Props = {
  data: IDataCustomers[];
};

const ListCard = (props: Props) => {
  return (
    <FlatList
      data={props.data}
      style={{marginBottom: 100}}
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
