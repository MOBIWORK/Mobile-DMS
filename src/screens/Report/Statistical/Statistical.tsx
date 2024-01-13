import {TouchableOpacity} from 'react-native';
import React, {useRef, useState} from 'react';
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
              <Block paddingHorizontal={30} paddingVertical={2}>
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
      {selectTab === 0 ? <Customer /> : <Products />}
      <ReportFilterBottomSheet
        filerBottomSheetRef={filerBottomSheetRef}
        onChange={onChangeHeaderDate}
        onChangeDateCalender={onChangeDateCalender}
      />
    </MainLayout>
  );
};

export default React.memo(Statistical, isEqual);
