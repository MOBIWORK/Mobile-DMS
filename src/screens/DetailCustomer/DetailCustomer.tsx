import {
  ActivityIndicator,
  Image,
  ImageStyle,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
  useWindowDimensions,
} from 'react-native';
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
} from 'react';
import {useIsFocused, useRoute} from '@react-navigation/native';
import {RouterProp} from '../../navigation/screen-type';
import {
  AppBottomSheet,
  AppHeader,
  Block,
  SvgIcon,
  AppText as Text,
} from '../../components/common';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import Modal from 'react-native-modal';
import {AppTheme, useTheme} from '../../layouts/theme';
import {Address, Contact, Overview} from './screen';
import {SafeAreaView} from 'react-native-safe-area-context';
import FormAddress from '../Customer/components/FormAddress';
import {AppConstant, ScreenConstant} from '../../const';
import {useTranslation} from 'react-i18next';
import isEqual from 'react-fast-compare';
import {goBack, navigate} from '../../navigation/navigation-service';
import {CustomerService} from '../../services';
import {useSelector} from '../../config/function';
import {shallowEqual} from 'react-redux';

import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import ModalEditAddress from '../EditCustomer/components/ModalEditAddress';
import {ImageAssets} from '../../assets';
import {deleteCustomer} from '../../services/customerService';

