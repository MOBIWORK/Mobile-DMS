import React, { FC, useEffect, useRef, useState } from 'react';
import { MainLayout } from '../../../layouts';
import ReportHeader from '../Component/ReportHeader';
import {Image,StyleSheet,Text,TextStyle,TouchableOpacity,View,ViewStyle} from 'react-native';
import { ImageAssets } from '../../../assets';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { AppContainer, SvgIcon } from '../../../components/common';
import { KeyAbleProps, ReportTravelDiaryType } from '../../../models/types';
import { CommonUtils } from '../../../utils';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import BottomSheet from '@gorhom/bottom-sheet';
import { IFilterType } from '../../../components/common/FilterListComponent';
import ReportFilterBottomSheet from '../Component/ReportFilterBottomSheet';
import { ReportService } from '../../../services';
import { dispatch } from '../../../utils/redux';
import { appActions } from '../../../redux-store/app-reducer/reducer';


const TravelDiary = () => {

  const theme = useTheme();
  const styles = createStyle(theme);
  const { bottom } = useSafeAreaInsets();
  const { t: getLabel } = useTranslation();

  const filerBottomSheetRef = useRef<BottomSheet>(null);
  const [date, setDate] = useState<any>(new Date());
  const [data, setData] = useState<ReportTravelDiaryType[]>([]);
  const [headerDate, setHeaderDate] = useState<string>(
    `${getLabel('today')}, ${CommonUtils.convertDate(new Date().getTime())}`,
  );

  const onChangeHeaderDate = (item: IFilterType) => {
    if (CommonUtils.isNumber(item.value)) {
      setDate(item.value)
      const newDateLabel = CommonUtils.isToday(Number(item.value))
        ? `${getLabel('today')}, ${CommonUtils.convertDate(Number(item.value))}`
        : `${CommonUtils.convertDate(Number(item.value))}`;
      setHeaderDate(newDateLabel);
    } else {
      setHeaderDate(getLabel(String(item.value)));
    }
  };

  const onChangeDateCalender = (date: any) => {
    setHeaderDate(CommonUtils.convertDate(Number(date)));
  };

  const Item: FC<ItemProps> = ({ item }) => {
    const customer = JSON.parse(item.ext)
    return (
      <>
        <View style={styles.rowFlexStart}>
          <View style={{ alignSelf: 'flex-start', rowGap: 4 }}>
            <Text style={styles.txtTime}>{item.createddate}</Text>
            <Text style={styles.txtDate}>
              {CommonUtils.convertDate(item.createddate)}
            </Text>
          </View>
          <View style={{ marginHorizontal: 8 }}>
            <View style={styles.rowFlexStart}>
              <SvgIcon source={'Dot'} size={16} color={theme.colors.success} />
              <Text style={styles.txtStatus}>Checkin</Text>
            </View>
            <View style={styles.content}>
              <Text style={styles.txtName}>{customer ? customer.customer_name : ""}</Text>
              <Text style={styles.txtAddress}>{customer ? customer.address : ""}</Text>
            </View>
          </View>
        </View>
        {item.time_checkout != "" && (
          <View style={styles.rowFlexStart}>
            <View style={{ alignSelf: 'flex-start', rowGap: 4 }}>
              <Text style={styles.txtTime}>{item.createddate}</Text>
              <Text style={styles.txtDate}>
                {CommonUtils.convertDate(item.createddate)}
              </Text>
            </View>
            <View style={{ marginHorizontal: 8 }}>
              <View style={styles.rowFlexStart}>
                <SvgIcon source={'Dot'} size={16} color={theme.colors.primary} />
                <Text style={styles.txtStatus}>Checkout</Text>
              </View>
              <View style={styles.content}>
                <Text style={styles.txtName}>{customer ? customer.customer_name : ""}</Text>
                <Text style={styles.txtAddress}>{customer ? customer.address : ""}</Text>
              </View>
            </View>
          </View>
        )}

      </>
    );
  };

  const fetchData = async () => {
    dispatch(appActions.setProcessingStatus(true))
    const { status, data }: KeyAbleProps = await ReportService.getTravelLogReport({
      fromdate: new Date(date).setHours(0, 0),
      todate: new Date(date).setHours(23, 59)
    })
    dispatch(appActions.setProcessingStatus(false))
    setData(data.result)
  }

  useEffect(() => {
    fetchData()
  }, [date])


  return (
    <MainLayout style={{ backgroundColor: theme.colors.bg_neutral }}>
      <ReportHeader
        title={getLabel("logTravel")}
        date={headerDate}
        onSelected={() =>
          filerBottomSheetRef.current &&
          filerBottomSheetRef.current.snapToIndex(0)
        }
        rightIcon={
          <TouchableOpacity onPress={() => console.log('123')}>
            <Image source={ImageAssets.MapIcon} style={{ width: 28, height: 28 }} tintColor={theme.colors.text_secondary} resizeMode={'cover'}
            />
          </TouchableOpacity>
        }
      />
      <AppContainer style={{ marginBottom: bottom }}>
        {data.length > 0 && (
          <View style={{ marginTop: 24,borderRadius: 16,backgroundColor: theme.colors.bg_default,padding: 16}}>
            {data.map((item, index) => {
                return <Item key={index} item={item} />
            })}
          </View>
        )}

      </AppContainer>
      <ReportFilterBottomSheet
        filerBottomSheetRef={filerBottomSheetRef}
        onChange={onChangeHeaderDate}
        onChangeDateCalender={onChangeDateCalender}
      />
    </MainLayout>
  );
};
interface ItemProps {
  item: ReportTravelDiaryType;
}
export default TravelDiary;
const createStyle = (theme: ExtendedTheme) =>
  StyleSheet.create({
    rowFlexStart: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
    } as ViewStyle,
    txtTime: {
      color: theme.colors.text_primary,
      fontWeight: '500',
      alignSelf: 'center',
    } as TextStyle,
    txtStatus: {
      marginLeft: 8,
      fontSize: 16,
      fontWeight: '500',
      color: theme.colors.text_primary,
    } as TextStyle,
    txtDate: { color: theme.colors.text_secondary, fontSize: 12 } as TextStyle,
    content: {
      marginVertical: 4,
      marginLeft: 8,
      paddingTop: 4,
      paddingBottom: 24,
      paddingHorizontal: 12,
      borderLeftWidth: 1,
      borderColor: theme.colors.border,
      rowGap: 8,
    } as ViewStyle,
    txtName: { width: '65%', color: theme.colors.text_primary } as TextStyle,
    txtAddress: { width: '65%', color: theme.colors.text_secondary } as TextStyle,
  });