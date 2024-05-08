import {Platform, StyleSheet, TextStyle, ViewStyle} from 'react-native';
import React from 'react';
import {Block, AppText as Text, SvgIcon} from '../../../components/common';
import {AppTheme, useTheme} from '../../../layouts/theme';
import {useTranslation} from 'react-i18next';
import isEqual from 'react-fast-compare';
import {formatPhoneNumber} from '../../../config/function';
import {Contact} from '../../../models/types';

type Props = {
  data: Contact;
};

const CardContactView = (props: Props) => {
  const theme = useTheme();
  const styles = rootStyles(theme);
  const {t: getLabel} = useTranslation();

  return (
    <Block style={styles.card}>
      <Block style={styles.rootLayout}>
        <Text
          fontSize={16}
          fontWeight="500"
          lineHeight={24}
          style={styles.labelText}>
          {props.data.first_name}
        </Text>

        <Block style={styles.labelView}>
          <SvgIcon source="Phone" size={18} />
          <Text numberOfLines={1}>
            {' '}
            {props.data?.phone != null
              ? formatPhoneNumber(props.data?.phone)
              : '---'}
          </Text>
        </Block>
      </Block>
      {props.data.is_billing_contact && (
        <Block style={styles.containAddress}>
          <Block style={styles.mainContact}>
            <Text fontSize={14} fontWeight="400" colorTheme="primary">
              {getLabel('addressDelivery')}
            </Text>
          </Block>
        </Block>
      )}
      {props.data.is_primary_contact && (
        <Block style={styles.containAddress}>
          <Block style={styles.mainContact}>
            <Text fontSize={14} fontWeight="400" colorTheme="primary">
              {getLabel('mainContact')}
            </Text>
          </Block>
        </Block>
      )}
    </Block>
  );
};

export default React.memo(CardContactView, isEqual);

const rootStyles = (theme: AppTheme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.white,
      shadowColor: theme.colors.text_disable,
      borderRadius: 16,
      // borderWidth: 0.1,
      paddingVertical: 12,
      marginVertical: 8,
      marginBottom: 20,
      ...Platform.select({
        ios: {
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.2,
          shadowRadius: 1.23,
          elevation: 2,
        },
        android: {
          elevation: 4,
          shadowRadius: 6.4,
        },
      }),
    } as ViewStyle,
    labelText: {
      paddingLeft: 8,
    } as TextStyle,
    labelView: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      marginVertical: 8,
      marginHorizontal: 10,
    } as ViewStyle,
    mainContact: {
      marginRight: 8,
      backgroundColor: theme.colors.bg_default,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 16,
      paddingVertical: 3,
    } as ViewStyle,
    rootLayout: {
      marginHorizontal: 8,
    } as ViewStyle,
    containAddress: {
      flexDirection: 'row',
      marginLeft: 16,
      alignContent: 'center',
      marginTop: 10,
    } as ViewStyle,
  });
