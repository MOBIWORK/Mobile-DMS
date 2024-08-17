import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import React from 'react';
import {AppTheme, useTheme} from '../../../layouts/theme';

import {AppIcons, AppText} from '../../../components/common';
import {AppConstant} from '../../../const';
import {useTranslation} from 'react-i18next';
import isEqual from 'react-fast-compare';
import {DetailCustomerType} from '../../../models/types';
import {SafeAreaView} from 'react-native-safe-area-context';
import CardContactOverview from '../component/CardView';
import CardContactView from '../component/CardContactView';

type Props = {
  onPressAdding: () => void;
  data: DetailCustomerType;
  onPressCard: (data: any, type: string, screen: any) => void;
};

const Contact = (props: Props) => {
  const {onPressAdding, onPressCard} = props;
  const theme = useTheme();
  const styles = rootStyles(theme);
  const {t: getLabel} = useTranslation();

  return (
    <SafeAreaView style={styles.root} edges={['bottom']}>
      <View style={styles.containLabel}>
        <AppText fontSize={14} fontWeight="400" colorTheme="text_secondary">
          {getLabel('listContact')}
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
      {props.data?.contacts && props.data.contacts?.length > 0 ? (
        <FlatList
          data={
            props.data.contacts.length === 1
              ? props.data.contacts.map(item => ({
                  ...item,
                  is_primary_contact: 1,
                  is_billing_contact: 0,
                }))
              : props.data.contacts
          }
          keyExtractor={(item, index) => `${item.name} + ${index}`}
          showsVerticalScrollIndicator={false}
          initialNumToRender={10}
          windowSize={11}
          maxToRenderPerBatch={10}
          decelerationRate={'fast'}
          renderItem={({item}) => {
            return (
              <CardContactView
                data={item}
                mobileNo={item?.phone}
                onPressCard={onPressCard}
                primary={props.data.customer_primary_contact || ''}
              />
            );
          }}
        />
      ) : props.data != null && props.data?.customer_primary_contact != null ? (
        <CardContactOverview data={props.data} />
      ) : null}
    </SafeAreaView>
  );
};

export default React.memo(Contact, isEqual);

const rootStyles = (theme: AppTheme) =>
  StyleSheet.create({
    root: {
      paddingHorizontal: 16,
      backgroundColor: theme.colors.bg_neutral,
      flex: 1,
      // backgroundColor:'red',
      // flex:1
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
