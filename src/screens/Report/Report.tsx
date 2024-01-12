import React, {FC} from 'react';
import isEqual from 'react-fast-compare';
import {
  AppHeader,
  Block,
  AppText as Text,
  AppImage,
  SvgIcon,
} from '../../components/common';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from '../../layouts/theme';
import {rootStyles} from './styles';
import {ScrollView, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NavigationProp} from '../../navigation';
import {ScreenConstant} from '../../const';
import {ItemProps, LineItem, SalesItem} from './ultil';

const ReportItem: FC<ItemProps> = ({title, icon, content, onPress}) => {
  return (
    <TouchableOpacity style={rootStyles(useTheme()).viewItem} onPress={onPress}>
      <Block>
        <SvgIcon source={icon} size={40} />
      </Block>
      <Block marginLeft={20}>
        <Text fontSize={16} fontWeight="500" colorTheme="text_primary">
          {title}
        </Text>
        <Text fontSize={12} fontWeight="400" colorTheme="text_secondary">
          {content}
        </Text>
      </Block>
    </TouchableOpacity>
  );
};

const Report = () => {
  const theme = useTheme();
  const styles = rootStyles(theme);
  const navigation = useNavigation<NavigationProp>();
  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <Block paddingHorizontal={16}>
        <AppHeader
          label="Báo cáo"
          labelStyle={{flex: 0}}
          rightButton={
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(ScreenConstant.SEARCH_PRODUCT)
              }>
              <AppImage
                source={'SearchIcon'}
                style={styles.iconSearch}
                resizeMode={'cover'}
              />
            </TouchableOpacity>
          }
        />
      </Block>
      <Block marginTop={24} marginLeft={16} marginRight={16} marginBottom={30}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text fontSize={14} fontWeight="400" colorTheme="text_secondary">
            Báo cáo kết quả đi tuyến
          </Text>
          <Block marginTop={10} marginBottom={10}>
            {LineItem.map((item, index) => {
              return <ReportItem {...item} key={index} />;
            })}
          </Block>
          <Block marginTop={14}>
            <Text fontSize={14} fontWeight="400" colorTheme="text_secondary">
              Báo cáo kết quả bán hàng
            </Text>
            {SalesItem.map((item, index) => {
              return <ReportItem {...item} key={index} />;
            })}
          </Block>
          <Block marginTop={14}>
            <Text fontSize={14} fontWeight="400" colorTheme="text_secondary">
              Báo cáo công nợ khách hàng
            </Text>
            <ReportItem
              title="Báo cáo công nợ khách hàng"
              content="Hiển thị công nợ của khách hàng"
              icon="ReportCustomerDebtIcon"
              onPress={() => navigation.navigate(ScreenConstant.REPORT_DEBT)}
            />
          </Block>
        </ScrollView>
      </Block>
    </SafeAreaView>
  );
};

export default React.memo(Report, isEqual);
