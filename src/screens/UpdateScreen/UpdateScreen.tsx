import {
  StatusBar,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import React from 'react';
import {Block, AppText as Text} from '../../components/common';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AppTheme, useTheme} from '../../layouts/theme';
import {Modal} from 'react-native-paper';
import codePush from 'react-native-code-push';
import AppImage from '../../components/common/AppImage';


const UpdateScreen = () => {
  
  const theme = useTheme();
  const styles = rootStyles(theme);
  console.log(codePush.SyncStatus);

  return (
   <SafeAreaView style={styles.container}  edges={['bottom','top']}>
        <Block block middle>
        <Text>Hello</Text>
        </Block>
   </SafeAreaView>
  );
};

export default UpdateScreen;

const rootStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:theme.colors.white,
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
