import {TouchableOpacity, View} from 'react-native';
import React, {FC} from 'react';
import {useTheme} from '@react-navigation/native';

export const RadioButton: FC<RadioButtonProps> = ({selected, handleSwitch}) => {
  const {colors} = useTheme();
  return (
    <TouchableOpacity
      onPress={handleSwitch}
      style={{
        height: 24,
        width: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: selected ? colors.primary : colors.text_secondary,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      {selected ? (
        <View
          style={{
            height: 12,
            width: 12,
            borderRadius: 6,
            backgroundColor: colors.primary,
          }}
        />
      ) : null}
    </TouchableOpacity>
  );
};
interface RadioButtonProps {
  selected: boolean;
  handleSwitch: () => void;
}
