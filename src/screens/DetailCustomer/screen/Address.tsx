import {StyleSheet, TouchableOpacity, View, ViewStyle} from 'react-native';
import React from 'react';
import {AppTheme, useTheme} from '../../../layouts/theme';
import {MainLayout} from '../../../layouts';
import {AppIcons, AppText} from '../../../components/common';
import {AppConstant} from '../../../const';
import {useTranslation} from 'react-i18next';

type Props = {
  onPressAdding: () => void;
};

const Address = (props: Props) => {
  const {onPressAdding} = props;
  const theme = useTheme();
  const styles = rootStyles(theme);
  const {t: getLabel} = useTranslation();

  return (
    <>
      <MainLayout style={styles.root}>
        <View style={styles.containLabel}>
          <AppText fontSize={14} fontWeight="400" colorTheme="text_secondary">
            {getLabel('listAddress')}
          </AppText>
          <TouchableOpacity
            style={styles.containButton}
            onPress={onPressAdding}>
            <AppIcons
              iconType={AppConstant.ICON_TYPE.AntIcon}
              name="plus"
              size={16}
              color={theme.colors.action}
            />
          </TouchableOpacity>
        </View>
      </MainLayout>
    </>
  );
};

export default Address;

const rootStyles = (theme: AppTheme) =>
  StyleSheet.create({
    root: {
      paddingTop: 10,
    } as ViewStyle,
    containLabel: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 16,
    } as ViewStyle,
    containButton: {
      width: 30,
      height: 30,
      borderRadius: 30,
      borderWidth: 1,
      borderColor: theme.colors.action,
      justifyContent: 'center',
      alignItems: 'center',
    } as ViewStyle,
  });
