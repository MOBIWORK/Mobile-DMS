import React from 'react';
import {
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NavigationProp} from '../../navigation';
import {useTranslation} from 'react-i18next';

import {SvgIconTypes} from '../../assets/svgIcon';
import {AppTheme, useTheme} from '../../layouts/theme';
import {SvgIcon} from '../../components/common';
import {IWidget} from '../../models/types';

const ItemWidget = ({
  icon,
  name,
  // navigate,
}: PropTypes ) => {
  const styles = createSheetStyle(useTheme());
  const navigation = useNavigation<NavigationProp>();
  const {t: getLabel} = useTranslation();

 
    return (
      <TouchableOpacity onPress={() => console.log('onPress')}>
        <View style={styles.container}>
          <View style={[styles.iconContail]}>
            <SvgIcon source={icon} size={32} />
          </View>
          <Text style={styles.name}>{getLabel(name)}</Text>
        </View>
      </TouchableOpacity>
    );
  
};

interface PropTypes extends IWidget {
  isTouchable?: boolean;
}

export default ItemWidget;

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
