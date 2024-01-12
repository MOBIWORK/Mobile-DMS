import React, {FC, ReactElement} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {ExtendedTheme, useNavigation, useTheme} from '@react-navigation/native';
import {ImageAssets} from '../../../assets';
import {AppSelectedDate} from '../../../components/common';
import {NavigationProp} from '../../../navigation';
const ReportHeader: FC<ReportHeaderProps> = ({
  title,
  date,
  rightIcon,
  onSelected,
}) => {
  const theme = useTheme();
  const style = createStyleSheet(theme);
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={style.container}>
      <View style={style.title}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={ImageAssets.ArrowLeftIcon}
            style={{width: 24, height: 24}}
            tintColor={theme.colors.text_secondary}
          />
        </TouchableOpacity>
        <View style={{marginLeft: 8, rowGap: 4}}>
          <Text style={style.titleText}>{title}</Text>
          <AppSelectedDate date={date} onSelected={onSelected} />
        </View>
      </View>
      {rightIcon && rightIcon}
    </View>
  );
};
interface ReportHeaderProps {
  title: string;
  date: number;
  onSelected: () => void;
  rightIcon?: ReactElement;
}
export default ReportHeader;
const createStyleSheet = (theme: ExtendedTheme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    } as ViewStyle,
    title: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
    } as ViewStyle,
    titleText: {
      fontSize: 18,
      fontWeight: '500',
      color: theme.colors.text_primary,
    } as TextStyle,
    dateText: {
      fontSize: 12,
      fontWeight: '500',
      color: theme.colors.text_primary,
    } as TextStyle,
  });
