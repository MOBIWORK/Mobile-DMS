import React, {FC} from 'react';
import {ItemNoteVisitDetail, VisitListItemType} from '../../../models/types';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import {useNavigation, useTheme} from '@react-navigation/native';
import {ImageAssets} from '../../../assets';
import {AppButton} from '../../../components/common';
import {CommonUtils} from '../../../utils';
import StatisticalItem from './StatisticalItem';
import {NavigationProp} from '../../../navigation';
import {ScreenConstant} from '../../../const';

const Detail: FC<VisitItemProps> = ({item}) => {
  const {colors} = useTheme();
  const navigation = useNavigation<NavigationProp>();

  const styles = StyleSheet.create({
    viewContainer: {
      marginVertical: 8,
      padding: 16,
      borderRadius: 16,
      backgroundColor: colors.bg_default,
      rowGap: 8,
    } as ViewStyle,
    user: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottomWidth: 1,
      borderColor: colors.divider,
      paddingBottom: 16,
    } as ViewStyle,
    userLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
    } as ViewStyle,
    userTextLeft: {
      color: colors.text_primary,
      fontWeight: '500',
      fontSize: 16,
      marginLeft: 8,
    } as TextStyle,
    content: {
      marginRight: 8,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
    } as ViewStyle,
    infoContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
    } as ViewStyle,
    infoText: {
      marginLeft: 8,
      color: colors.text_primary,
      fontSize: 16,
      fontWeight: '500',
    } as TextStyle,
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

  const infoItem = (isLastOrder: boolean, label: string) => {
    return (
      <>
        <View style={styles.infoContainer}>
          <Image
            source={
              isLastOrder ? ImageAssets.BoxIcon : ImageAssets.MapPinUserIcon
            }
            style={{width: 24, height: 24}}
            resizeMode={'contain'}
            tintColor={isLastOrder ? colors.action : colors.main}
          />
          <Text style={styles.infoText}>
            {isLastOrder ? 'Đơn hàng lần cuối' : 'Viếng thăm lần cuối'}
          </Text>
        </View>
        <Text
          style={{color: colors.text_secondary, fontSize: 16, marginLeft: 32}}>
          {label}
        </Text>
      </>
    );
  };

  const _renderCustomer = () => {
    return (
      <View style={[styles.viewContainer, {marginTop: 16}]}>
        <View style={styles.user}>
          <View style={styles.userLeft}>
            <Image
              source={ImageAssets.UserGroupIcon}
              style={{width: 24, height: 24}}
              resizeMode={'cover'}
              tintColor={item.is_checkin ? colors.success : colors.warning}
            />
            <Text style={styles.userTextLeft}>{item.customer_name}</Text>
          </View>
          {statusItem(item.is_checkin)}
        </View>
        <View style={styles.content}>
          <Image
            source={ImageAssets.UserCircle}
            style={{width: 16, height: 16}}
            resizeMode={'cover'}
            tintColor={colors.text_primary}
          />
          <Text style={{color: colors.text_primary, marginHorizontal: 8}}>
            {item.name}
          </Text>
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
            {item.customer_primary_address}
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
            {item.mobile_no ?? '---'}
          </Text>
        </View>
      </View>
    );
  };

  const _renderInfo = () => {
    return (
      <View style={styles.viewContainer}>
        {infoItem(true, 'Phương Huyền - 17/11/2023, 11:00')}
        {infoItem(false, 'Phương Huyền - 17/11/2023, 11:00')}
      </View>
    );
  };

  const _renderNoteItem = (item: ItemNoteVisitDetail, index: number) => {
    return (
      <View
        style={{
          paddingVertical: 16,
          borderBottomWidth: index !== NoteData.length - 1 ? 1 : 0,
          borderColor: colors.border,
        }}>
        <Text
          style={{color: colors.text_primary, fontSize: 16, fontWeight: '500'}}>
          {item.noteType}
        </Text>
        <View style={[styles.infoContainer, {marginVertical: 4}]}>
          <Image
            source={ImageAssets.NoticeIcon}
            style={{width: 16, height: 16}}
            resizeMode={'cover'}
          />
          <Text style={{color: colors.text_secondary, marginLeft: 4}}>
            {item.description}
          </Text>
        </View>
        <View style={styles.infoContainer}>
          <Image
            source={ImageAssets.ClockIcon}
            style={{width: 16, height: 16}}
            resizeMode={'cover'}
          />
          <Text style={{color: colors.text_secondary, marginLeft: 4}}>
            {item.time}, {item.date}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <>
      {item.is_checkin && (
        <StatisticalItem orderCount={15} payment={10000000} />
      )}
      {_renderCustomer()}
      {_renderInfo()}
      {!item.is_checkin ? (
        <AppButton
          style={{
            backgroundColor: colors.action,
            width: '30%',
            marginTop: 16,
            alignSelf: 'center',
          }}
          label={'Checkin'}
          onPress={() => navigation.navigate(ScreenConstant.CHECKIN, {item})}
        />
      ) : (
        <View style={{marginTop: 16}}>
          <Text style={{color: colors.text_secondary, fontSize: 16}}>
            Ghi chú
          </Text>
          <View style={[styles.viewContainer, {paddingVertical: 0}]}>
            <FlatList
              data={NoteData}
              renderItem={({item, index}) => _renderNoteItem(item, index)}
            />
          </View>
        </View>
      )}
    </>
  );
};
interface VisitItemProps {
  item: VisitListItemType;
}

export default Detail;

const NoteData: ItemNoteVisitDetail[] = [
  {
    noteType: 'Loại ghi chú',
    description: 'Mô tả ghi chú',
    content:
      'Ghi chú cho đơn hàng ngày 20/12/2023 Unleash your professional potential with Wordtune GenAI tools for work. Busy professionals have tons of work to get through. Some accept the frustration while others choose Wordtune to speed up their tasks.',
    time: '10:20:00',
    date: '21/11/2023',
  },
  {
    noteType: 'Loại ghi chú',
    description: 'Mô tả ghi chú',
    content:
      'Ghi chú cho đơn hàng ngày 20/12/2023 Unleash your professional potential with Wordtune GenAI tools for work. Busy professionals have tons of work to get through. Some accept the frustration while others choose Wordtune to speed up their tasks.',
    time: '10:20:00',
    date: '21/11/2023',
  },
  {
    noteType: 'Loại ghi chú',
    description: 'Mô tả ghi chú',
    content:
      'Ghi chú cho đơn hàng ngày 20/12/2023 Unleash your professional potential with Wordtune GenAI tools for work. Busy professionals have tons of work to get through. Some accept the frustration while others choose Wordtune to speed up their tasks.',
    time: '10:20:00',
    date: '21/11/2023',
  },
  {
    noteType: 'Loại ghi chú',
    description: 'Mô tả ghi chú',
    content:
      'Ghi chú cho đơn hàng ngày 20/12/2023 Unleash your professional potential with Wordtune GenAI tools for work. Busy professionals have tons of work to get through. Some accept the frustration while others choose Wordtune to speed up their tasks.',
    time: '10:20:00',
    date: '21/11/2023',
  },
];
