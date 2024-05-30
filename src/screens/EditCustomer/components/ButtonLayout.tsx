import {StyleSheet, TouchableOpacity, ViewStyle} from 'react-native';
import React from 'react';
import {Block, SvgIcon, AppText as Text} from '../../../components/common';
import {useTheme, AppTheme} from '../../../layouts/theme';
import isEqual from 'react-fast-compare';

type Props = {
  firstLabel: string;
  secondLabel: string;
  onPressAdding: () => void;
  onPressChoose: () => void;
  isExist:boolean
};

const ButtonLayout = (props: Props) => {
  const {firstLabel, secondLabel, onPressAdding, onPressChoose} = props;
  const theme = useTheme();
  const styles = buttonStyles(theme);
  return (
    <Block  marginBottom={20} direction="row" justifyContent="space-between" alignItems="center">
      <TouchableOpacity style={styles.containButton} onPress={onPressAdding}>
        <SvgIcon source="BlackPlush" size={16} colorTheme='white' />
        <Text colorTheme="text_primary" fontSize={14} fontWeight="500">
          {'   '}
          {firstLabel}
        </Text>
      </TouchableOpacity>
      {props.isExist &&   <TouchableOpacity style={styles.containButton} onPress={onPressChoose}>
        <SvgIcon source="BluePlush" size={16} colorTheme='white' />
        <Text colorTheme="facebook" fontSize={14} fontWeight="500">
          {'   '}
          {secondLabel}
        </Text>
      </TouchableOpacity>}
    
    </Block>
  );
};

export default React.memo(ButtonLayout, isEqual);

const buttonStyles = (theme: AppTheme) =>
  StyleSheet.create({
    containButton: {
      height: 37,
      borderRadius: 20,
      backgroundColor: theme.colors.bg_neutral,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      flex:1,
      marginHorizontal:8
    } as ViewStyle,
  });
