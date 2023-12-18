import React, {FC} from 'react';
import {VisitListItemType} from '../../models/types';
import {
  Image,
  ImageStyle,
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {ImageAssets} from '../../assets';
import {AppButton} from '../../components/common';

import {AppTheme, useTheme} from '../../layouts/theme';

const VisitItem: FC<VisitItemProps> = ({item}) => {
  const theme = useTheme();
  const styles = rootStyles(theme);

  const statusItem = (status: boolean) => {
    return (
      <View style={styles.statusItem(status)}>
        <Text style={styles.textVisit(status)}>
          {status ? 'Đã viếng thăm' : 'Chưa viếng thăm'}
        </Text>
      </View>
    );
  };

  return (
    <Pressable>
      <View style={styles.viewContainer}>
        <View style={styles.user}>
          <View style={styles.userLeft}>
            <Image
              source={ImageAssets.UserGroupIcon}
              style={styles.iconStyle(24)}
              resizeMode={'cover'}
              tintColor={
                item.status ? theme.colors.success : theme.colors.warning
              }
            />
            <Text style={styles.userTextLeft}>{item.label}</Text>
          </View>
          {statusItem(item.status)}
        </View>
        <View style={styles.content}>
          <Image
            source={ImageAssets.MapPinIcon}
            style={styles.iconStyle(16)}
            resizeMode={'cover'}
            tintColor={theme.colors.text_primary}
          />
          <Text
            style={{color: theme.colors.text_primary, marginHorizontal: 8}}
            numberOfLines={1}
            ellipsizeMode={'tail'}>
            {item.address}
          </Text>
        </View>
        <View style={styles.content}>
          <Image
            source={ImageAssets.PhoneIcon}
            style={styles.iconStyle(16)}
            resizeMode={'cover'}
            tintColor={theme.colors.text_primary}
          />
          <Text style={{color: theme.colors.text_primary, marginHorizontal: 8}}>
            {item.phone_number}
          </Text>
        </View>
        <View style={styles.content}>
          <AppButton
            onPress={() => console.log('handle Checkin')}
            style={styles.handleCheckin(item.status)}
            label={'Checkin'}
            styleLabel={styles.itemLabel(item.status)}
          />
          <TouchableOpacity
            onPress={() => console.log('handle Map')}
            style={styles.content}>
            <Image
              source={ImageAssets.SendIcon}
              style={styles.iconStyle(16)}
              resizeMode={'cover'}
              tintColor={theme.colors.action}
            />
            <Text style={styles.textDistance}>{item.distance}km</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Pressable>
  );
};
interface VisitItemProps {
  item: VisitListItemType;
}

export default VisitItem;
const rootStyles = (theme: AppTheme) =>
  StyleSheet.create({
    viewContainer: {
      marginVertical: 8,
      padding: 16,
      borderRadius: 16,
      backgroundColor: theme.colors.bg_default,
      rowGap: 8,
    } as ViewStyle,
    user: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottomWidth: 1,
      borderColor: theme.colors.divider,
      paddingBottom: 16,
    } as ViewStyle,
    userLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
    } as ViewStyle,
    userTextLeft: {
      color: theme.colors.text_primary,
      fontWeight: '500',
      fontSize: 16,
      marginLeft: 8,
    } as TextStyle,
    content: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 8,
    } as ViewStyle,
    textDistance: {
      color: theme.colors.action,
      textDecorationLine: 'underline',
    } as TextStyle,
    handleCheckin: (status: any) => ({
      backgroundColor: status
        ? theme.colors.bg_neutral
        : theme.colors.bg_default,
      borderColor: status ? theme.colors.action : undefined,
      borderWidth: status ? 1 : 0,
    }),
    statusItem: (status: boolean) =>
      ({
        padding: 8,
        borderRadius: 10,
        backgroundColor: status
          ? theme.colors.green01
          : theme.colors.yellow_100,
      } as ViewStyle),
    itemLabel: (status: boolean) =>
      ({
        color: !status ? theme.colors.action : theme.colors.text_disable,
        fontWeight: '400',
      } as TextStyle),
    iconStyle: (size: number) => ({width: size, height: size} as ImageStyle),
    textVisit: (status: boolean) =>
      ({
        color: status ? theme.colors.success : theme.colors.warning,
      } as TextStyle),
  });
