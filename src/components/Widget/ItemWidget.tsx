import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NavigationProp} from '../../navigation/screen-type';
import {useTranslation} from 'react-i18next';
import {SvgIcon} from '../common';
import {SvgIconTypes} from '../../assets/svgIcon';
import {AppTheme, useTheme} from '../../layouts/theme';

const ItemuWidget = ({
  source,
  name,
  navigate,
  isTouchable = true,
  handleChangeWidget,
}: PropTypes) => {
  const styles = createSheetStyle(useTheme());
  const navigation = useNavigation<NavigationProp>();
  const {t: getLabel} = useTranslation();

  return (
    <TouchableOpacity
      disabled={!isTouchable}
      onPress={() => navigation.navigate(navigate)}>
      <View style={styles.container}>
        <Pressable
          onPress={
            isTouchable
              ? () => navigation.navigate(navigate)
              : () => handleChangeWidget && handleChangeWidget()
          }
          style={[styles.iconContail]}>
          <SvgIcon source={source} size={32} />
        </Pressable>
        <Text style={styles.name}>{getLabel(name)}</Text>
      </View>
    </TouchableOpacity>
  );
};

interface PropTypes {
  source: SvgIconTypes;
  name: string;
  navigate: any;
  isTouchable?: boolean;
  handleChangeWidget?: () => void;
}

export default ItemuWidget;

const createSheetStyle = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      paddingVertical: 8,
    } as ViewStyle,
    icon: {
      height: 32,
      width: 32,
    } as ViewStyle,
    iconContail: {
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 8,
      padding: 8,
      borderRadius: 8,
      borderColor: theme.colors.border,
      borderWidth: 1,
    } as ViewStyle,
    name: {
      color: theme.colors.text_secondary,
      fontSize: 12,
      fontWeight: '400',
      textAlign: 'center',
      paddingHorizontal: 8,
    } as TextStyle,
  });
