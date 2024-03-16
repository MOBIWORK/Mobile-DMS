import React, {useMemo} from 'react';
import {Text, View, TextStyle, ViewStyle} from 'react-native';
import {BarChart} from 'react-native-gifted-charts';
import {StyleSheet} from 'react-native';
import {AppTheme, useTheme} from '../../layouts/theme';
import {AppConstant} from '../../const';
import moment from 'moment';
import {CommonUtils} from '../../utils';
import {useTranslation} from 'react-i18next';
// @ts-ignore
import StringFormat from 'string-format';

const BarChartStatistical = ({color, isSales, data}: PropTypes) => {
  const {colors} = useTheme();
  const styles = rootStyles(useTheme());
  const {t: getLabel} = useTranslation();

  const barCharData = useMemo(() => {
    if (data?.sales_invoice.length! > 0) {
      const newData: any = data?.sales_invoice.map((item: any) => {
        return {
          label: moment(item.ngay).format('DD'),
          value: isSales ? item.doanh_so / 1e6 : item.doanh_thu / 1e6,
        };
      });
      return newData.slice(-6);
    } else {
      return null;
    }
  }, [data]);

  return (
    <View
      style={{
        padding: 16,
        backgroundColor: colors.bg_default,
        borderRadius: 16,
      }}>
      <View>
        <Text style={[styles.title]}>
          {isSales
            ? getLabel('totalSalesPerMouth')
            : getLabel('totalRevenuePerMouth')}
        </Text>
        <Text style={[styles.description]}>
          {data?.Kpi ? CommonUtils.convertNumber(data.Kpi.dat_duoc) : 0}đ
          <Text style={[styles.desSub, {color: color}]}>
            {` (${StringFormat(getLabel('reachPercent'), {
              percent: data?.Kpi ? data.Kpi.phan_tram_thuc_hien : 0,
            })})`}
          </Text>
        </Text>
      </View>
      <View style={[styles.containerBar]}>
        <BarChart
          barWidth={15}
          data={barCharData}
          frontColor={color}
          noOfSections={6}
          yAxisLabelSuffix={'m'}
          initialSpacing={30}
          spacing={(AppConstant.WIDTH * 0.5) / 6}
          width={AppConstant.WIDTH * 0.7}
          xAxisColor={colors.border}
          yAxisColor={colors.border}
        />
      </View>
    </View>
  );
};

interface PropTypes {
  color: string;
  isSales?: boolean;
  data: any;
}

export default BarChartStatistical;

const rootStyles = (theme: AppTheme) =>
  StyleSheet.create({
    title: {
      fontSize: 12,
      lineHeight: 18,
      fontWeight: '400',
      marginBottom: 5,
      color: theme.colors.text_secondary,
    } as TextStyle,
    description: {
      marginTop: 5,
      fontSize: 20,
      lineHeight: 30,
      fontWeight: '500',
      color: theme.colors.text_primary,
    } as TextStyle,
    desSub: {
      fontSize: 14,
      lineHeight: 21,
      fontWeight: '400',
    } as TextStyle,
    containerBar: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 16,
    } as ViewStyle,
  });
