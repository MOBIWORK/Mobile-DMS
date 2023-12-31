import React, {FC} from 'react';
import {VisitListItemType} from '../../../models/types';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {ImageAssets} from '../../../assets';
import {AppButton} from '../../../components/common';
import {useTheme} from '@react-navigation/native';

const VisitItem: FC<VisitItemProps> = ({item, handleClose}) => {
  const {colors} = useTheme();

  const styles = StyleSheet.create({
    viewContainer: {
      marginVertical: 8,
      padding: 16,
      borderRadius: 16,
      backgroundColor: colors.bg_default,
      rowGap: 8,
    },
    user: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottomWidth: 1,
      borderColor: colors.divider,
      paddingBottom: 16,
    },
    userLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    userTextLeft: {
      color: colors.text_primary,
      fontWeight: '500',
      fontSize: 16,
      marginLeft: 8,
    },
    content: {
      marginRight: 8,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
  });

  const statusItem = (status: boolean) => {
    return (
      <View
        style={{
          padding: 8,
          borderRadius: 10,
          backgroundColor: status
            ? 'rgba(34, 197, 94, 0.08)'
            : 'rgba(255, 171, 0, 0.08)',
        }}>
        <Text style={{color: status ? colors.success : colors.warning}}>
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
              style={{width: 24, height: 24}}
              resizeMode={'cover'}
              tintColor={item.status ? colors.success : colors.warning}
            />
            <Text style={styles.userTextLeft}>{item.label}</Text>
          </View>
          {statusItem(item.status)}
        </View>
        <View style={styles.content}>
          <Image
            source={ImageAssets.MapPinIcon}
            style={{width: 16, height: 16}}
            resizeMode={'cover'}
            tintColor={colors.text_primary}
          />
          <Text
            style={{color: colors.text_primary, marginHorizontal: 8}}
            numberOfLines={1}
            ellipsizeMode={'tail'}>
            {item.address}
          </Text>
        </View>
        <View style={styles.content}>
          <Image
            source={ImageAssets.PhoneIcon}
            style={{width: 16, height: 16}}
            resizeMode={'cover'}
            tintColor={colors.text_primary}
          />
          <Text style={{color: colors.text_primary, marginHorizontal: 8}}>
            {item.phone_number}
          </Text>
        </View>
        <View
          style={[
            styles.content,
            {marginTop: 8, justifyContent: 'space-between'},
          ]}>
          <AppButton
            onPress={() => console.log('handle Checkin')}
            style={{
              backgroundColor: item.status
                ? colors.bg_neutral
                : colors.bg_default,
              borderColor: !item.status ? colors.action : undefined,
              borderWidth: !item.status ? 1 : 0,
            }}
            label={'Checkin'}
            styleLabel={{
              color: !item.status ? colors.action : colors.text_disable,
              fontWeight: '400',
            }}
          />
          <TouchableOpacity
            onPress={() => console.log('handle Map')}
            style={styles.content}>
            <Image
              source={ImageAssets.SendIcon}
              style={{width: 16, height: 16}}
              resizeMode={'cover'}
              tintColor={colors.action}
            />
            <Text style={{color: colors.action}}>{item.distance}km</Text>
          </TouchableOpacity>
        </View>
        {handleClose && (
          <TouchableOpacity
            onPress={handleClose}
            style={{position: 'absolute', top: -12, right: -12}}>
            <Image
              source={ImageAssets.CloseFameIcon}
              style={{width: 32, height: 32}}
              resizeMode={'contain'}
            />
          </TouchableOpacity>
        )}
      </View>
    </Pressable>
  );
};
interface VisitItemProps {
  item: VisitListItemType;
  handleClose?: () => void;
}

export default VisitItem;
