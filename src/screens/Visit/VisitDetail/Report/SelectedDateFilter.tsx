import React, {FC} from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {AppIcons, SvgIcon} from '../../../../components/common';
import {AppConstant} from '../../../../const';
import moment from 'moment';

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
          Hôm nay, {moment(new Date()).format('DD/MM/YYYY')}
        </Text>
          <SvgIcon
          source='ChevronDown'
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
