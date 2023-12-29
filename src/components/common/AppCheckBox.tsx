import React, {FC} from 'react';
import {AppIcons} from './AppIcons';
import {AppConstant} from '../../const';
import {TouchableOpacity, ViewStyle} from 'react-native';
import {useTheme} from '@react-navigation/native';

const AppCheckBox: FC<AppCheckBoxProps> = ({styles, status, onChangeValue}) => {
  const theme = useTheme();
  return (
    <TouchableOpacity
      onPress={onChangeValue}
      style={{
        width: 24,
        height: 24,
        backgroundColor: status ? theme.colors.primary : undefined,
        borderRadius: 6,
        borderWidth: status ? 0 : 1,
        borderColor: theme.colors.text_secondary,
        alignItems: 'center',
        justifyContent: 'center',
        ...styles,
      }}>
      {status && (
        <AppIcons
          iconType={AppConstant.ICON_TYPE.AweIcons}
          name={'check'}
          size={14}
          color={'white'}
        />
      )}
    </TouchableOpacity>
  );
};
interface AppCheckBoxProps {
  styles?: ViewStyle;
  status: boolean;
  onChangeValue: () => void;
}
export default AppCheckBox;