const DetailCustomer = () => {
  const theme = useTheme();
  const styles = rootStyles(theme);
  const layout = useWindowDimensions();
  const {t: getLabel} = useTranslation();

  const params = useRoute<RouterProp<'DETAIL_CUSTOMER'>>().params;

  const [isPending, startTrans] = useTransition();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalEditAddress, setModalEditAddress] = useState({
    type: 'address',
    status: false,
  });

  const bottomAction = useRef<BottomSheetModalMethods>();

  const [modalShow, setModalShow] = useState({
    type: AppConstant.CustomerFilterType.loai_khach_hang,
    status: false,
  });
  const [modalDelete, setModalDelete] = useState(false);
  const [dataEdit, setDataEdit] = useState<any>({data: {}, type: ''});
  const isFocus = useIsFocused();
  const indexView = useRef<number>(0);
  // const [bottomType,setBottomType] = useState('delete')
  const snapPointsDetailPr = React.useMemo(() => ['25%'], []);
  const [currentFocus, setCurrentFocus] = useState<boolean>(isFocus);

  const getDetailCustomer = async () => {
    try {
      setLoading(true);
      let res: any = await CustomerService.getCustomerDetail(params?.data.name);
      if (res.message === 'ok' || Object.keys(res.result).length > 0) {
        setData(res.result);
      }
    } catch (err) {
      console.log('[error]: ', err);
    } finally {
      // mounted.current = false;
      setLoading(false);
    }
  };

  // console.log(data,'dataAddress')

  const listData = useSelector(
    state => state.customer.mainAddress,
    shallowEqual,
  );

  useEffect(() => {
    // setLoading(true);
    setTimeout(() => {
      getDetailCustomer();
    }, 1000);

    return () => {
      // mounted.current = false;
    };
  }, [currentFocus]);

  const routes = useRef([
    {key: 'first', title: getLabel('overview')},
    {key: 'second', title: getLabel('address')},
    {key: 'third', title: getLabel('contact')},
  ]).current;

  const onPressCard = useCallback(
    (data: any, type: string, screen: any) => {
      bottomAction.current?.snapToIndex(0);
      setDataEdit({
        data: data,
        type: type,
        screen: screen,
      });
    },
    [dataEdit.type],
  );

  // console.log(dataEdit,'dataEdits')

  const onDeleteContact = useCallback(async () => {
    const dataDelete = {
      name: dataEdit.data.name,
      type: dataEdit.type === 'editAddress' ? 'address' : 'contact',
      customer: params.data.name,
    };

    await deleteCustomer(dataDelete);
    setTimeout(async () => {
      await getDetailCustomer();
    }, 1000);
    setModalDelete(false);
  }, [dataEdit]);

  const onPressShowDelete = useCallback(() => {
    bottomAction.current?.close();
    setModalDelete(!modalDelete);
  }, [dataEdit, modalDelete]);

  const onPressEdit = useCallback(() => {
    setModalEditAddress({
      status: true,
      type: dataEdit.type,
    });
    bottomAction.current?.close();
  }, []);

  const renderScene = React.useCallback(
    SceneMap({
      first: () => (
        //
        <Overview data={data as any} />
      ),
      second: () => (
        //
        <Address
          onPressAdding={onPressAdding}
          onPressCard={onPressCard}
          data={data as any}
          listData={data && data?.address ? data.address : []}
        />
      ),
      third: () => (
        //
        <Contact
          onPressCard={onPressCard}
          onPressAdding={onPressAddingContact}
          data={data as any}
        />
        //
      ),
    }),
    [data, indexView.current],
  );

  // console.log(data.contact,'data')

  const onCloseEditAddress = useCallback(() => {
    if (modalEditAddress.status === true) {
      setModalEditAddress(prev => ({...prev, status: false}));
    }
  }, [modalEditAddress.status, currentFocus]);

  const onPressAdding = useCallback(() => {
    setModalShow({
      type: AppConstant.CustomerFilterType.dia_chi,
      status: true,
    });
    setCurrentFocus(false);
  }, [modalShow.status, modalShow.type, currentFocus]);

  const onPressAddingContact = useCallback(() => {
    setModalShow({
      type: AppConstant.CustomerFilterType.nguoi_lien_he,
      status: true,
    });
    setCurrentFocus(false);
  }, [modalShow.status, modalShow.type, currentFocus]);

  // console.log(dataEdit,'dataEdit')

  const renderTabBar = useCallback((props: any) => {
    return (
      <TabBar
        {...props}
        renderLabel={({focused, route}) => {
          return (
            <Text style={[styles.textTabBar(focused)]}>{route.title}</Text>
          );
        }}
        indicatorStyle={styles.indicatorStyle}
        style={styles.tabBar}
      />
    );
  }, []);

  const onBackButtonPress = useCallback(() => {
    setModalShow(prev => ({
      ...prev,
      status: false,
    }));
    setCurrentFocus(true);
  }, [modalShow.status]);

  const onIndexChange = useCallback(
    (index: number) => {
      startTrans(() => {
        indexView.current = index;
      });
    },
    [indexView.current],
  );
  // console.log(isFocus,'us','mounted')
  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.labelHeader}>
        <AppHeader
          label={getLabel('customerDetail')}
          style={{backgroundColor: theme.colors.bg_default}}
          onBack={() => goBack()}
          rightButton={
            <TouchableOpacity
              style={styles.containIcon}
              onPress={() =>
                navigate(ScreenConstant.EDIT_CUSTOMER, {data: data})
              }>
              <SvgIcon source="Edit" size={20} />
            </TouchableOpacity>
          }
        />
      </View>
      {!!loading ? (
        <Block block justifyContent="center" alignItems="center">
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </Block>
      ) : (
        <TabView
          onIndexChange={onIndexChange}
          navigationState={{
            index: indexView.current,
            routes: routes,
          }}
          swipeEnabled={true}
          renderScene={renderScene}
          renderTabBar={renderTabBar}
          lazyPreloadDistance={2}
          lazy={true}
          animationEnabled={true}
          initialLayout={{width: layout.width}}
        />
      )}

      <Modal
        isVisible={modalShow.status}
        animationIn="slideInUp"
        animationOut={'slideOutDown'}
        backdropOpacity={0.5}
        onBackButtonPress={onBackButtonPress}
        onBackdropPress={onBackButtonPress}
        style={styles.modalStyle}>
        <Block block colorTheme="bg_default" paddingHorizontal={16}>
          <FormAddress
            onPressClose={onBackButtonPress}
            typeFilter={modalShow.type}
            listData={listData as any}
            setData={setData}
            dataCustomer={data}
            getDetailCustomer={getDetailCustomer}
          />
        </Block>
      </Modal>
      <AppBottomSheet
        bottomSheetRef={bottomAction}
        snapPointsCustom={snapPointsDetailPr}>
        <Block paddingHorizontal={16}>
          <Text
            fontSize={dataEdit.type === 'editAddress' ? 12 : 16}
            colorTheme="text_primary"
            fontWeight="bold">
            {dataEdit.type === 'editAddress' ? '' : 'Liên hệ'}{' '}
            {dataEdit.data.name}
          </Text>
          <Block marginTop={20}>
            <TouchableOpacity
              style={styles.containIconButton}
              onPress={onPressEdit}>
              <SvgIcon source="Edit" size={20} />
              <Block paddingLeft={10}>
                <Text fontSize={16} fontWeight="400" colorTheme="text_primary">
                  {getLabel('edit')}
                </Text>
              </Block>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.containIconButton}
              onPress={onPressShowDelete}>
              <SvgIcon
                source="RedTrash"
                size={20}
                colorTheme="error"
                color={theme.colors.error}
              />
              <Block paddingLeft={10}>
                <Text fontSize={16} fontWeight="400" colorTheme="error">
                  {getLabel('delete')}
                </Text>
              </Block>
            </TouchableOpacity>
          </Block>
        </Block>
      </AppBottomSheet>
      <Modal
        isVisible={modalDelete}
        animationIn={'slideInUp'}
        animationOut={'slideOutDown'}
        backdropOpacity={0.5}
        onBackButtonPress={() => setModalDelete(false)}
        onBackdropPress={() => setModalDelete(false)}
        style={styles.containerStyle}>
        <Block
          colorTheme="bg_default"
          justifyContent="center"
          alignItems="center"
          paddingHorizontal={16}
          borderRadius={16}>
          <Image source={ImageAssets.ErrorApiIcon} style={styles.errorIcon} />
          <Text textAlign="center" fontSize={12}>
            Bạn có chắc chắn muốn xóa{' '}
            {dataEdit.type === 'editAddress' ? 'địa chỉ' : 'liên hệ'}{' '}
            {dataEdit.data.name} không?
          </Text>
          <Block
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            marginBottom={20}
            marginTop={30}>
            <TouchableOpacity
              style={styles.buttonCancel}
              onPress={() => setModalDelete(false)}>
              <Text
                fontSize={14}
                lineHeight={24}
                fontWeight="700"
                colorTheme="text_secondary">
                Hủy
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonContinue}
              onPress={onDeleteContact}>
              <Text
                fontSize={14}
                lineHeight={24}
                fontWeight="700"
                colorTheme="white">
                Tiếp tục
              </Text>
            </TouchableOpacity>
          </Block>
        </Block>
      </Modal>

      <ModalEditAddress
        visible={modalEditAddress.status}
        onBackButtonPress={onCloseEditAddress}
        setData={setData}
        dataCustomer={data}
        type={dataEdit.type}
        defaultEditData={dataEdit.data}
        setDefaultEditData={setDataEdit}
        screenPass={dataEdit.screen}
      />
    </SafeAreaView>
  );
};

