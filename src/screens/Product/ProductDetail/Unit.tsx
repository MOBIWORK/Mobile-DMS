import React from 'react';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@react-navigation/native';
import {StyleSheet, Text, View} from 'react-native';

const Unit = () => {
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
    },
    itemText: {
      color: colors.text_primary,
      fontWeight: '500',
    },
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
      <View style={[styles.item]}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}>
          <Text style={styles.itemText}>Cái</Text>
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
        </View>
        <Text style={styles.itemText}>1</Text>
      </View>
      <View style={styles.item}>
        <Text style={styles.itemText}>Hộp</Text>
        <Text style={styles.itemText}>2</Text>
      </View>
      <View style={[styles.item, {borderBottomWidth: 0}]}>
        <Text style={styles.itemText}>Thùng</Text>
        <Text style={styles.itemText}>20</Text>
      </View>
    </View>
  );
};
export default Unit;
