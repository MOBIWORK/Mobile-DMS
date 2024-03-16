import {
  StyleSheet,
  TextStyle,
  ViewStyle,
} from 'react-native';
import React, { useEffect } from 'react';
import {Block, ProgressLinear, AppText as Text} from '../../components/common';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AppTheme, useTheme} from '../../layouts/theme';
import AppImage from '../../components/common/AppImage';


type Props = {
  progress:number,
  setScreen:React.Dispatch<React.SetStateAction<boolean>>
}


const UpdateScreen = ({progress,setScreen}:Props) => {
  const theme = useTheme();
  const styles = rootStyles(theme);


 useEffect(() =>{
  if(progress < 100 ) return;
  else if (progress === 100){
    setScreen(false)
  }
 },[progress,setScreen])


  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'top']}>
      <Block  justifyContent="center" alignItems="center">
        <AppImage source="LogoMBW" size={40} />
        <Block
          marginTop={16}
          marginBottom={8}
          middle
          justifyContent="center"
          alignItems="center"
          paddingHorizontal={16}>
          <Text fontWeight="bold" fontSize={16} lineHeight={24}>
            Đang cập nhật
          </Text>
          <Text
            textAlign="center"
            colorTheme="text_secondary"
            fontSize={14}
            fontWeight="400">
            Ứng dụng đang được cập nhật, {'\n'} vui lòng chờ trong giây lát.
          </Text>
        </Block>
      </Block>
      <Block height={10}  paddingHorizontal={80}   >
        <ProgressLinear strokeWidth={12} progress={progress} />
      </Block>
    </SafeAreaView>
  );
};

export default UpdateScreen;

const rootStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.white,
      // height:'40%',
    } as ViewStyle,
    textTitle: {
      paddingTop: 12,
    } as TextStyle,
    updateButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: 20,
      justifyContent: 'center',
      padding: 9,
      //   width: '100%',
      //   justifyContent: 'center',
      alignContent: 'center',
      marginVertical: 8,
      marginTop: 8,
    } as ViewStyle,
  });
