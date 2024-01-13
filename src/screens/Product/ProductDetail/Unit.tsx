import React from 'react';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@react-navigation/native';
import {StyleSheet, Text, View} from 'react-native';
import { IProduct } from '../../../models/types';

const Unit = ({data} :PropsType) => {
  const {t: getLabel} = useTranslation();
  const {colors} = useTheme();

  const styles = StyleSheet.create({
    item: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 16,
      // borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: colors.border,
    } as any,
    itemText: {
      color: colors.text_primary,
      fontWeight: '500',
    } as any,
  });

  return (
    <View
      style={{
        margin: 16,
        padding: 16,
        borderRadius: 16,
        backgroundColor: colors.bg_default,
      }}>
      <View style={[styles.item, {borderTopWidth: 0}]}>
        <Text style={styles.itemText}>{getLabel('unit')}</Text>
        <Text style={styles.itemText}>{getLabel('conversionRate')}</Text>
      </View>
      {data.unit.map((item,i) => (
        <View key={i} style={[styles.item , {borderBottomWidth : i === data.unit.length - 1 ? 0 : 1}]}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}>
            <Text style={styles.itemText}>{item.uom}</Text>
            {item.uom === data.stock_uom  &&(
              <View
                style={{
                  marginLeft: 16,
                  padding: 8,
                  borderRadius: 16,
                  borderColor: colors.border,
                  borderWidth: 1,
                }}>
                <Text style={{color: colors.primary}}>{getLabel('standUnit')}</Text>
              </View>
            )}

          </View>
          <Text style={styles.itemText}>{item.conversion_factor}</Text>
        </View>
      ))}
    </View>
  );
};

interface PropsType {
  data : IProduct
}

export default Unit;
