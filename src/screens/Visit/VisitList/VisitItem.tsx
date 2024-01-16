import React, {FC} from 'react';
import {VisitListItemType} from '../../../models/types';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {ImageAssets} from '../../../assets';
import {AppButton} from '../../../components/common';
import {ExtendedTheme, useTheme} from '@react-navigation/native';
import { navigate} from '../../../navigation';
import {ScreenConstant} from '../../../const';
import { dispatch } from '../../../utils/redux';
import { appActions } from '../../../redux-store/app-reducer/reducer';
import { useDispatch } from 'react-redux';



const VisitItem: FC<VisitItemProps> = ({item, handleClose}) => {
  const {colors} = useTheme();
  const styles = createStyleSheet(useTheme());
  const theme = useTheme()
  const dispatch = useDispatch()
  


  const onPressCheckIn = (item:VisitListItemType) =>{
    // dispatch(appActions.onCheckIn(item));
    dispatch(appActions.onGetLost(0))
    dispatch(appActions.onSetAppTheme('default'))
    navigate(ScreenConstant.CHECKIN,{item})
  }


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
    <Pressable
      onPress={() =>
        navigate(ScreenConstant.VISIT_DETAIL, {data: item})
      }>
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
            onPress={() => onPressCheckIn(item)}
            style={createStyleSheet(theme).button(item.status)}
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
            <Text
              style={{color: colors.action, textDecorationLine: 'underline'}}>
              {item.distance}km
            </Text>
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

const createStyleSheet = (theme: ExtendedTheme) =>
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
    } as ViewStyle,
    content: {
      marginRight: 8,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
    } as ViewStyle,
    button:(itemStatus:boolean) =>({
      backgroundColor: itemStatus
      ? theme.colors.bg_neutral
      : theme.colors.bg_default,
    borderColor: !itemStatus ? theme.colors.action : undefined,
    borderWidth: !itemStatus ? 1 : 0,
    alignItems:'center',
    justifyContent:'center'
    }) as ViewStyle
  });
