import React, {FC} from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {AppIcons} from '../../../../components/common';
import {AppConstant} from '../../../../const';

const SelectedDateFilter: FC<SelectedDateFilterProps> = ({
  onOpenReportFilter,
}) => {
  const {colors} = useTheme();

  return (
    <>
      <TouchableOpacity
        onPress={onOpenReportFilter}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start',
          marginBottom: 16,
        }}>
        <Text style={{color: colors.text_primary, marginRight: 8}}>
          Hôm nay
        </Text>
        <AppIcons
          iconType={AppConstant.ICON_TYPE.MaterialCommunity}
          name={'chevron-down'}
          size={16}
          color={colors.text_secondary}
        />
      </TouchableOpacity>
    </>
  );
};
interface SelectedDateFilterProps {
  onOpenReportFilter: () => void;
}
export default SelectedDateFilter;
