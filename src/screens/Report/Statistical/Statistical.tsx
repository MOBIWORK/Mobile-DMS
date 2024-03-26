import {TouchableOpacity} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import isEqual from 'react-fast-compare';
import {Block, AppText as Text} from '../../../components/common';
import {MainLayout} from '../../../layouts';
import {rootStyles} from './styles';
import {useTheme} from '../../../layouts/theme';
import Customer from './screens/Customer';
import Products from './screens/Products';
import ReportHeader from '../Component/ReportHeader';
import ReportFilterBottomSheet from '../Component/ReportFilterBottomSheet';
import {useTranslation} from 'react-i18next';
import BottomSheet from '@gorhom/bottom-sheet';
import {CommonUtils} from '../../../utils';
import {IFilterType} from '../../../components/common/FilterListComponent';
import { KeyAbleProps, StatisticsOrder, StatisticsOrderCustomer, StatisticsOrderProduct } from '../../../models/types';
import { ReportService } from '../../../services';

type Tabs = {
  id: number;
  title: string;
};
const tabs: Tabs[] = [
  {
    id: 0,
    title: 'Khách hàng',
  },
  {
    id: 1,
    title: 'Sản phẩm',
  },
];

const Statistical = () => {
  const theme = useTheme();
  const styles = rootStyles(theme);
  const {t: getLabel} = useTranslation();

  const filerBottomSheetRef = useRef<BottomSheet>(null);

  const [headerDate, setHeaderDate] = useState<string>(
    `${getLabel('today')}, ${CommonUtils.convertDate(new Date().getTime())}`,
  );
  const [selectTab, setSelectTab] = useState<number>(0);
  
  const [data,setData] = useState<StatisticsOrder>();
  const [products,setProducts] = useState<StatisticsOrderProduct[]>([]);
  const [customers,setCustomers] = useState<StatisticsOrderCustomer[]>([]);

  const [from_date,setFromDate] = useState<number>(new Date().getTime());
  const [to_date,setToDate] = useState<number>(new Date().getTime());

  const onChangeHeaderDate = (item: IFilterType) => {
    if (CommonUtils.isNumber(item.value)) {
      setFromDate(Number(item.value))
      setToDate(Number(item.value))
      const newDateLabel = CommonUtils.isToday(Number(item.value))
        ? `${getLabel('today')}, ${CommonUtils.convertDate(Number(item.value))}`
        : `${CommonUtils.convertDate(Number(item.value))}`;
      setHeaderDate(newDateLabel);
    } else {
      const {from_date ,to_date} = CommonUtils.dateToDate(item.value?.toString() || "");
      setFromDate(new Date(from_date).getTime());
      setToDate(new Date(to_date).getTime());
      setHeaderDate(getLabel(String(item.label)));
    }
  };

  const onChangeDateCalender = (date: any) => {
    setHeaderDate(CommonUtils.convertDate(Number(date)));
  };

  useEffect(()=>{

    const getData = async ()=>{
      const {data,status} :KeyAbleProps = await ReportService.getReoprtOrderStatistics({
        from_date : from_date / 1000 ,
        to_date : to_date / 1000
      });
      const result = data.result;
      setData(result.data);
      setCustomers(result.details);
      setProducts(result.detail_items);
    }
    getData();

},[from_date,to_date])

  return (
    <MainLayout style={styles.root}>
      <ReportHeader
        title={'Thống kê phiếu đặt hàng'}
        date={headerDate}
        onSelected={() =>
          filerBottomSheetRef.current &&
          filerBottomSheetRef.current.snapToIndex(0)
        }
      />
      <Block
        middle
        colorTheme="white"
        marginTop={16}
        marginBottom={24}
        direction="row"
        paddingVertical={4}
        borderRadius={24}
        justifyContent="space-between">
        {tabs.map((item, index) => {
          return (
            <TouchableOpacity
              style={styles.touchable(selectTab, index)}
              key={item.id}
              onPress={() => setSelectTab(item.id)}>
              <Block paddingHorizontal={30}>
                <Text
                  fontSize={14}
                  colorTheme={
                    selectTab === index ? 'primary' : 'text_secondary'
                  }
                  fontWeight={'500'}>
                  {item.title}
                </Text>
              </Block>
            </TouchableOpacity>
          );
        })}
      </Block>
      {selectTab === 0 ? <Customer data={customers} dataStatistics={data} /> : <Products data={products} dataStatistics={data} />}
      <ReportFilterBottomSheet
        filerBottomSheetRef={filerBottomSheetRef}
        onChange={onChangeHeaderDate}
        onChangeDateCalender={onChangeDateCalender}
      />
    </MainLayout>
  );
};

export default React.memo(Statistical, isEqual);
