import React, {FC, useTransition} from 'react';
import {ItemNoteVisitDetail, IVisitRouteDetail} from '../../../models/types';
import {
  Image,
  ScrollView,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {ImageAssets} from '../../../assets';
import {AppButton, Block, AppText as Text} from '../../../components/common';
import StatisticalItem from './StatisticalItem';
import {NavigationProp} from '../../../navigation/screen-type';
import {AppConstant, ScreenConstant} from '../../../const';
import {useTranslation} from 'react-i18next';
import {CommonUtils} from '../../../utils';
import {shallowEqual, useDispatch} from 'react-redux';
import {appActions} from '../../../redux-store/app-reducer/reducer';
import {SafeAreaView} from 'react-native-safe-area-context';
import isEqual from 'react-fast-compare';
import {AppTheme, useTheme} from '../../../layouts/theme';
import {DMSConfigMobile} from '../../../services/appService';
import {calculateDistance, useSelector} from '../../../config/function';
import {LocationProps} from '../VisitList/VisitItem';
import {ObjectId} from 'bson';

const Detail: FC<VisitItemProps> = ({item, otherInfo}) => {
  const {colors} = useTheme();
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const {t: getLabel} = useTranslation();
  const dispatch = useDispatch();
  const styles = rootStyles(theme);
  const [isPending, startEffect] = useTransition();
  let location = React.useRef<LocationProps>(
    JSON.parse(item.customer_location_primary!),
  ).current;

  const systemConfig: DMSConfigMobile = useSelector(
    state => state.app.systemConfig,
    shallowEqual,
  );
  const NoteData = React.useRef<ItemNoteVisitDetail[]>([
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
  ]).current;

  const statusItem = (status: boolean) => {
    return (
      <Block
        padding={8}
        borderRadius={10}
        color={status ? 'rgba(34, 197, 94, 0.08)' : 'rgba(255, 171, 0, 0.08)'}>
        <Text
          fontSize={12}
          fontWeight="500"
          colorTheme={status ? 'success' : 'warning'}>
          {status ? getLabel('visited') : getLabel('notVisited')}
        </Text>
      </Block>
    );
  };

  const infoItem = React.useCallback((isLastOrder: boolean, label: string) => {
    return (
      <Block>
        <Block style={styles.infoContainer}>
          <Image
            source={
              isLastOrder ? ImageAssets.BoxIcon : ImageAssets.MapPinUserIcon
            }
            style={{width: 24, height: 24}}
            resizeMode={'contain'}
            tintColor={isLastOrder ? colors.action : colors.main}
          />
          <Text style={styles.infoText}>
            {isLastOrder ? getLabel('lastOrder') : getLabel('lastVisit')}
          </Text>
        </Block>
        <Text
          style={{color: colors.text_secondary, fontSize: 16, marginLeft: 32}}>
          {label}
        </Text>
      </Block>
    );
  }, []);

  const _renderCustomer = React.useCallback(() => {
    return (
      <Block style={[styles.viewContainer]} marginTop={16}>
        <Block style={styles.user}>
          <Block style={styles.userLeft}>
            <Image
              source={ImageAssets.UserGroupIcon}
              style={{width: 24, height: 24}}
              resizeMode={'cover'}
              tintColor={item?.is_checkin ? colors.success : colors.warning}
            />
            <Text style={styles.userTextLeft}>{item.customer_name}</Text>
          </Block>
          {statusItem(item?.is_checkin)}
        </Block>
        <Block style={styles.content}>
          <Image
            source={ImageAssets.UserCircle}
            style={{width: 16, height: 16}}
            resizeMode={'cover'}
            tintColor={colors.text_primary}
          />
          <Text style={{color: colors.text_primary, marginHorizontal: 8}}>
            {item.name}
          </Text>
        </Block>
        <Block style={styles.content}>
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
            {item?.customer_primary_address?.address_title ?? '---'}
          </Text>
        </Block>
        <Block style={styles.content}>
          <Image
            source={ImageAssets.PhoneIcon}
            style={{width: 16, height: 16}}
            resizeMode={'cover'}
            tintColor={colors.text_primary}
          />
          <Text style={{color: colors.text_primary, marginHorizontal: 8}}>
            {item.mobile_no === null ? '---' : item.mobile_no}
          </Text>
        </Block>
      </Block>
    );
  }, [item]);

  const _renderInfo = React.useCallback(() => {
    return (
      <Block style={styles.viewContainer}>
        {infoItem(
          true,
          otherInfo?.don_hang_cuoi
            ? `${otherInfo.nv_dat_hang} - ${CommonUtils.convertDate(
                otherInfo.don_hang_cuoi,
              )}, ${CommonUtils.formatTime2(otherInfo.don_hang_cuoi)}`
            : getLabel('noOrder'),
        )}
        {infoItem(
          false,
          otherInfo?.vieng_tham_cuoi
            ? `${otherInfo.nv_vieng_tham} - ${CommonUtils.convertDate(
                otherInfo.vieng_tham_cuoi,
              )}, ${CommonUtils.formatTime2(otherInfo.vieng_tham_cuoi)}`
            : getLabel('noVisit'),
        )}
      </Block>
    );
  }, [otherInfo]);

  const _renderNoteItem = React.useCallback(
    (item: ItemNoteVisitDetail, index: number) => {
      return (
        <Block
          key={index}
          paddingVertical={16}
          borderBottomWidth={index !== NoteData.length - 1 ? 1 : 0}
          borderColor={colors.border}>
          <Text colorTheme="text_primary" fontSize={16} fontWeight="500">
            {item.noteType}
          </Text>
          <Block style={[styles.infoContainer]} marginVertical={4}>
            <Image
              source={ImageAssets.NoticeIcon}
              style={{width: 16, height: 16}}
              resizeMode={'cover'}
            />
            <Text style={{color: colors.text_secondary, marginLeft: 4}}>
              {item.description}
            </Text>
          </Block>
          <Block style={styles.infoContainer}>
            <Image
              source={ImageAssets.ClockIcon}
              style={{width: 16, height: 16}}
              resizeMode={'cover'}
            />
            <Text style={{color: colors.text_secondary, marginLeft: 4}}>
              {item.time}, {item.date}
            </Text>
          </Block>
        </Block>
      );
    },
    [item],
  );

  const distance = React.useMemo(() => {
    let res: any;
    startEffect(() => {
      CommonUtils.getCurrentLocation(curLocation => {
        res = calculateDistance(
          curLocation.coords.latitude,
          curLocation.coords.longitude,
          location?.lat,
          location?.long,
        );
      });
    });
    return res;
  }, []);

  return (
    <SafeAreaView style={{flex: 1}} edges={['top', 'bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* {item?.is_checkin && (
          <StatisticalItem
            orderCount={otherInfo?.so_don_trong_thang ?? 0}
            payment={otherInfo?.doanh_thu_thang ?? 0}
          />
        )} */}
        {_renderCustomer()}
        {_renderInfo()}
        {!item.is_checkin &&
        distance * 1000 <=
          systemConfig.saiso_chophep_kb_vitringoaisaiso +
            AppConstant.additional_distance ? (
          <AppButton
            style={styles.button as any}
            label={'Checkin'}
            onPress={() => {
              navigation.navigate(ScreenConstant.CHECKIN, {item});
              dispatch(appActions.setDataCheckIn(item));
            }}
          />
        ) : (
          <View style={{marginTop: 16}}>
            <Text style={{color: colors.text_secondary, fontSize: 16}}>
              Ghi chú
            </Text>
            <View style={[styles.viewContainer, {paddingVertical: 0}]}>
              {NoteData.map((item, index) => _renderNoteItem(item, index))}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
interface VisitItemProps {
  item: any;
  otherInfo: IVisitRouteDetail | undefined;
}

export default React.memo(Detail, isEqual);

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
      color: theme.colors.text_primary,
      fontSize: 16,
      fontWeight: '500',
    } as TextStyle,
    root: {},
    button: {
      backgroundColor: theme.colors.action,
      width: '30%',
      marginTop: 16,
      alignSelf: 'center',
    },
  });
