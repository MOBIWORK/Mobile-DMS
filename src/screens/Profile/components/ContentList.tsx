import {FlatList, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {ProfileContent} from '../ultil/config';
import ContentItemView from './ContentItemView';

type Props = {
  data: ProfileContent[];
  onSwitch:() => void
};

const ContentList = (props: Props) => {
  const {data,onSwitch} = props;
  return (
    <FlatList
      data={data}
      keyExtractor={item => item.id.toString()}
      showsVerticalScrollIndicator={false}
      renderItem={({item}) => {
        return <ContentItemView item={item} onSwitch={onSwitch}/>;
      }}
    />
  );
};

export default React.memo(ContentList);

const styles = StyleSheet.create({});
