import React, {useEffect, useState} from 'react';
import {MainLayout} from '../../../layouts';
import {AppContainer, AppHeader} from '../../../components/common';
import {useTranslation} from 'react-i18next';
import {useNavigation, useTheme} from '@react-navigation/native';
import {NavigationProp} from '../../../navigation';
import ProductDetailTab, {PRODUCT_DETAIL_TAB_VALUES} from './ProductDetailTab';
import {AppConstant} from '../../../const';
import Overview from './Overview';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {IProductInventory, IProductOverview} from '../../../models/types';
import {ImageAssets} from '../../../assets';
import Unit from './Unit';
import Inventory from './Inventory';

const ProductDetail = () => {
  const {t: getLabel} = useTranslation();
  const {colors} = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const {bottom} = useSafeAreaInsets();

  const [overviewData, setOverviewData] = useState<IProductOverview | null>(
    null,
  );

  const [selectedTab, setSelectedTab] = useState<number>(
    PRODUCT_DETAIL_TAB_VALUES.tong_quan,
  );

  useEffect(() => {
    setOverviewData(OverviewData);
  }, []);

  return (
    <MainLayout
      style={{paddingHorizontal: 0, backgroundColor: colors.bg_neutral}}>
      <AppHeader
        style={{paddingHorizontal: 16}}
        label={getLabel('productDetail')}
        onBack={() => navigation.goBack()}
      />
      <ProductDetailTab
        style={{
          marginTop: 16,
        }}
        selectedTab={selectedTab}
        onChangeTab={setSelectedTab}
      />
      <AppContainer style={{marginBottom: bottom}}>
        {selectedTab === PRODUCT_DETAIL_TAB_VALUES.tong_quan ? (
          overviewData && <Overview overviewData={overviewData} />
        ) : selectedTab === PRODUCT_DETAIL_TAB_VALUES.don_vi_tinh ? (
          <Unit />
        ) : (
          <Inventory inventoryData={InventoryData} />
        )}
      </AppContainer>
    </MainLayout>
  );
};

export default ProductDetail;

const OverviewData: IProductOverview = {
  name: 'MacBook Air M2 2022 (8GB RAM | 256GB SSD)',
  code: 'Sp-1234',
  unit: 'Chiếc',
  price: 39000000,
  trademark: 'Apple',
  commodity_industry: null,
  note: 'Gần bốn năm sau bản nâng cấp lớn với màn hình Retina, Apple tiếp tục “đại tu” MacBook Air với thiết kế mới. Máy được làm vuông hơn, các cạnh bo cong và độ dày dàn đều tương tự MacBook Pro 14 hoặc 16 inch. Cân nặng của sản phẩm là 1,22 kg, mỏng 11 mm cùng lớp vỏ nhôm nguyên khối....',
  image: [
    ImageAssets.ImgAppWatch,
    ImageAssets.ImgAppWatch,
    ImageAssets.ImgAppWatch,
    ImageAssets.ImgAppWatch,
    ImageAssets.ImgAppWatch,
    ImageAssets.ImgAppWatch,
    ImageAssets.ImgAppWatch,
    ImageAssets.ImgAppWatch,
  ],
  file: [
    {
      file_name: 'file A',
      size: 137,
      url: 'https://thientonphatquang.com/',
    },
    {
      file_name: 'file B',
      size: 167,
      url: 'https://thientonphatquang.com/',
    },
    {
      file_name: 'file X',
      size: 97,
      url: 'https://thientonphatquang.com/',
    },
  ],
};

const InventoryData: IProductInventory[] = [
  {
    label: 'Kho Thái Hà',
    count: 100,
  },
  {
    label: 'Kho Lê Văn Lương',
    count: 50,
  },
  {
    label: 'Kho Long Biên',
    count: 39,
  },
  {
    label: 'Kho Thái Hà',
    count: 100,
  },
  {
    label: 'Kho Vĩnh Tuy',
    count: 481,
  },
  {
    label: 'Kho Thái Hà',
    count: 21,
  },
  {
    label: 'Kho Thái Hà',
    count: 100,
  },
];
