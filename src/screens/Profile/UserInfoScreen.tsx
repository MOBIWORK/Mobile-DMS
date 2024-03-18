import React, {useLayoutEffect, useRef, useState} from 'react';
import {MainLayout} from '../../layouts';
import {AppBottomSheet, AppHeader} from '../../components/common';
import {useIsFocused, useNavigation, useTheme} from '@react-navigation/native';
import {NavigationProp} from '../../navigation/screen-type';
import {useTranslation} from 'react-i18next';
import {EditAccountInfo, IUser} from '../../models/types';
import {useSelector} from '../../config/function';
import {Image, TouchableOpacity, View, Text} from 'react-native';
import InfoItem from './components/UserInfoItem';
import {CameraUtils, CommonUtils} from '../../utils';
import {ApiConstant, ScreenConstant} from '../../const';
import {ImageAssets} from '../../assets';
import {appActions} from '../../redux-store/app-reducer/reducer';
import {useDispatch} from 'react-redux';
import {AppService} from '../../services';
import {IProfile} from '../../services/appService';
import BottomSheet from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/BottomSheet';
import {DatePickerModal} from 'react-native-paper-dates';
import {SingleChange} from 'react-native-paper-dates/lib/typescript/Date/Calendar';

const UserInfoScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const {t: getLabel, i18n} = useTranslation();
  const {colors} = useTheme();
  const dispatch = useDispatch();
  const isFocus = useIsFocused();

  const genderRef = useRef<BottomSheet>(null);
  const cameraRef = useRef<BottomSheet>(null);

  const user: IUser = useSelector(state => state.app.userProfile);

  // @ts-ignore
  const [dataInfo, setData] = useState<EditAccountInfo>({});
  const [openDate, setOpenDate] = useState<boolean>(false);
  const [date, setDate] = useState<Date>();
  const [genderData, setGenderData] = useState<
    {
      gender: string;
      isSelected: boolean;
    }[]
  >([]);

  const onConfirmSingle = React.useCallback<SingleChange>(
    params => {
      setOpenDate(false);
      const newDate = new Date(params.date ?? '');
      updateProfile({date_of_birth: newDate.getTime() / 1000}).then(() =>
        setDate(params.date),
      );
    },
    [setOpenDate, setDate],
  );

  const onDismissSingle = React.useCallback(() => {
    setOpenDate(false);
  }, [setOpenDate]);

  const getData = () => {
    setData({
      avatar: user?.image,
      name: user?.employee_name,
      email: user?.user_id,
      phone: user?.cell_number,
      bornDate: user?.date_of_birth,
      gender: user?.gender,
      address: user?.current_address,
    });
    const newGenderData = [
      {
        gender: getLabel('male'),
        isSelected: user?.gender === 'Male',
      },
      {
        gender: getLabel('female'),
        isSelected: user?.gender === 'Female',
      },
    ];

    setGenderData(newGenderData);
  };

  const updateUser = async () => {
    const response: any = await AppService.getUserProfile();
    if (Object.keys(response.result).length > 0) {
      const info: IUser = response.result;
      setData({
        avatar: info.image,
        name: info.employee_name,
        email: info.user_id,
        phone: info.cell_number,
        bornDate: info.date_of_birth,
        gender: info.gender,
        address: info.current_address,
      });
      const newGenderData = [
        {
          gender: getLabel('male'),
          isSelected: info.gender === 'Male',
        },
        {
          gender: getLabel('female'),
          isSelected: info.gender === 'Female',
        },
      ];

      setGenderData(newGenderData);
      //set userInfo storage
      dispatch(appActions.setUserProfile(info));
    }
  };

  const updateAvtFromCamera = async () => {
    CameraUtils.openImagePickerCamera((img, base64) => {
      updateProfile({image: base64});
    });
  };

  const updateAvrFromLibrary = () => {
    CameraUtils.openImagePicker((img, base64) => {
      updateProfile({image: base64});
    });
  };

  const updateProfile = async (data: IProfile) => {
    dispatch(appActions.setProcessingStatus(true));
    await CommonUtils.CheckNetworkState();
    const response: any = await AppService.updateProfile(data);
    if (response.status === ApiConstant.STT_OK) {
      await updateUser();
    }
    dispatch(appActions.setProcessingStatus(false));
  };

  useLayoutEffect(() => {
    if (isFocus) {
      getData();
    }
  }, [isFocus]);

  const genderItem = (data: {gender: string; isSelected: boolean}[]) => {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'flex-start',
          paddingHorizontal: 16,
        }}>
        {data.map((item, index) => {
          return (
            <TouchableOpacity
              onPress={() => {
                updateProfile({
                  gender: item.gender === getLabel('male') ? 'Male' : 'Female',
                });
                genderRef.current && genderRef.current.close();
              }}
              key={index}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                marginVertical: 8,
              }}>
              <Text style={{fontSize: 16, color: colors.text_primary}}>
                {getLabel(item.gender)}
              </Text>
              <Image
                source={ImageAssets.CheckIcon}
                style={{width: 24, height: 24}}
                tintColor={item.isSelected ? colors.primary : colors.bg_default}
                resizeMode={'cover'}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const changeAvtItem = () => {
    return (
      <>
        <TouchableOpacity
          style={{marginHorizontal: 16, marginVertical: 8}}
          onPress={() => {
            cameraRef.current?.close();
            updateAvtFromCamera();
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}>
            <Image
              source={ImageAssets.CameraSelect}
              style={{
                width: 24,
                height: 24,
                tintColor: colors.text_primary,
              }}
              resizeMode="contain"
            />
            <Text
              style={{
                color: colors.text_primary,
                marginLeft: 8,
                fontSize: 16,
              }}>
              {getLabel('takePicture')}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{marginVertical: 16, marginHorizontal: 16}}
          onPress={() => {
            cameraRef.current?.close();
            updateAvrFromLibrary();
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}>
            <Image
              source={ImageAssets.ImageLibrary}
              style={{
                width: 24,
                height: 24,
                tintColor: colors.text_primary,
              }}
              resizeMode="contain"
            />
            <Text
              style={{
                color: colors.text_primary,
                marginLeft: 8,
                fontSize: 16,
              }}>
              {getLabel('chooseFromLibrary')}
            </Text>
          </View>
        </TouchableOpacity>
      </>
    );
  };

  return (
    <MainLayout style={{flex: 1, backgroundColor: colors.bg_neutral}}>
      <AppHeader
        // style={{flex: 0.5}}
        label={getLabel('infor')}
        onBack={() => navigation.goBack()}
      />
      <View
        style={{
          // flex: 9.5,
          paddingHorizontal: 16,
          backgroundColor: colors.bg_default,
          borderRadius: 8,
          marginTop: 32,
        }}>
        <InfoItem
          title={getLabel('avatar')}
          img={dataInfo.avatar}
          onPress={() => cameraRef.current && cameraRef.current.snapToIndex(0)}
        />
        <InfoItem title={getLabel('name')} content={dataInfo.name} unEdit />
        <InfoItem title={'Email'} content={dataInfo.email} unEdit />
        <InfoItem
          title={getLabel('gender')}
          content={getLabel(
            dataInfo.gender ? dataInfo.gender.toLocaleLowerCase() : '',
          )}
          onPress={() => genderRef.current && genderRef.current.snapToIndex(0)}
        />
        <InfoItem
          title={getLabel('phoneNumber')}
          content={dataInfo.phone}
          onPress={() =>
            navigation.navigate(ScreenConstant.EDIT_ACCOUNT, {
              title: getLabel('phoneNumber'),
              content: dataInfo.phone ?? '',
            })
          }
        />
        <InfoItem
          title={getLabel('dateOfBirth')}
          content={CommonUtils.convertDate(
            new Date(dataInfo.bornDate).getTime(),
          )}
          onPress={() => setOpenDate(true)}
        />
        <InfoItem
          title={getLabel('address')}
          content={dataInfo.address}
          borderBottomDisable
          onPress={() =>
            navigation.navigate(ScreenConstant.EDIT_ACCOUNT, {
              title: getLabel('address'),
              content: dataInfo.address ?? '',
            })
          }
        />
      </View>
      <DatePickerModal
        locale={i18n.language ?? 'vi'}
        mode="single"
        startYear={1900}
        visible={openDate}
        label={getLabel('selectDate')}
        onDismiss={onDismissSingle}
        date={date}
        onConfirm={onConfirmSingle}
      />
      <AppBottomSheet bottomSheetRef={genderRef}>
        {genderItem(genderData)}
      </AppBottomSheet>
      <AppBottomSheet bottomSheetRef={cameraRef}>
        {changeAvtItem()}
      </AppBottomSheet>
    </MainLayout>
  );
};
export default UserInfoScreen;
