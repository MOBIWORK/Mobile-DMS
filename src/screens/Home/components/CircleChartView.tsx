import {StyleSheet, TextStyle, ViewStyle} from 'react-native';
import React from 'react';
import {Block, AppText as Text} from '../../../components/common';
import {useTranslation} from 'react-i18next';
import {useTheme, AppTheme} from '../../../layouts/theme';
import {IReportVisit} from '../../../models/types';
import ProgressCircle from 'react-native-progress-circle';
import isEqual from 'react-fast-compare';

type Props = {
  visitValue?: IReportVisit;
};

const CircleChartView = ({visitValue}: Props) => {
  const theme = useTheme();
  const {colors} = useTheme();
  const {t: getLabel} = useTranslation();
  const styles = rootStyles(theme);
  return (
    <Block>
      <Block style={[styles.flexSpace]}>
        <Text style={[styles.tilteSection]}>{getLabel('visit')}</Text>
      </Block>
      <Block style={[styles.containerCheckin]}>
        <ProgressCircle
          percent={visitValue ? visitValue.phan_tram_thuc_hien : 0}
          radius={80}
          borderWidth={30}
          color={colors.action}
          shadowColor={colors.bg_disable}
          bgColor={colors.bg_default}>
          <Block>
            <Text style={[styles.textProcess]}>
              {visitValue?.dat_duoc}/{visitValue?.chi_tieu}
            </Text>
            <Text style={[styles.textProcessDesc]}>
              {' '}
              (Đạt {visitValue?.phan_tram_thuc_hien}
              %)
            </Text>
          </Block>
        </ProgressCircle>
        <Text style={[styles.checkinDesc]}>{getLabel('visitPerMonth')}</Text>
      </Block>
    </Block>
  );
};

export default React.memo(CircleChartView, isEqual);

const rootStyles = (theme: AppTheme) =>
  StyleSheet.create({
    flexSpace: {
      marginHorizontal: 16,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    } as ViewStyle,
    tilteSection: {
      fontSize: 14,
      lineHeight: 21,
      fontWeight: '500',
      color: theme.colors.text_disable,
      marginBottom: 8,
    } as TextStyle,
    containerCheckin: {
      marginHorizontal: 16,
      marginBottom: 8,
      flex: 1,
      alignItems: 'center',
      padding: 16,
      borderRadius: 16,
      backgroundColor: theme.colors.bg_default,
    } as ViewStyle,
    textProcess: {
      alignSelf: 'center',
      fontSize: 24,
      lineHeight: 28,
      fontWeight: '700',
      color: theme.colors.text_primary,
    } as TextStyle,
    textProcessDesc: {
      fontSize: 12,
      lineHeight: 21,
      fontWeight: '400',
      color: theme.colors.main,
    } as TextStyle,
    checkinDesc: {
      fontSize: 14,
      lineHeight: 21,
      fontWeight: '500',
      marginTop: 12,
      color: theme.colors.text_secondary,
    } as TextStyle,
  });
