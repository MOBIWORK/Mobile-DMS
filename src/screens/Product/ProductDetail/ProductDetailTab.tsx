import React, {FC, memo} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

const HomeTabs: FC<HomeTabsProps> = ({selectedTab, onChangeTab, style}) => {
  const {colors} = useTheme();
  const {t: getLabel} = useTranslation();

  const HOME_TABS = [
    {label: getLabel('overview'), value: PRODUCT_DETAIL_TAB_VALUES.tong_quan},
    {
      label: getLabel('unit'),
      value: PRODUCT_DETAIL_TAB_VALUES.don_vi_tinh,
    },
    {
      label: getLabel('inventory'),
      value: PRODUCT_DETAIL_TAB_VALUES.ton_kho,
    },
  ];

  const styles = StyleSheet.create({
    wrapper: {
      flexDirection: 'row',
      borderBottomColor: colors.border,
      borderBottomWidth: 1,
    },
    item: {
      flex: 1,
    },
    selected: {
      borderBottomWidth: 3,
      borderBottomColor: colors.primary,
    },
    labelSelected: {
      color: colors.primary,
    },
    label: {
      color: colors.text_disable,
      fontSize: 16,
      paddingVertical: 10,
      fontWeight: '500',
      textAlign: 'center',
    },
  });

  return (
    <View style={[styles.wrapper, style]}>
      {HOME_TABS.map(({label, value}, index) => {
        const isActive = selectedTab === value;

        return (
          <TouchableOpacity
            key={index}
            style={[styles.item, isActive && styles.selected]}
            onPress={() => onChangeTab(value)}>
            <Text style={[styles.label, isActive && styles.labelSelected]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export const PRODUCT_DETAIL_TAB_VALUES = {
  tong_quan: 1,
  don_vi_tinh: 2,
  ton_kho: 3,
};

interface HomeTabsProps {
  selectedTab: number;
  style: ViewStyle;
  onChangeTab: (selectedTab: number) => void;
}

export default memo(HomeTabs);
