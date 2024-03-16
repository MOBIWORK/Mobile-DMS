import React, {FC} from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {SvgIcon} from '../../../../components/common';

const SelectedDateFilter: FC<SelectedDateFilterProps> = ({
  onOpenReportFilter,
  timeLabel,
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
          {timeLabel}
        </Text>
        <SvgIcon source="ChevronDown" size={16} color={colors.text_secondary} />
      </TouchableOpacity>
    </>
  );
};
interface SelectedDateFilterProps {
  onOpenReportFilter: () => void;
  timeLabel?: string;
}
export default SelectedDateFilter;