export default React.memo(DetailCustomer, isEqual);

const rootStyles = (theme: AppTheme) =>
  StyleSheet.create({
    textTabBar: (focused: boolean) =>
      ({
        fontSize: 16,
        lineHeight: 24,
        fontWeight: '500',
        color: focused ? theme.colors.primary : theme.colors.text_disable,
      } as TextStyle),
    indicatorStyle: {
      backgroundColor: theme.colors.primary,
      padding: 1.5,
      marginBottom: -2,
    },
    tabBar: {
      backgroundColor: theme.colors.bg_default,
      borderBottomWidth: 1,
      borderColor: theme.colors.bg_default,
    },
    root: {
      backgroundColor: theme.colors.bg_default,
      flex: 1,
    } as ViewStyle,
    containIcon: {
      marginRight: 10,
    } as ViewStyle,
    labelHeader: {
      marginHorizontal: 16,
      marginBottom: 20,
    } as ViewStyle,
    modalStyle: {
      marginHorizontal: 0,
      marginVertical: 0,
    } as ViewStyle,
    containIconButton: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    } as ViewStyle,

    containerStyle: {
      justifyContent: 'center',
      borderRadius: 16,
      alignItems: 'center',
      // width: '100%',
      marginHorizontal: 16,
    } as ViewStyle,
    errorIcon: {
      width: 66,
      height: 66,
      marginBottom: 8,
      marginTop: 16,
    } as ImageStyle,
    buttonCancel: {
      justifyContent: 'center',
      backgroundColor: theme.colors.bg_neutral,
      flex: 1,
      borderRadius: 16,
      height: 36,
      alignItems: 'center',
      marginHorizontal: 4,
    } as ViewStyle,
    buttonContinue: {
      justifyContent: 'center',
      backgroundColor: theme.colors.primary,
      flex: 1,
      borderRadius: 16,
      height: 36,
      alignItems: 'center',
      marginHorizontal: 4,
    } as ViewStyle,
  });
