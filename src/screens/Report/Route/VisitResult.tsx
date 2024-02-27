import React, {FC, useRef, useState} from 'react';
import {AppSegmentedButtonsType} from '../../../components/common/AppSegmentedButtons';
import {AppContainer, TabSelected, SvgIcon} from '../../../components/common';
import {MainLayout} from '../../../layouts';
import ReportHeader from '../Component/ReportHeader';
import {ExtendedTheme, useTheme} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {StyleSheet, Text, TextStyle, View, ViewStyle} from 'react-native';
import {CommonUtils} from '../../../utils';
import {VisitedItemType} from '../../../models/types';
import ReportFilterBottomSheet from '../Component/ReportFilterBottomSheet';
import {useTranslation} from 'react-i18next';
import BottomSheet from '@gorhom/bottom-sheet';
import {IFilterType} from '../../../components/common/FilterListComponent';
const VisitResult = () => {
  const theme = useTheme();
  const {bottom} = useSafeAreaInsets();
  const {t: getLabel} = useTranslation();
  const styles = createStyle(theme);

  const filerBottomSheetRef = useRef<BottomSheet>(null);

  const [segData, setSegData] = useState<AppSegmentedButtonsType[]>(dataSeg);
  const [selectedValue, setSelectedValue] = useState<number | string>(
    dataSeg[0].value,
  );

  const [visitedData, setVisitedData] =
    useState<VisitedItemType[]>(VisitedDataFake);
  const [notVisitData, setNotVisitData] =
    useState<VisitedItemType[]>(NotVisitedDataFake);

  const [headerDate, setHeaderDate] = useState<string>(
    `${getLabel('today')}, ${CommonUtils.convertDate(new Date().getTime())}`,
  );

  const onChangeHeaderDate = (item: IFilterType) => {
    if (CommonUtils.isNumber(item.value)) {
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

  const changeIndex = (value: string | number) => {
    setSelectedValue(value);
    const newSegData = segData.map(item => {
      if (value === item.value) {
        return {...item, isSelected: true};
      } else {
        return {...item, isSelected: false};
      }
    });
    setSegData(newSegData);
  };

  const VisitedRowItem: FC<VisitRowProps> = ({
    label,
    content,
    contentColor,
  }) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Text style={{fontSize: 12, color: theme.colors.text_secondary}}>
          {label}
        </Text>
        <Text style={{color: contentColor ?? theme.colors.text_primary}}>
          {content ?? ''}
        </Text>
      </View>
    );
  };

  const NotVisitRowItem: FC<NotVisitRowProps> = ({iconName, content}) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}>
        <SvgIcon
          source={iconName as any}
          size={16}
          color={theme.colors.text_primary}
        />
        <Text style={{marginLeft: 4, color: theme.colors.text_primary}}>
          {content}
        </Text>
      </View>
    );
  };

  const _renderTotal = () => {
    return (
      <View style={styles.totalContainer}>
        <View style={styles.itemTotal}>
          <SvgIcon source={'Visited'} size={40} />
          <Text style={styles.txt12}>Viếng thăm</Text>
          <Text style={styles.txt18}>30</Text>
        </View>
        <View style={styles.itemTotal}>
          <SvgIcon source={'NotVisit'} size={40} />
          <Text style={styles.txt12}>Chưa viếng thăm</Text>
          <Text style={styles.txt18}>15</Text>
        </View>
      </View>
    );
  };

  const _renderTotalSales = () => {
    return (
      <View style={styles.saleContainer}>
        <SvgIcon source={'Money'} size={40} />
        <View style={{rowGap: 4, marginLeft: 8}}>
          <Text style={styles.txt12}>Tổng doanh thu</Text>
          <Text style={styles.txt18}>
            {CommonUtils.convertNumber(100000000)}
          </Text>
        </View>
      </View>
    );
  };

  const _renderVisited = () => {
    const visitedItem = (item: VisitedItemType) => {
      return (
        <View style={styles.visitContainer}>
          <View style={styles.titleVisit}>
            <Text style={styles.txtTitleName}>{item.name}</Text>
            <Text style={{color: theme.colors.text_primary}}>KH - 1233</Text>
          </View>
          <VisitedRowItem label={'Thời gian'} content={item.time} />
          <VisitedRowItem
            label={''}
            content={CommonUtils.convertDate(item.date ?? 0)}
          />
          <VisitedRowItem
            label={'Tuyến'}
            content={item.inChannel ? 'Trong tuyến' : 'Ngoài tuyến'}
            contentColor={
              item.inChannel ? theme.colors.text_primary : theme.colors.primary
            }
          />
          <VisitedRowItem label={'Hình ảnh'} content={item.imgCount} />
          <VisitedRowItem
            label={'Đặt hàng'}
            content={item.isOrder ? 'Có' : 'Không'}
          />
          <VisitedRowItem
            label={'Doanh số'}
            content={CommonUtils.convertNumber(item.totalSale ?? 0)}
          />
        </View>
      );
    };
    return (
      <>
        {visitedData.map((item, index) => {
          return <View key={index}>{visitedItem(item)}</View>;
        })}
      </>
    );
  };

  const _renderNotVisit = () => {
    const notVisitItem = (item: VisitedItemType) => {
      return (
        <View style={styles.visitContainer}>
          <View style={styles.titleVisit}>
            <Text style={styles.txtTitleName}>{item.name}</Text>
            <Text style={{color: theme.colors.text_primary}}>KH - 1233</Text>
          </View>
          <NotVisitRowItem iconName={'MapPin'} content={item.address} />
          <NotVisitRowItem iconName={'Phone'} content={item.phone} />
          <NotVisitRowItem iconName={'Folder'} content={item.businessType} />
        </View>
      );
    };
    return (
      <>
        {notVisitData.map((item, index) => {
          return <View key={index}>{notVisitItem(item)}</View>;
        })}
      </>
    );
  };

  return (
    <MainLayout style={{backgroundColor: theme.colors.bg_neutral}}>
      <ReportHeader
        title={'Báo cáo viếng thăm'}
        date={headerDate}
        onSelected={() =>
          filerBottomSheetRef.current &&
          filerBottomSheetRef.current.snapToIndex(0)
        }
      />
      <AppContainer style={{marginTop: 24, marginBottom: bottom}}>
        {_renderTotal()}
        {_renderTotalSales()}
        <TabSelected
          style={{marginTop: 24}}
          data={segData}
          onChange={changeIndex}
        />
        {selectedValue === 1 ? _renderVisited() : _renderNotVisit()}
      </AppContainer>
      <ReportFilterBottomSheet
        filerBottomSheetRef={filerBottomSheetRef}
        onChange={onChangeHeaderDate}
        onChangeDateCalender={onChangeDateCalender}
      />
    </MainLayout>
  );
};
interface VisitRowProps {
  label: string;
  content?: string | number;
  contentColor?: string;
}

