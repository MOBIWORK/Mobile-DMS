import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import React, {useCallback, useRef, useMemo} from 'react';
import {TextInput} from 'react-native-paper';
import {ColorSchema, useTheme} from '@react-navigation/native';
import {BottomSheetMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import {AppConstant} from '../../const';
import {Colors} from '../../assets';
import MainLayout from '../../layouts/MainLayout';
import AppImage from '../../components/common/AppImage';
import FilterHandle from './components/FilterHandle';
import {fakeData, listFilter} from './components/data';
import ListCard from './components/ListCard';
import {
  AppBottomSheet,
  AppHeader,
  AppIcons,
  AppInput,
} from '../../components/common';

type IValueType = {
  customerType: string;
  customerGroupType: string;
  customerBirthday: string;
};

const Customer = () => {
  const {t: getLabel} = useTranslation();
  const theme = useTheme();
  const styles = rootStyles(theme)
  const [value, setValue] = React.useState({
    first: 'Gần nhất',
    second: '',
  });
  const [show, setShow] = React.useState({
    firstModal: false,
    secondModal: false,
  });
  const [valueFilter, setValueFilter] = React.useState<IValueType>({
    customerType: 'Cá nhân',
    customerGroupType: 'Tất cả',
    customerBirthday: 'Tất cả',
  });
  const bottomRef = useRef<BottomSheetMethods>(null);
  const bottomRef2 = useRef<BottomSheetMethods>(null);
  const filterRef = useRef<BottomSheetMethods>(null);

  const snapPoints = useMemo(() => ['100%'], []);

  const onPressType1 = useCallback(() => {
    setShow(prev => ({...prev, firstModal: !show.firstModal}));
    bottomRef.current?.snapToIndex(0);
  }, [show]);
  const onPressType2 = useCallback(() => {
    setShow(prev => ({...prev, secondModal: !show.secondModal}));
    bottomRef2.current?.snapToIndex(0);
  }, [show]);

  const renderBottomView = () => {
    return (
      <MainLayout>
        <AppHeader
          label={'Khách hàng'}
          onBack={() => bottomRef2.current && bottomRef2.current.close()}
          backButtonIcon={
            <AppIcons
              iconType={AppConstant.ICON_TYPE.IonIcon}
              name={'close'}
              size={24}
              color={useTheme().colors.text_primary}
            />
          }
        />
        <View style={styles.containListFilter}>
          <AppInput
            label={'Nhóm khách hàng'}
            value={valueFilter.customerGroupType}
            editable={false}
            styles={{marginBottom: 24}}
            rightIcon={
              <TextInput.Icon
                icon={'chevron-down'}
                style={{width: 24, height: 24}}
                color={theme.colors.text_secondary}
              />
            }
          />
          <AppInput
            label={'Loại khách hàng'}
            value={valueFilter.customerType}
            editable={false}
            styles={{marginBottom: 24}}
            rightIcon={
              <TextInput.Icon
                icon={'chevron-down'}
                style={{width: 24, height: 24}}
                color={theme.colors.text_secondary}
              />
            }
          />
          <AppInput
            label={'Ngày sinh nhật'}
            value={valueFilter.customerBirthday}
            editable={false}
            rightIcon={
              <TextInput.Icon
                icon={'chevron-down'}
                style={{width: 24, height: 24}}
                color={theme.colors.text_secondary}
              />
            }
          />
        </View>
        <View style={styles.containButtonBottom}>
          <View style={styles.containContentButton}>
            <TouchableOpacity style={styles.buttonRestart}>
              <Text style={styles.restartText}>Đặt lại</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonApply}>
              <Text style={styles.applyText}>Áp dụng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </MainLayout>
    );
  };

  return (
    <>
      <MainLayout>
        <View style={styles.rootHeader}>
          <Text style={styles.labelStyle}>Khách hàng</Text>
          <TouchableOpacity
            onPress={() => console.log('on press search')}
            style={styles.iconSearch}>
            <AppImage source="IconSearch" style={styles.iconSearch} />
          </TouchableOpacity>
        </View>
        <View style={styles.containFilterView}>
          <FilterHandle type={'1'} value={value.first} onPress={onPressType1} />
          <FilterHandle
            type={'2'}
            value={value.second}
            onPress={onPressType2}
          />
        </View>

        <Text style={styles.containCustomer}>
          <Text style={styles.numberCustomer}>300</Text> Khách hàng
        </Text>
        <ListCard data={fakeData} />
      </MainLayout>
      <AppBottomSheet
        bottomSheetRef={bottomRef}
        useBottomSheetView={show.firstModal}
        enablePanDownToClose={true}>
        <View>
          <View style={styles.tittleHeader}>
            <Text style={styles.titleText}>Khoảng cách</Text>
          </View>
          {listFilter.map((item, index) => {
            return (
              <TouchableOpacity
                style={styles.containItemBottomView}
                key={item.id.toString()}
                onPress={() =>
                  setValue(prev => ({
                    ...prev,
                    first: item.title,
                  }))
                }>
                <Text style={styles.itemText(item.title, value.first)}>
                  {item.title}
                </Text>
                {item.title === value.first && (
                  <AppIcons
                    iconType={AppConstant.ICON_TYPE.Feather}
                    name="check"
                    size={24}
                    color={useTheme().colors.primary}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </AppBottomSheet>
      <AppBottomSheet
        bottomSheetRef={bottomRef2}
        useBottomSheetView={show.secondModal}
        snapPointsCustom={snapPoints}
        enablePanDownToClose={true}>
        {renderBottomView()}
      </AppBottomSheet>
    </>
  );
};

export default React.memo(Customer);

const rootStyles =(theme:ColorSchema) => StyleSheet.create({
  labelStyle: {
    fontSize: 24,
    color: Colors.gray_800,
    lineHeight: 25,
    fontWeight: '500',
    textAlign: 'left',
    // alignSelf:'flex-end'
  } as TextStyle,
  containCustomer: {
    fontSize: 14,
    color: Colors.gray_800,
    lineHeight: 21,
    fontWeight: '500',
    textAlign: 'left',
    marginBottom: 16,
    // alignSelf:'flex-end'
  } as TextStyle,
  numberCustomer: {
    fontSize: 14,
    color: Colors.darker,
    lineHeight: 21,
    fontWeight: '700',
    textAlign: 'left',
    // alignSelf:'flex-end'
  } as TextStyle,
  iconSearch: {
    width: 28,
    height: 28,
    marginRight: 16,
  } as ImageStyle,
  searchButtonStyle: {
    alignItems: 'flex-end',
    backgroundColor: 'red',
    width: 200,
    flex: 1,
  } as ViewStyle,
  labelContentStyle: {alignSelf: 'flex-end'} as ViewStyle,
  rootHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 48,
    marginBottom: 16,
  } as ViewStyle,
  containFilterView: {
    flexDirection: 'row',
    height: 48,
    marginBottom: 16,
  } as ViewStyle,
  tittleHeader: {
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  titleText: {
    fontSize: 18,
    color: Colors.darker,
    lineHeight: 27,
    fontWeight: '500',
    marginBottom: 4,
    // textAlign: 'left',
    // alignSelf:'flex-end'
  } as TextStyle,
  containItemBottomView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 5,
  } as ViewStyle,
  itemText: (text: string, value: string) =>
    ({
      fontSize: 16,
      fontWeight: text === value ? '600' : '400',
      lineHeight: 21,
      marginBottom: 16,
    } as TextStyle),
  containListFilter: {
    marginTop: 24,
    flex: 1,
  } as ViewStyle,
  containButtonBottom: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
  } as ViewStyle,
  containContentButton: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom:20,
  
  } as ViewStyle,
  buttonApply:{ 
        backgroundColor:theme.colors.primary,
        borderRadius:24,
        alignItems:'center',
        paddingHorizontal:12,
        paddingVertical:12,
        flex:1,
        marginHorizontal:6

  } as ViewStyle,
  buttonRestart:{ 
    backgroundColor:Colors.gray_100,
    borderRadius:24,
    alignItems:'center',
    paddingHorizontal:12,
    paddingVertical:12,
    marginHorizontal:6,
    // width:'100%',
    flex:1
} as ViewStyle,
  restartText:{
      fontSize:14,
      fontWeight:'700',
      lineHeight:24,
      color:Colors.gray_600
  } as TextStyle,
  applyText:{
    fontSize:14,
    fontWeight:'700',
    lineHeight:24,
    color:Colors.white
  } as TextStyle
});
