import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import React from 'react';
import {AppTheme, useTheme} from '../../../layouts/theme';
import {MainLayout} from '../../../layouts';
import {AppIcons, AppText} from '../../../components/common';
import {AppConstant} from '../../../const';
import {useTranslation} from 'react-i18next';
import isEqual from 'react-fast-compare';
import {DetailCustomerType, IDataCustomers} from '../../../models/types';
import {SafeAreaView} from 'react-native-safe-area-context';

import CardAddressView from '../component/CardAddressView';

type Props = {
  onPressAdding: () => void;
  data: DetailCustomerType;
  listData:any[],
};

const Address = (props: Props) => {
  const {onPressAdding} = props;
  const theme = useTheme();
  const styles = rootStyles(theme);
  const {t: getLabel} = useTranslation();

  return (
    <SafeAreaView style={styles.root} edges={['bottom']}>
      <View style={styles.containLabel}>
        <AppText fontSize={14} fontWeight="400" colorTheme="text_secondary">
          {getLabel('listAddress')}
        </AppText>
        <TouchableOpacity style={styles.containButton} onPress={onPressAdding}>
          <AppIcons
            iconType={AppConstant.ICON_TYPE.AntIcon}
            name="plus"
            size={16}
            color={theme.colors.action}
          />
        </TouchableOpacity>
      </View>
      {props.data != null &&
      props.data.address &&
      props.data.address != null &&
      props.data.address.length > 0 ? (
        <FlatList
          data={props.data.address}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          decelerationRate={'fast'}
          initialNumToRender={10}
          windowSize={11}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          renderItem={({item}) => {
            return (
              <CardAddressView
                type="list"
                data={item as any}
                primary_address={
                  props.data != null &&
                  props.data?.customer_primary_address != null
                    ? props.data.customer_primary_address
                    : ''
                }
              />
            );
          }}
        />
      ) : (
        <CardAddressView
          type="single"
          data={
            props.data != null && props.data?.customer_primary_address != null
              ? props.data.customer_primary_address
              : ''
          }
        />
      )}
    </SafeAreaView>
  );
};

export default React.memo(Address, isEqual);

const rootStyles = (theme: AppTheme) =>
  StyleSheet.create({
    root: {
      // paddingTop: 10,
      flex: 1,
      paddingHorizontal: 16,
      backgroundColor: theme.colors.bg_neutral,
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
