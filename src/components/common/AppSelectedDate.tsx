import React, {FC} from 'react';
import {
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import {ExtendedTheme, useTheme} from '@react-navigation/native';
import {CommonUtils} from '../../utils';
import {SvgIcon} from './AppSvgIcon';

const AppSelectedDate: FC<AppSelectedDateProps> = ({
  date,
  endDate,
  onSelected,
}) => {
  const theme = useTheme();
  const styles = createStyle(theme);
  return (
    <TouchableOpacity onPress={onSelected} style={styles.container}>
      {date && endDate ? (
        <Text style={styles.text}>
          {CommonUtils.convertDate(date)} - {CommonUtils.convertDate(endDate)}
        </Text>
      ) : (
        <Text style={styles.text}>
          {CommonUtils.isToday(date)
            ? `Hôm nay, ${CommonUtils.convertDate(date)}`
            : CommonUtils.convertDate(date)}
        </Text>
      )}
      <SvgIcon
        source={'ChevronDownFill'}
        size={16}
        style={{marginLeft: 4}}
        color={theme.colors.text_secondary}
      />
    </TouchableOpacity>
  );
};
interface AppSelectedDateProps {
  date: number;
  endDate?: number;
  onSelected: () => void;
}
export default AppSelectedDate;
const createStyle = (theme: ExtendedTheme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
    } as ViewStyle,
    text: {
      color: theme.colors.text_primary,
      fontSize: 12,
      fontWeight: '500',
    } as TextStyle,
  });