interface NotVisitRowProps {
  iconName: string;
  content?: string;
}
export default VisitResult;
const createStyle = (theme: ExtendedTheme) =>
  StyleSheet.create({
    totalContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-between',
    } as ViewStyle,
    itemTotal: {
      flex: 0.47,
      rowGap: 12,
      paddingHorizontal: 12,
      paddingVertical: 16,
      borderRadius: 16,
      backgroundColor: theme.colors.bg_default,
    },
    txt12: {
      fontSize: 12,
      color: theme.colors.text_secondary,
    } as TextStyle,
    txt18: {
      fontSize: 18,
      color: theme.colors.text_primary,
      fontWeight: '500',
    } as TextStyle,
    saleContainer: {
      flexDirection: 'row',
      marginTop: 24,
      padding: 16,
      borderRadius: 16,
      backgroundColor: theme.colors.bg_default,
      alignItems: 'center',
      justifyContent: 'flex-start',
    } as ViewStyle,
    visitContainer: {
      marginTop: 16,
      padding: 16,
      borderRadius: 16,
      backgroundColor: theme.colors.bg_default,
      rowGap: 8,
    } as ViewStyle,
    titleVisit: {
      rowGap: 4,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderColor: theme.colors.divider,
    } as ViewStyle,
    txtTitleName: {
      fontSize: 16,
      color: theme.colors.text_primary,
      fontWeight: '500',
    } as TextStyle,
  });
const dataSeg: AppSegmentedButtonsType[] = [
  {
    title: 'visited',
    value: 1,
    isSelected: true,
  },
  {
    title: 'notVisited',
    value: 2,
    isSelected: false,
  },
];
const VisitedDataFake: VisitedItemType[] = [
  {
    name: 'Công ty TNHH ABC',
    code: 'KH - 123',
    time: '15:03 - 15:07 (00:04)',
    date: 1704774485459,
    inChannel: true,
    imgCount: 0,
    isOrder: false,
    totalSale: 7000000,
  },
  {
    name: 'Công ty TNHH ABC',
    code: 'KH - 123',
    time: '15:03 - 15:07 (00:04)',
    date: 1704774485459,
    inChannel: false,
    imgCount: 0,
    isOrder: false,
    totalSale: 9000000,
  },
];

const NotVisitedDataFake: VisitedItemType[] = [
  {
    name: 'Công ty TNHH ABC',
    code: 'KH - 123',
    address: '191 đường Lê Văn Thọ, Phường 8, Gò Vấp, Thành phố Hồ Chí Minh',
    phone: '+84 667 435 265',
    businessType: 'Công ty',
  },
  {
    name: 'Công ty TNHH ABC',
    code: 'KH - 123',
    address: '191 đường Lê Văn Thọ, Phường 8, Gò Vấp, Thành phố Hồ Chí Minh',
    phone: '+84 667 435 265',
    businessType: 'Công ty',
  },
];
