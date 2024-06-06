import React, {FC} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {ExtendedTheme, useTheme} from '@react-navigation/native';
import {CommonUtils} from '../../../../utils';
import {DebtDetailItemType} from '../../../../models/types';
import {useTranslation} from 'react-i18next';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  Accordion,
  Block,
  AppText as Text,
  AppImage,
} from '../../../../components/common';

const Debt: FC<DebtProps> = ({debtData, reportDebt}) => {
  const theme = useTheme();
  const styles = createStyleSheet(theme);
  const {t: getLabel} = useTranslation();

  const renderDebtItem = React.useCallback((debtItem: DebtDetailItemType) => {
    return (
      <Accordion
        type="regular"
        containerStyle={{
          backgroundColor: theme.colors.bg_default,
        }}
        title={`${getLabel('day')} ${
          debtItem?.posting_date
            ? CommonUtils.convertDate(debtItem.posting_date)
            : ''
        }`}>
        <>
          <Block
            direction="row"
            justifyContent="space-between"
            paddingVertical={8}
            paddingHorizontal={16}>
            <Text fontSize={16} fontWeight="500">
              {getLabel('bill')}
            </Text>
            <Text fontSize={16} fontWeight="500">
              {getLabel('amountOwed')}
            </Text>
          </Block>
          {debtItem.details.map((item, index) => {
            return (
              <Block
                key={index}
                marginBottom={8}
                paddingHorizontal={16}
                block
                color={theme.colors.bg_default}>
                <Block
                  direction={'row'}
                  justifyContent={'space-between'}
                  alignItems={'center'}>
                  <Block direction={'row'}>
                    <AppImage size={10} source={'BarCodeIcon'} />
                    <Text
                      style={{color: theme.colors.text_primary, marginLeft: 6}}>
                      {item.name}
                    </Text>
                  </Block>
                  <Text color={theme.colors.text_primary} fontSize={14}>
                    {CommonUtils.convertToTwoDecimalPlaces(item.grand_total)}
                  </Text>
                </Block>
              </Block>
            );
          })}
          <Text
            style={{marginRight: 16, marginBottom: 8}}
            fontSize={14}
            fontWeight={'500'}
            textAlign={'right'}>
            Tổng tiền:{' '}
            <Text fontSize={16}>
              {CommonUtils.convertToTwoDecimalPlaces(
                debtItem.total_grand_total,
              )}
            </Text>
          </Text>
        </>
      </Accordion>
    );
  }, []);

  return (
    <SafeAreaView edges={['bottom']}>
      <View style={styles.headerContainer as any}>
        <View
          style={{
            padding: 16,
            width: '48%',
            backgroundColor: theme.colors.bg_default,
            borderRadius: 12,
            height: 120,
            justifyContent: 'space-between',
          }}>
          <Text style={{color: theme.colors.text_primary}}>
            {getLabel('totalDebt')}
          </Text>
          <Text style={styles.titleText as any}>
            {reportDebt && reportDebt?.tong_cong_no > 0
              ? CommonUtils.convertNumber(reportDebt.tong_cong_no).toString()
              : 0}
          </Text>
        </View>
        <View
          style={{
            padding: 16,
            width: '48%',
            backgroundColor: theme.colors.bg_default,
            borderRadius: 12,
            height: 120,
            justifyContent: 'space-between',
          }}>
          <Text style={{color: theme.colors.text_primary}}>
            Tổng nợ đến hết ngày {CommonUtils.convertDate(new Date().getTime())}
          </Text>
          <Text style={styles.titleText as any}>
            {reportDebt && reportDebt?.tong_cong_no > 0
              ? CommonUtils.convertNumber(reportDebt.tong_cong_no).toString()
              : 0}
          </Text>
        </View>
      </View>
      <FlatList
        // scrollEnabled={debtData.length > 1}
        showsVerticalScrollIndicator={false}
        bounces={false}
        initialNumToRender={8}
        removeClippedSubviews={true}
        data={debtData}
        renderItem={({item}) => renderDebtItem(item)}
      />
    </SafeAreaView>
  );
};
interface DebtProps {
  reportDebt?: {
    tong_cong_no: number;
    cong_no_den_ngay: number;
  };
  debtData: DebtDetailItemType[];
}
export default Debt;
const createStyleSheet = (theme: ExtendedTheme) =>
  StyleSheet.create({
    itemContainer: {
      paddingVertical: 16,
      borderColor: theme.colors.border,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    rowItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    titleText: {
      color: theme.colors.text_primary,
      fontSize: 16,
      fontWeight: '500',
    },
    headerContainer: {
      padding: 16,
      borderRadius: 12,
      // backgroundColor: theme.colors.bg_default,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
  });
