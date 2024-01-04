import React, {FC} from 'react';
import {FlatList, Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {ExtendedTheme, useTheme} from '@react-navigation/native';
import {CommonUtils} from '../../../../utils';
import {ImageAssets} from '../../../../assets';
import {ReportDebtListType, ReportDebtType} from '../../../../models/types';

const Debt: FC<DebtProps> = ({debtData}) => {
  const theme = useTheme();
  const styles = createStyleSheet(theme);

  const renderDebtItem = (item: ReportDebtListType, index: number) => {
    return (
      <Pressable
        style={[
          styles.itemContainer as any,
          {borderBottomWidth: index !== debtData.listDebt.length - 1 ? 1 : 0},
        ]}>
        <View style={{maxWidth: '70%', rowGap: 10}}>
          <View style={styles.rowItem as any}>
            <Image
              source={ImageAssets.CalenderIcon}
              style={{width: 20, height: 20}}
              resizeMode={'cover'}
              tintColor={theme.colors.text_primary}
            />
            <Text style={[styles.titleText as any, {marginLeft: 8}]}>
              {item.dateTime}
            </Text>
          </View>
          <Text style={{color: theme.colors.text_secondary}}>
            {item.description}
          </Text>
        </View>
        <Text style={styles.titleText as any}>
          {CommonUtils.convertNumber(item.numberDebt)}
        </Text>
      </Pressable>
    );
  };

  return (
    <View style={{marginTop: 32}}>
      <View style={styles.headerContainer as any}>
        <Text style={{color: theme.colors.text_primary}}>Tổng tiền nợ</Text>
        <Text style={styles.titleText as any}>
          {CommonUtils.convertNumber(7000000).toString()}
        </Text>
      </View>
      <View style={styles.listContainer as any}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={debtData.listDebt}
          renderItem={({item, index}) => renderDebtItem(item, index)}
        />
      </View>
    </View>
  );
};
interface DebtProps {
  debtData: ReportDebtType;
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
      backgroundColor: theme.colors.bg_default,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    listContainer: {
      borderRadius: 16,
      marginTop: 16,
      backgroundColor: theme.colors.bg_default,
      paddingHorizontal: 16,
      maxHeight: '85%',
    },
  });
