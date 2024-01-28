import {TouchableOpacity} from 'react-native';
import React from 'react';
import {IItemCheckIn} from './ultil';
import {Block, SvgIcon, AppText as Text} from '../../../components/common';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '../../../navigation';
import { useTheme } from '../../../layouts/theme';
import isEqual from 'react-fast-compare';

type Props = {
  item: IItemCheckIn;
};

const ItemCheckIn = ({item}: Props) => {
  const navigation = useNavigation<NavigationProp>()
  const {colors}  = useTheme()
  return (
    <Block>
      <TouchableOpacity onPress={() =>  navigation.navigate(item.screenName,{type : item.type ? item.type : ""})}>
        <Block
          direction="row"
          justifyContent="space-between"
          alignItems="center">
          <Block direction="row" alignItems="center" block paddingVertical={8}>
            <Block
              width={36}
              paddingRight={8}
              alignItems="center"
              justifyContent="center"
              height={36}
              paddingHorizontal={8}
              colorTheme={item.backgroundColor}
              borderRadius={8}>
              <SvgIcon source={item.icon} size={20} color={colors.border} />
            </Block>
            <Block direction="row" alignItems="center">
              <Text> {item.name}</Text>
              {item.isRequire ? <SvgIcon source="Alert" size={16} /> : null}
            </Block>
          </Block>
          <Block direction="row" alignItems="center">
            {item.isDone ? <SvgIcon source={'CheckCircle'} size={16} /> : null}
            <SvgIcon source="arrowRight" size={24} />
          </Block>
        </Block>
      </TouchableOpacity>
    </Block>
  );
};

export default React.memo(ItemCheckIn,isEqual);


