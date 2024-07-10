import {
  StyleSheet,
  Image,
  ImageStyle,
  TextStyle,
  Keyboard,
  ScrollView,
  ViewStyle,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import React, {
  useCallback,
  useLayoutEffect,
  useMemo,
  useState,
  useTransition,
} from 'react';
import isEqual from 'react-fast-compare';
import {
  AppInput,
  Block,
  SvgIcon,
  AppText as Text,
} from '../../../components/common';
import {useTranslation} from 'react-i18next';
import {ImageAssets} from '../../../assets';
import {useTheme, AppTheme} from '../../../layouts/theme';
import {
  Address,
  Contact,
  ContactCard,
  DetailCustomerType,
  ListCustomerTerritory,
} from '../../../models/types';
import {TextInput} from 'react-native-paper';
import {
  convertToMoneyFormat,
  reverseFormatNumber,
  useSelector,
} from '../../../config/function';
import moment from 'moment';
import {shallowEqual} from 'react-redux';
import ModalArea from '../../Customer/components/ModalArea';
import {customerActions} from '../../../redux-store/customer-reducer/reducer';
import {CustomerService} from '../../../services';
import {dispatch} from '../../../utils/redux';
import {
  openImagePicker,
  openImagePickerCamera,
} from '../../../utils/camera.utils';
import ModalCamera from './ModalCamera';
import ButtonLayout from './ButtonLayout';
import CardEditAddress from './CardEditAddress';
import ModalEditAddress from './ModalEditAddress';
import ModalChoose from './ModalChoose';
import ModalData from './ModalData';
import {DatePickerModal} from 'react-native-paper-dates';
import {SingleChange} from 'react-native-paper-dates/lib/typescript/Date/Calendar';

type Props = {
  data: DetailCustomerType;
  goBack(): void;
};

const dateToTimestamp = (dateString: string): number => {
  // const formatDate = moment(dateString).format('DD/MM/YYYY');
  const date = moment(dateString);

  if (!moment(date).isValid) {
    Alert.alert('Không đúng định dạng ngày', dateString);
    console.log(dateString, 'error');
  }

  return date.unix();
};
function dateToISOString(dateString: string): string {
  // const dateString = moment(dateString).format('DD/MM/YYYY');

  const date = moment(dateString);

  if (!date.isValid()) {
    Alert.alert('Không đúng định dạng ngày', dateString);
  }

  return date.toISOString(); // .toISOString() returns the ISO string
}

const updatePrimaryAddress = (
  dataArray: Address[],
  targetString: string | any,
) => {
  return dataArray.map(item => {
    if (item.name === targetString) {
      return {
        ...item,
        primary: 1,
      };
    }
    return item;
  });
};
// const updat

const FormData = (props: Props) => {
  const {data, goBack} = props;
  const {t: translate} = useTranslation();
  const theme = useTheme();
  const styles = formStyles(theme);
  const initStateData = React.useRef<DetailCustomerType>({
    ...data,
    customer_code: data?.customer_code || '',
    customer_name: data?.customer_name || '',
    customer_type: data?.customer_type || '',
    customer_group: data?.customer_group || '',
    territory: data?.territory || '',
    custom_birthday: data?.custom_birthday || '',
    routers: data?.routers || [],
    image: data?.image || '',

    address:
      data.address && data.address.length > 0
        ? updatePrimaryAddress(data.address, data.customer_primary_address).map(
            item => ({
              ...item,
              primary: item.name === data.customer_primary_address ? 1 : 0,
            }),
          )
        : [],
    contacts:
      data.contacts && data.contacts.length > 0 && data.contacts.length === 1
        ? data.contacts.map(item => ({
            ...item,
            primary: 1,
            is_primary_contact: 1,
            is_billing_contact: 0,
          }))
        : data.contacts,
    credit_limits:
      data.credit_limits && data.credit_limits?.length > 0
        ? data.credit_limits
        : [],
  });
  const [dataCustomer, setDataCustomer] = useState<DetailCustomerType>(
    initStateData.current,
  );
  const listTerritory: ListCustomerTerritory[] = useSelector(
    state => state.customer.listCustomerTerritory,
    shallowEqual,
  );
  // console.log(dataCustomer.address,'dataCus')

  const [isPending, startTransition] = useTransition();
  const [date, setDate] = useState<Date>();
  const [open, setOpen] = useState(false);
  const [openDate, setOpenDate] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalEditAddress, setModalEditAddress] = useState({
    type: 'address',
    status: false,
  });
  const [modalChoose, setModalChoose] = useState({
    type: 'address',
    status: false,
  });
  const [modalData, setModalData] = useState({
    type: 'customer_type',
    status: false,
  });
  const [defaultDataEdit, setDefaultDataEdit] = useState<any>({});

  const onBackButtonPress = useCallback(() => {
    setModalOpen(false);
  }, [modalOpen]);

  const getCustomerTerritory = async () => {
    const response: any = await CustomerService.getCustomerTerritory();
    if (response?.result.length > 0) {
      dispatch(customerActions.setListCustomerTerritory(response.result));
    }
  };

  const handleImagePicker = useCallback(async () => {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    ]);
    if (
      (granted['android.permission.CAMERA'] &&
        granted['android.permission.WRITE_EXTERNAL_STORAGE']) ||
      Platform.OS === 'ios'
    ) {
      setOpen(false);
      openImagePicker((selectedImage, base64) => {
        setDataCustomer((prevState: any) => ({
          ...prevState,
          image: `data:image/jpeg;base64,${base64}`,
        }));
      });
    } else {
      Alert.alert('Bạn chưa cấp quyền');
    }
  }, [[dataCustomer.image]]);

  const handleCameraPicker = useCallback(async () => {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    ]);
    if (
      (granted['android.permission.CAMERA'] &&
        granted['android.permission.WRITE_EXTERNAL_STORAGE']) ||
      Platform.OS === 'ios'
    ) {
      setOpen(false);
      openImagePickerCamera((selectedImage, base64) => {
        setDataCustomer((prevState: any) => ({
          ...prevState,
          image: `data:image/jpeg;base64,${base64}`,
        }));
      });
    } else {
      Alert.alert('Bạn chưa cấp quyền sử dụng ');
    }
  }, [dataCustomer.image]);

  const onBackButtonCamera = useCallback(() => {
    setOpen(false);
  }, [open]);

  const onConfirmSingle = React.useCallback<SingleChange>(
    params => {
      setOpenDate(false);
      setDate(params.date);
      setDataCustomer(prev => ({...prev, custom_birthday: params.date}));
    },
    [setOpenDate],
  );
  const onDismissSingle = React.useCallback(() => {
    setOpenDate(false);
  }, [setOpenDate]);

  const onPressAddingAddress = useCallback(() => {
    startTransition(() => {
      setModalEditAddress({
        type: 'address',
        status: true,
      });
    });
  }, [modalEditAddress.type]);
  const onPressChooseAddress = useCallback(() => {
    startTransition(() => {
      setModalChoose({
        status: true,
        type: 'address',
      });
    });
  }, [modalChoose.type]);

  const onPressAddingContact = useCallback(() => {
    startTransition(() => {
      setModalEditAddress({
        type: 'contact',
        status: true,
      });
    });
  }, [modalEditAddress.type]);
  const onPressChooseContact = useCallback(() => {
    setModalChoose({
      status: true,
      type: 'contact',
    });
  }, [modalChoose.type]);

  const onUpdateCustomer = useCallback(() => {
    // let dataAddress = dataCustomer.address;
    let route = dataCustomer?.routers;
    route?.[0].frequency &&
    Array(route?.[0].frequency) &&
    typeof route?.[0].frequency != 'string'
      ? route?.[0].frequency?.join(';')
      : dataCustomer.routers;

    const dataUpdate = {
      name: dataCustomer.name,
      address:
        dataCustomer.address && dataCustomer.address.length > 0
          ? dataCustomer?.address.find(item => item.primary === 1) != undefined
            ? [dataCustomer?.address?.find(item => item.primary === 1)]
            : [dataCustomer?.address[dataCustomer?.address.length - 1]]
          : [] || [{}],
      contact:
        dataCustomer.contacts && dataCustomer.contacts.length > 0
          ? dataCustomer?.contacts?.find(item => item.primary === 1) !=
            undefined
            ? [dataCustomer?.contacts?.find(item => item.primary === 1)]
            : dataCustomer?.contacts.map(item => ({
                ...item,
                primary: 1,
                is_primary_contact: 1,
                is_billing_contact: 0,
              }))
          : [],
      // credit_limits: dataCustomer.credit_limits || '',
      customer_code: dataCustomer.customer_code || '',
      customer_group:
        dataCustomer.customer_group != null
          ? dataCustomer.customer_group
          : null,
      customer_name: dataCustomer.customer_name || '',
      customer_type:
        (dataCustomer.customer_type &&
          dataCustomer?.customer_type?.slice(0, 1).toUpperCase() +
            dataCustomer?.customer_type?.slice(
              1,
              dataCustomer?.customer_type?.length,
            )) ||
        '',
      image: dataCustomer.image || '',
      routers: route || '',
      website: dataCustomer.website || '',
      territory: dataCustomer.territory || '',
      customer_details: dataCustomer.customer_details || '',
      custom_birthday: dataCustomer?.custom_birthday
        ? dateToTimestamp(dateToISOString(dataCustomer?.custom_birthday))
        : dateToTimestamp(new Date().toISOString()),
      credit_limits: [
        reverseFormatNumber(
          dataCustomer?.credit_limits![0] ? dataCustomer.credit_limits[0] : 0,
        ) || 0,
      ],
      // ...dataCustomer,
    };
    // console.log(dataCustomer.contact,'contact update')
    startTransition(() => {
      dispatch(
        customerActions.updateCustomerAction(dataUpdate, dataCustomer.name!),
      );
    });
  }, [dataCustomer]);

  const onCloseEditAddress = useCallback(() => {
    if (modalEditAddress.status === true) {
      setModalEditAddress(prev => ({...prev, status: false}));
    }
  }, [modalEditAddress.status]);

  const onCloseModal = useCallback(() => {
    if (modalChoose.status === true) {
      setModalChoose(prev => ({...prev, status: false}));
    } else if (modalEditAddress.status === true) {
      setModalEditAddress(prev => ({...prev, status: false}));
    } else {
      setModalData(prev => ({...prev, status: false}));
    }
  }, [modalChoose.status, modalEditAddress.status, modalData.status]);

  const isPrimaryAddress = useMemo(() => {
    if (dataCustomer.address && dataCustomer.address.length > 0) {
      // Check if any address has primary equal to 1
      return dataCustomer.address.some(item => item.primary === 1);
    } else {
      return false;
    }
  }, [
    dataCustomer.address,
    modalChoose.status,
    modalData.status,
    modalEditAddress.status,
  ]);
  const isPrimaryContact = useMemo(() => {
    if (dataCustomer.contacts && dataCustomer.contacts.length > 0) {
      // Check if any address has primary equal to 1
      return dataCustomer.contacts?.some(item => item.primary == 1);
    } else {
      return false;
    }
  }, [
    dataCustomer.contacts,
    modalChoose.status,
    modalData.status,
    modalEditAddress.status,
  ]);
  // console.log(isPrimaryContact,'contact')
  // console.log(dataCustomer?.credit_limits,'credit')
  const onPressTrash = useCallback(() => {
    const updatedAddressArray = dataCustomer.address
      ? dataCustomer?.address.map(item => {
          // Check if primary is 1, then update it to 0
          if (item.primary === 1) {
            return {...item, primary: 0};
          }
          // For other items, return them as they are
          return {...item};
        })
      : [];
    setDataCustomer(prev => ({...prev, address: updatedAddressArray}));
  }, [dataCustomer.address]);

  const onPressTrashContact = useCallback(() => {
    const updateContactArray = dataCustomer.contacts
      ? dataCustomer?.contacts?.map(item => {
          if (item.primary && item.primary === 1) {
            return {...item, primary: 0};
          }
          return {...item};
        })
      : [];
    setDataCustomer(prev => ({...prev, contacts: updateContactArray}));
  }, [dataCustomer.contacts]);

  useLayoutEffect(() => {
    if (listTerritory.length === 0) {
      getCustomerTerritory();
    }
    // if (lisCustomerRoute.length === 0) {
    //   getCustomerRoute();
    // }
  }, []);

  // console.log(dataCustomer.contacts?.find(item => item.is_primary_contact === 1),'contact')

  const onPressData = useCallback(
    (data: any, type: string) => {
      if (type === 'address') {
        let newData: Address | any = data;

        newData.primary = 1;
        newData.name = newData.address_title; // Ensure name is set from address_title

        startTransition(() => {
          setDataCustomer(prev => {
            const updatedAddress =
              prev.address?.map(addr => ({
                ...addr,
                primary: 0,
              })) || [];

            const existingIndex = updatedAddress.findIndex(
              addr => addr.address_title === newData.address_title,
            );

            if (existingIndex !== -1) {
              updatedAddress[existingIndex] = newData;
            } else {
              updatedAddress.push(newData);
            }

            return {
              ...prev,
              address: updatedAddress,
            };
          });
        });
        onCloseModal();
      } else {
        let newData: any = data;
        newData.primary = 1;

        // Ensure the name field is correctly set
        if (!newData.name) {
          newData.name =
            newData.first_name || newData.last_name || 'Unnamed Contact';
        }

        startTransition(() => {
          setDataCustomer(prev => {
            const updatedContacts =
              prev.contacts?.map(contact => ({
                ...contact,
                primary: 0,
              })) || [];

            const existingIndex = updatedContacts.findIndex(
              contact => contact.name === newData.name,
            );

            if (existingIndex !== -1) {
              updatedContacts[existingIndex] = newData;
            } else {
              updatedContacts.push(newData);
            }

            return {
              ...prev,
              contacts: updatedContacts,
            };
          });
        });
        onCloseModal();
      }
    },
    [modalChoose.status],
  );

  // console.log(dataCustomer.contacts, 's');
  const onEditdata = useCallback(
    (data: any, type: any) => {
      if (type === 'address') {
        startTransition(() => {
          setModalEditAddress({
            type: 'editAddress',
            status: true,
          });
          setDefaultDataEdit(data);
        });
      } else {
        startTransition(() => {
          setDefaultDataEdit(data);
          setModalEditAddress({
            type: 'editContact',
            status: true,
          });
        });
      }
    },
    [modalChoose.status],
  );
  return (
    <Block block colorTheme="bg_default" marginTop={10} paddingHorizontal={16}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        <Block paddingTop={16}>
          <Text fontSize={14} colorTheme="text_secondary" fontWeight="400">
            {translate('generalInformation')}
          </Text>
          <Block justifyContent="center" alignItems="center">
            <TouchableOpacity onPress={() => setOpen(true)}>
              <Block
                justifyContent="center"
                alignItems="center"
                width={98}
                marginBottom={16}
                height={98}
                borderRadius={16}
                marginTop={16}
                colorTheme="bg_neutral">
                <Image
                  source={
                    dataCustomer.image != null
                      ? {uri: dataCustomer.image}
                      : ImageAssets.CameraSelect
                  }
                  style={styles.imageStyle(dataCustomer.image)}
                  resizeMode="cover"
                />
              </Block>
            </TouchableOpacity>
          </Block>
        </Block>
        <AppInput
          label={translate('customerName')}
          value={
            dataCustomer.customer_name ? dataCustomer.customer_name : '---'
          }
          editable={true}
          hiddenRightIcon={true}
          isRequire={true}
          contentStyle={styles.contentStyle}
          styles={{marginBottom: 20}}
          onChangeValue={text =>
            startTransition(() => {
              setDataCustomer(prev => ({...prev, customer_name: text}));
            })
          }
        />
        <AppInput
          label={translate('customerCode')}
          value={
            dataCustomer.customer_code ? dataCustomer.customer_code : '---'
          }
          editable={true}
          hiddenRightIcon={true}
          isRequire={true}
          contentStyle={styles.contentStyle}
          styles={{marginBottom: 20}}
          onChangeValue={text =>
            startTransition(() => {
              setDataCustomer(prev => ({...prev, customer_code: text}));
            })
          }
        />
        <AppInput
          label={translate('customerType')}
          isRequire={true}
          contentStyle={styles.contentStyle}
          value={
            dataCustomer.customer_type
              ? translate(dataCustomer.customer_type)
              : '---'
          }
          editable={false}
          styles={{marginBottom: 20}}
          onPress={() => {
            //   setTypeFilter(AppConstant.CustomerFilterType.loai_khach_hang);
            setModalData({
              type: 'customer_type',
              status: true,
            });
            Keyboard.dismiss();
            //   filterRef.current?.snapToIndex(0);
          }}
          rightIcon={
            <TextInput.Icon
              icon={'chevron-down'}
              style={{width: 24, height: 24}}
              color={theme.colors.text_secondary}
            />
          }
        />
        <AppInput
          label={translate('groupCustomer')}
          value={
            dataCustomer.customer_group ? dataCustomer.customer_group : '---'
          }
          editable={false}
          isRequire={true}
          contentStyle={styles.contentStyle}
          styles={{marginBottom: 20}}
          onPress={() => {
            setModalData({
              type: 'customer_group',
              status: true,
            });
            //   setTypeFilter(AppConstant.CustomerFilterType.nhom_khach_hang);
            //   filterRef.current?.snapToIndex(0);
          }}
          rightIcon={
            <TextInput.Icon
              icon={'chevron-down'}
              style={{width: 24, height: 24}}
              color={theme.colors.text_secondary}
            />
          }
        />
        <AppInput
          label={translate('area')}
          value={
            dataCustomer.territory != null ? dataCustomer.territory : '---'
          }
          editable={false}
          isRequire={false}
          contentStyle={styles.contentStyle}
          styles={{marginBottom: 20}}
          onPress={() => {
            setModalOpen(true);
          }}
          rightIcon={
            <TextInput.Icon
              icon={'chevron-down'}
              style={{width: 24, height: 24}}
              color={theme.colors.text_secondary}
            />
          }
        />
        <AppInput
          label={translate('dob')}
          value={moment(date).format('DD/MM/YYYY')}
          editable={false}
          contentStyle={styles.contentStyle}
          styles={{marginBottom: 20}}
          onPress={() => {
            setOpenDate(true);
          }}
          rightIcon={
            <TextInput.Icon
              icon={'calendar'}
              style={{width: 24, height: 24}}
              color={theme.colors.text_secondary}
            />
          }
        />
        <AppInput
          label={translate('gland')}
          value={
            dataCustomer.routers && dataCustomer.routers?.length > 0
              ? dataCustomer.routers[0]?.router_name
              : '---'
          }
          editable={false}
          isRequire={true}
          contentStyle={styles.contentStyle}
          styles={{marginBottom: 20}}
          onPress={() => {
            setModalData({
              type: 'gland',
              status: true,
            });
            //   setTypeFilter(AppConstant.CustomerFilterType.tuyen);
            //   filterRef.current?.snapToIndex(0);
          }}
          rightIcon={
            <TextInput.Icon
              icon={'chevron-down'}
              style={{width: 24, height: 24}}
              color={theme.colors.text_secondary}
            />
          }
        />
        <AppInput
          label={translate('frequency')}
          // value={dataCustomer.frequency ? converArr(dataCustomer.frequency) : ''}
          value={
            dataCustomer?.routers && dataCustomer?.routers?.length > 0
              ? dataCustomer?.routers?.[0].frequency &&
                dataCustomer?.routers?.[0]?.frequency &&
                typeof dataCustomer?.routers?.[0]?.frequency === 'string'
                ? dataCustomer.routers[0].frequency
                : dataCustomer?.routers?.[0].frequency &&
                  dataCustomer?.routers[0].frequency.length > 0
                ? dataCustomer?.routers?.[0].frequency.join(';')
                : ''
              : ''
          }
          editable={false}
          isRequire={false}
          contentStyle={styles.contentStyle}
          styles={{marginBottom: 20}}
          onPress={() => {
            setModalData({
              type: 'frequency',
              status: true,
            });
            //   setTypeFilter(AppConstant.CustomerFilterType.tan_suat);
            //   filterRef.current?.snapToIndex(0);
          }}
          rightIcon={
            <TextInput.Icon
              icon={'chevron-down'}
              style={{width: 24, height: 24}}
              color={theme.colors.text_secondary}
            />
          }
        />
        <AppInput
          label={translate('debtLimit')}
          value={
            dataCustomer.credit_limits && dataCustomer.credit_limits?.length > 0
              ? String(
                  convertToMoneyFormat(
                    reverseFormatNumber(dataCustomer.credit_limits[0]),
                  ),
                )
              : ''
          }
          editable={true}
          hiddenRightIcon={false}
          isRequire={false}
          rightIcon={<TextInput.Affix text="VND" />}
          contentStyle={styles.contentStyle}
          styles={{marginBottom: 20}}
          onChangeValue={text => {
            // console.log(val,'val')
            let revText = reverseFormatNumber(text);
            // console.log(revText, 'revText');
            startTransition(() => {
              let val = convertToMoneyFormat(revText);
              setDataCustomer(prev => ({...prev, credit_limits: [val]}));
            });
          }}
        />
        <AppInput
          label={translate('description')}
          value={dataCustomer.customer_details ?? ''}
          editable={true}
          isRequire={false}
          contentStyle={styles.contentStyle}
          styles={{marginBottom: 20}}
          inputProp={{
            multiline: true,
          }}
          hiddenRightIcon={true}
          onChangeValue={text =>
            startTransition(() => {
              setDataCustomer(prev => ({...prev, customer_details: text}));
            })
          }
        />
        <AppInput
          label={translate('websiteUrl')}
          value={dataCustomer.website ?? ''}
          editable={true}
          isRequire={false}
          contentStyle={styles.contentStyle}
          styles={{marginBottom: 20}}
          hiddenRightIcon={true}
          onChangeValue={text =>
            startTransition(() => {
              setDataCustomer(prev => ({...prev, website: text}));
            })
          }
        />
        <Block
          marginBottom={10}
          direction="row"
          alignItems="center"
          justifyContent="space-between">
          <Text
            fontSize={14}
            fontWeight="500"
            lineHeight={21}
            colorTheme="text_secondary">
            {translate('address')}
          </Text>
          {isPrimaryAddress && (
            <TouchableOpacity onPress={onPressTrash}>
              <SvgIcon source="Trash" size={26} color="text_disable" />
            </TouchableOpacity>
          )}
        </Block>
        {isPrimaryAddress ? (
          dataCustomer.address &&
          dataCustomer.address.map((item, index) => {
            return (
              <CardEditAddress
                type="address"
                key={item.name}
                onPressCard={onEditdata}
                address={item}
                primaryAddress={dataCustomer.customer_primary_address}
              />
            );
          })
        ) : (
          <ButtonLayout
            firstLabel="Thêm mới"
            secondLabel="Chọn địa chỉ"
            onPressAdding={onPressAddingAddress}
            onPressChoose={onPressChooseAddress}
            isExist={
              dataCustomer.address && dataCustomer.address?.length > 0
                ? true
                : false
            }
          />
        )}
        <Block
          marginBottom={10}
          direction="row"
          alignItems="center"
          justifyContent="space-between">
          <Text
            fontSize={14}
            fontWeight="500"
            lineHeight={21}
            colorTheme="text_secondary">
            {translate('contact')}
          </Text>
          {isPrimaryContact && (
            <TouchableOpacity onPress={onPressTrashContact}>
              <SvgIcon source="Trash" size={26} color="text_disable" />
            </TouchableOpacity>
          )}
        </Block>
        {isPrimaryContact ? (
          dataCustomer.contacts &&
          dataCustomer.contacts.map((item, index) => {
            return (
              <CardEditAddress
                type="contact"
                key={item.name}
                contact={item}
                onPressCard={onEditdata}
                primaryContact={dataCustomer.customer_primary_contact}
              />
            );
          })
        ) : (
          <ButtonLayout
            firstLabel="Thêm mới"
            secondLabel="Chọn liên hệ"
            onPressAdding={onPressAddingContact}
            onPressChoose={onPressChooseContact}
            isExist={
              dataCustomer.contacts && dataCustomer.contacts?.length > 0
                ? true
                : false
            }
          />
        )}
      </ScrollView>
      <DatePickerModal
        locale="vi"
        mode="single"
        visible={openDate}
        label={translate('chooseBirthday')}
        onDismiss={onDismissSingle}
        date={date}
        onConfirm={onConfirmSingle}
      />
      <ModalArea
        openModal={modalOpen}
        setOpenModal={setModalOpen}
        listTerritory={listTerritory}
        data={dataCustomer as any}
        setData={setDataCustomer as any}
        onBackButtonPress={onBackButtonPress}
      />
      <ModalCamera
        modal={open}
        onBackButtonPress={onBackButtonCamera}
        handleCameraPicker={handleCameraPicker}
        handleImagePicker={handleImagePicker}
      />
      <ModalEditAddress
        visible={modalEditAddress.status}
        onBackButtonPress={onCloseEditAddress}
        setData={setDataCustomer}
        dataCustomer={dataCustomer}
        type={modalEditAddress.type}
        defaultEditData={defaultDataEdit}
        setDefaultEditData={setDefaultDataEdit}
      />
      <ModalChoose
        visible={modalChoose.status}
        onBackButtonPress={onCloseModal}
        type={modalChoose.type}
        listAddress={dataCustomer.address || []}
        listContact={dataCustomer.contacts || []}
        onPressData={onPressData}
        onEditData={onEditdata}
        onPressAdding={() => {
          modalChoose.type === 'address'
            ? onPressAddingAddress()
            : onPressAddingContact();
        }}
        // defaultData={defaultDataEdit}
      />
      <ModalData
        isVisible={modalData.status}
        onBackButton={onCloseModal}
        type={modalData.type}
        data={dataCustomer}
        setData={setDataCustomer}
      />

      <Block>
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={onUpdateCustomer}>
          <Text
            fontSize={14}
            colorTheme="bg_default"
            fontWeight="500"
            lineHeight={24}>
            {translate('save')}
          </Text>
        </TouchableOpacity>
      </Block>
    </Block>
  );
};

export default React.memo(FormData, isEqual);

const formStyles = (theme: AppTheme) =>
  StyleSheet.create({
    imageStyle: (image: string) =>
      ({
        width: image != null ? 98 : 32,
        height: image != null ? 98 : 32,
        borderRadius: 16,
      } as ImageStyle),
    contentStyle: {
      color: theme.colors.text_secondary,
      fontWeight: '400',
      fontSize: 16,
    } as TextStyle,
    scrollView: {
      flex: 1,
      zIndex: 99999,
      overflow: 'scroll',
    } as ViewStyle,
    confirmButton: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.primary,
      height: 36,
      borderRadius: 20,
      marginVertical: 8,
    } as ViewStyle,
  });
