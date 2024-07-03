import {Platform, StyleSheet, TouchableOpacity, ViewStyle} from 'react-native';
import React from 'react';
import isEqual from 'react-fast-compare';
import {ErrorBoundary} from 'react-error-boundary';
import ErrorFallBack from '../../../layouts/ErrorFallBack';
import {Block, SvgIcon, AppText as Text} from '../../../components/common';
import {Address, Contact, ContactCard} from '../../../models/types';
import {AppTheme, useTheme} from '../../../layouts/theme';
import {useTranslation} from 'react-i18next';
import {formatPhoneNumber} from '../../../config/function';
import { navigate } from '../../../navigation/navigation-service';
import { ScreenConstant } from '../../../const';

type Props = CardListAddress | CardListContact;

type CardListAddress = {
  type: 'address';
  data: Address;
  onPress:(data:Address,type:'address') => void
};
type CardListContact = {
  type: 'contact';
  data: ContactCard;
  onPress:(data:ContactCard,type:'contact') => void

};

const CardChoose = (props: Props) => {
  const theme = useTheme();
  const styles = cardStyles(theme);
  const {t: getLabel} = useTranslation();

  // console.log(props.data)

  return (
    <>
      {props.type === 'address' ? (
        <TouchableOpacity style={styles.card} onPress={() => props.onPress(props.data,props.type)}>
          <Block paddingHorizontal={16}>
            <Block style={styles.containAddressLabel}>
              <Block direction="row" alignItems="center">
                <Block style={styles.containIcon}>
                  <SvgIcon source="MapPin" size={16} />
                  
                </Block>
                <Block>
                  {props.data.address_title.trim().length > 0    && (
                    <Text
                      numberOfLines={2}
                      fontSize={16}
                      fontWeight="300"
                      colorTheme="black"
                      lineHeight={21}>
                      {props.data.address_title.split(',', 4)[0].trim()}
                    </Text>
                  )}
                </Block>
                <Block>
                  {props.data.address_line1    && (
                    <Text
                      numberOfLines={2}
                      fontSize={16}
                      fontWeight="300"
                      colorTheme="black"
                      lineHeight={21}>
                      {props.data.address_line1}
                    </Text>
                  )}
                </Block>
              </Block>
              <Block>
                <SvgIcon source="RedEdit" size={16} />
              </Block>
            </Block>
          </Block>
          <Block style={styles.containAddress}>
            {props.data.is_primary_address === 1 && (
              <Block style={styles.addressGetAndOrder}>
                <Text
                  fontSize={14}
                  lineHeight={21}
                  fontWeight="400"
                  colorTheme="primary">
                  {getLabel('deliveryAddress')}
                </Text>
              </Block>
            )}
            {props.data.is_shipping_address === 1 && (
              <Block style={styles.addressGetAndOrder}>
                <Text
                  fontSize={14}
                  lineHeight={21}
                  fontWeight="400"
                  colorTheme="primary">
                  {getLabel('orderAddress')}
                </Text>
              </Block>
            )}
          </Block>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.card} onPress={() => props.onPress(props.data,props.type)}>
          <Block paddingHorizontal={16}>
            <Block style={styles.containAddressLabel}>
              <Text
                fontSize={16}
                fontWeight="400"
                colorTheme="black"
                lineHeight={21}>
                {props.data.first_name
                  ? props.data.first_name + '' + props.data.last_name
                  : '---'}
              </Text>
            </Block>
            <Block style={[styles.containAddressLabel, {paddingHorizontal: 4}]}>
              <Block style={styles.containIcon}>
                <SvgIcon source="MapPin" size={16} />
              </Block>
              <Text
                numberOfLines={2}
                fontSize={14}
                fontWeight="300"
                colorTheme="black"
                lineHeight={21}>
                {`${props.data.address ? `${props.data.address}, ` : ''}`}
              </Text>
            </Block>
            <Block style={[styles.containAddressLabel, {paddingHorizontal: 4}]}>
              <Block style={styles.containIcon}>
                <SvgIcon source="Phone" size={16} />
              </Block>
              <Text
                numberOfLines={2}
                fontSize={14}
                fontWeight="300"
                colorTheme="black"
                lineHeight={21}>
                {props.data.phone != null
                  ? formatPhoneNumber(props.data.phone)
                  : '---'}
              </Text>
            </Block>
            <Block style={styles.containMain}>
              <Block style={styles.addressGetAndOrder}>
                <Text
                  fontSize={14}
                  lineHeight={21}
                  fontWeight="400"
                  colorTheme="primary">
                  {getLabel('mainContact')}
                </Text>
              </Block>
            </Block>
          </Block>
        </TouchableOpacity>
      )}
    </>
  );
};

export default React.memo(CardChoose, isEqual);

const cardStyles = (theme: AppTheme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.white,
      shadowColor: theme.colors.text_disable,
      borderRadius: 16,
      paddingVertical: 12,
      marginHorizontal: 2,
      marginVertical: 10,
      marginBottom: 20,
      ...Platform.select({
        ios: {
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.25,
          shadowRadius: 1.23,
          elevation: 1,
        },
        android: {
          elevation: 8,
          shadowRadius: 1.4,
        },
      }),
    } as ViewStyle,
    containAddressLabel: {
      flexDirection: 'row',
      alignContent: 'center',
      marginBottom: 4,
      // justifyContent: 'space-between',
      paddingHorizontal: 8,
    } as ViewStyle,
    containIcon: {
      paddingTop: 4,
      marginRight: 4,
    } as ViewStyle,
    containAddress: {
      flexDirection: 'row',
      marginLeft: 16,
      alignContent: 'center',
      marginTop: 10,
    } as ViewStyle,
    addressGetAndOrder: {
      marginRight: 8,
      backgroundColor: theme.colors.bg_default,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: theme.colors.border,
      paddingVertical: 3,
      borderRadius: 16,
    } as ViewStyle,
    containMain: {
      marginLeft: 8,
      alignContent: 'center',
      flexDirection: 'row',
      marginTop: 4,
    } as ViewStyle,
  });
