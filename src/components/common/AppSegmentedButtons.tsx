import React, {FC} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useTheme} from '@react-navigation/native';

const AppSegmentedButtons: FC<AppSegmentedButtonProps> = ({data, onChange}) => {
  const {colors} = useTheme();

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
  });

  return (
    <View style={styles.container as any}>
      {data.map((item, index) => {
        return (
          <Pressable
            key={index}
            onPress={() => onChange(item.value)}
            style={{
              backgroundColor: item.isSelected
                ? 'rgba(196, 22, 28, 0.08)'
                : undefined,
              paddingVertical: 10,
              paddingHorizontal: 16,
              borderRadius: 20,
            }}>
            <Text
              style={{
                color: item.isSelected ? colors.primary : colors.text_secondary,
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
interface AppSegmentedButtonProps {
  data: AppSegmentedButtonsType[];
  onChange: (value: string | number) => void;
}
export default AppSegmentedButtons;
export type AppSegmentedButtonsType = {
  title: string;
  value: string | number;
  isSelected: boolean;
};
