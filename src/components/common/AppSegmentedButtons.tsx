import React, {FC} from 'react';
import {Pressable, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import isEqual from 'react-fast-compare';
import { Block } from './Block';

const AppSegmentedButtons: FC<AppSegmentedButtonProps> = ({data, onChange}) => {
  const {colors} = useTheme();
  const {t: getLabel} = useTranslation();

  const styles = StyleSheet.create({
    container: {
      borderRadius: 16,
      backgroundColor: colors.bg_default,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-evenly',
      maxWidth: '90%',
      alignSelf: 'center',
      padding: 4,
    },
    touchable:(isSelected:boolean) =>({
      backgroundColor: isSelected
        ? 'rgba(196, 22, 28, 0.08)'
        : undefined,
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 20,
    })
  });

  return (
    <Block style={styles.container as any}>
      {data.map((item, index) => {
        return (
          <TouchableOpacity
            key={index}
            onPress={() => onChange(item.value)}
            style={styles.touchable(item.isSelected)}>
            <Text
              style={{
                color: item.isSelected ? colors.primary : colors.text_secondary,
                fontWeight: '500',
              }}>
              {getLabel(item.title)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </Block>
  );
};
interface AppSegmentedButtonProps {
  data: AppSegmentedButtonsType[];
  onChange: (value: string | number) => void;
}
export default React.memo(AppSegmentedButtons,isEqual);
export type AppSegmentedButtonsType = {
  title: string;
  value: string | number;
  isSelected: boolean;
};
