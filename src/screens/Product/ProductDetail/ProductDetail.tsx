import React, {useEffect, useState} from 'react';
import {MainLayout} from '../../../layouts';
import {AppContainer, AppHeader} from '../../../components/common';
import {useTranslation} from 'react-i18next';
import {useNavigation, useRoute, useTheme} from '@react-navigation/native';
import {NavigationProp, RouterProp} from '../../../navigation';
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
  const router = useRoute<RouterProp<"PRODUCT_DETAIL">>();
  const data = router.params.item;
  const {bottom} = useSafeAreaInsets();

  const [overviewData, setOverviewData] = useState<IProductOverview | null>(
    null,
  );

  const [selectedTab, setSelectedTab] = useState<number>(
    PRODUCT_DETAIL_TAB_VALUES.tong_quan,
  );


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
          data && <Overview overviewData={data} />
        ) : selectedTab === PRODUCT_DETAIL_TAB_VALUES.don_vi_tinh ? (
          <Unit data={data} />
        ) : (
          <Inventory inventoryData={data.stock} />
        )}
      </AppContainer>
    </MainLayout>
  );
};

export default ProductDetail;

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
