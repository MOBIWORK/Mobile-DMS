import { TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import isEqual from 'react-fast-compare';
import {Block, AppText as Text} from '../../components/common';
import {MainLayout} from '../../layouts';
import {rootStyles} from './styles';
import {useTheme} from '../../layouts/theme';
import Customer from './screens/Customer';
import Products from './screens/Products';

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
  const [selectTab, setSelectTab] = useState<number>(0);

  return (
    <MainLayout style={styles.root}>
      <Block
        middle
        colorTheme="white"
        marginTop={8}
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
                  colorTheme={selectTab === index ? 'primary' : 'black'}
                  fontWeight={selectTab === index ? '700' : '500'}>
                  {item.title}
                </Text>
              </Block>
            </TouchableOpacity>
          );
        })}
      </Block> 
      {selectTab ===  0 ? <Customer/>   : <Products/>  }
    </MainLayout>
  );
};

export default React.memo(Statistical, isEqual);
