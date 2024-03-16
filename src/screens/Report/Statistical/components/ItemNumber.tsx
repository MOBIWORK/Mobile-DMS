import React from 'react';
import isEqual from 'react-fast-compare';
import {SvgIconTypes} from '../../../../assets/svgIcon';
import {Block, SvgIcon, AppText as Text} from '../../../../components/common';

type Props = {
  label: string;
  content: number;
  icon: SvgIconTypes;
};

const ItemNumber = (props: Props) => {
  const {label, content, icon} = props;

  return (
    <Block
      block
      colorTheme="bg_default"
      paddingHorizontal={8}
      margin={8}
      borderRadius={12}
      paddingVertical={24}
      justifyContent="center"
      alignItems="center">
      <Block direction="row" alignItems="center" justifyContent="space-around">
        <SvgIcon source={icon} size={40} />
        <Block marginLeft={8}>
          <Text
            style={{marginBottom: 4}}
            fontSize={12}
            colorTheme="text_secondary"
            fontWeight="400">
            {label}
          </Text>
          <Text fontSize={18} fontWeight="500" colorTheme="text">
            {content}
          </Text>
        </Block>
      </Block>
    </Block>
  );
};

export default React.memo(ItemNumber, isEqual);
