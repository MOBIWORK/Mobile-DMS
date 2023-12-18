import React, {useEffect, useState} from 'react';
import {Text} from 'react-native';
import {AppAccordion, AppSegmentedButtons} from '../../../components/common';
import {AppSegmentedButtonsType} from '../../../components/common/AppSegmentedButtons';

const Report = () => {
  const [segData, setSegData] = useState<AppSegmentedButtonsType[]>([]);

  const changeReportIndex = (value: string | number) => {
    console.log(value);
    const newSegData = segData.map(item => {
      if (value === item.value) {
        return {...item, isSelected: true};
      } else {
        return {...item, isSelected: false};
      }
    });
    setSegData(newSegData);
  };

  useEffect(() => {
    setSegData(dataSeg);
  }, []);

  return (
    <>
      {segData && (
        <AppSegmentedButtons data={dataSeg} onChange={changeReportIndex} />
      )}
    </>
  );
};
export default Report;
const dataSeg: AppSegmentedButtonsType[] = [
  {
    title: 'Đơn hàng',
    value: 1,
    isSelected: true,
  },
  {
    title: 'Tồn kho',
    value: 2,
    isSelected: false,
  },
  {
    title: 'Công nợ',
    value: 3,
    isSelected: false,
  },
];
