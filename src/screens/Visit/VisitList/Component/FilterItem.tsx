import React, {FC} from 'react';
import {AppInput} from '../../../../components/common';
import {TextInput} from 'react-native-paper';
import {useTheme} from '@react-navigation/native';
const FilterItem: FC<ItemProps> = ({
  label,
  value,
  type,
  setFilterType,
  filterRef,
}) => {
  const {colors} = useTheme();
  return (
    <AppInput
      label={label}
      value={value}
      onPress={() => {
        setFilterType(type);
        filterRef.current && filterRef.current.snapToIndex(0);
      }}
      editable={false}
      rightIcon={
        <TextInput.Icon
          icon={'chevron-down'}
          style={{width: 24, height: 24}}
          color={colors.text_secondary}
        />
      }
    />
  );
};
interface ItemProps {
  label: string;
  value: string;
  type: string;
  setFilterType: (type: string) => void;
  filterRef: any;
}

export default React.memo(FilterItem);
