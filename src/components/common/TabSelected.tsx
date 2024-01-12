import React, {FC} from 'react';
import {Pressable, StyleSheet, Text, View, ViewStyle} from 'react-native';
import {ExtendedTheme, useTheme} from '@react-navigation/native';
import {AppSegmentedButtonsType} from './AppSegmentedButtons';

const TabSelected: FC<TabSelectedProps> = ({style, data, onChange}) => {
  const theme = useTheme();
  const styles = createStyle(theme);
  return (
    <View style={[styles.container, {...style}]}>
      {data.map((item, index) => {
        return (
          <Pressable
            key={index}
            onPress={() => onChange(item.value)}
            style={{
              flex: 0.5,
              backgroundColor: item.isSelected
                ? 'rgba(196, 22, 28, 0.08)'
                : theme.colors.bg_default,
              alignItems: 'center',
              borderRadius: 24,
              padding: 16,
            }}>
            <Text
              style={{
                color: item.isSelected
                  ? theme.colors.primary
                  : theme.colors.text_secondary,
                fontWeight: '500',
              }}>
              {item.title}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};
interface TabSelectedProps {
  style?: ViewStyle;
  data: AppSegmentedButtonsType[];
  onChange: (value: string | number) => void;
}
export default TabSelected;
const createStyle = (theme: ExtendedTheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.bg_default,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderRadius: 16,
      padding: 4,
    } as ViewStyle,
  });
