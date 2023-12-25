import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import React from 'react';
import {ProfileContent} from '../ultil/config';
import {AppTheme, useTheme} from '../../../layouts/theme';
import {AppText, SvgIcon} from '../../../components/common';
import {useTranslation} from 'react-i18next';

type Props = {
  item: ProfileContent;
};

const ContentItemView = (props: Props) => {
  const {item} = props;
  const theme = useTheme();
  const styles = rootStyles(theme);
  const {t: translate} = useTranslation();
  return (
    <TouchableOpacity
      style={styles.container}
      disabled={item.leftSide}
      onPress={() => {
        item.leftSide ? null : item.onPress();
      }}>
      <View style={styles.containLabel}>
        <SvgIcon source={item.icon} size={24} color={theme.colors.bg_neutral} />
        <AppText> {translate(item.name)}</AppText>
      </View>
      <View style={styles.containTouchable}>
        {(item.leftSide && (item.name === 'language') )? (
          <View style={styles.containTouchable}>
            <Text>Ngôn ngữ</Text>
            <SvgIcon source='ArrowDown'  size={16} />
          </View>
        ) : (
          <View></View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default ContentItemView;

const rootStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      paddingVertical: 12,
      paddingHorizontal: 16,
      flexDirection: 'row',
      alignItems: 'center',
    } as ViewStyle,
    containLabel: {
      flexDirection: 'row',
      alignItems: 'center',
      flex:1
    } as ViewStyle,
    containTouchable: {
    //   flex: 1,
        backgroundColor:'red',
        padding:8,
        flexDirection:'row'

    } as ViewStyle,
  });
