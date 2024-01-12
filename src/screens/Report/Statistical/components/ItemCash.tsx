import React from 'react';
import isEqual from 'react-fast-compare';
import {SvgIconTypes} from '../../../../assets/svgIcon';
import {Block, SvgIcon, AppText as Text} from '../../../../components/common';
import {formatMoney} from '../../../../config/function';

type Props = {
  label: string;
  content: number;
  icon: SvgIconTypes;
};

const ItemCash = (props: Props) => {
  const {label, content, icon} = props;
  return (
    <Block
      marginTop={16}
      // block
      colorTheme="bg_default"
      margin={8}
      borderRadius={12}
      paddingVertical={16}>
      <Block direction="row" marginLeft={16} marginRight={16}>
        <SvgIcon source={icon} size={40} />
        <Block marginLeft={16}>
          <Text
            style={{marginBottom: 4}}
            fontSize={12}
            colorTheme="text_secondary"
            fontWeight="400">
            {label}
          </Text>
          <Text fontSize={18} fontWeight="500" colorTheme="text">
            {formatMoney(content)}
          </Text>
        </Block>
      </Block>
    </Block>
  );
};

export default React.memo(ItemCash, isEqual);
