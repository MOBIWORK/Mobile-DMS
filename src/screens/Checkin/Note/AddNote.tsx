import React, {useEffect, useRef, useState} from 'react';
import {MainLayout} from '../../../layouts';
import {
  AppAvatar,
  AppCheckBox,
  AppHeader,
  AppIcons,
  AppInput,
  SvgIcon,
} from '../../../components/common';
import {TextInput} from 'react-native-paper';
import {useNavigation, useTheme} from '@react-navigation/native';
import {NavigationProp} from '../../../navigation';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {ImageAssets} from '../../../assets';
import {IStaff} from '../../../models/types';
import BottomSheet from '@gorhom/bottom-sheet';
import SelectedStaff from './SelectedStaff';

const AddNote = () => {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const bottomSheetRef = useRef<BottomSheet>();

  const [content, setContent] = useState<string>('');
  const [sentEmail, setSendEmail] = useState<boolean>(false);

  const [staffData, setStaffData] = useState<IStaff[]>(StaffDataFake);

  const EditAvatarView = () => {
    return (
      <View style={{width: 48, height: 48}}>
        <AppAvatar
          url={'https://th.bing.com/th/id/OIG.ey_KYrwhZnirAkSgDhmg'}
          size={40}
        />
        <SvgIcon
          source={'IconClose'}
          size={20}
          style={{position: 'absolute', top: -5, right: 5}}
        />
      </View>
    );
  };

  return (
    <MainLayout>
      <AppHeader onBack={() => navigation.goBack()} label={'Thêm ghi chú'} />
      <View style={{marginTop: 16, gap: 16}}>
        <AppInput
          label={'Loại ghi chú'}
          value={''}
          editable={false}
          isRequire={true}
          onPress={() => {}}
          rightIcon={
            <TextInput.Icon
              icon={'chevron-down'}
              style={{width: 24, height: 24}}
              color={theme.colors.text_secondary}
            />
          }
        />
        <AppInput
          label={'Nội dung'}
          value={content}
          onChangeValue={setContent}
        />
      </View>
      <TouchableOpacity
        onPress={() => {
          setSendEmail(!sentEmail);
          if (!sentEmail) {
            bottomSheetRef.current?.snapToIndex(0);
          }
        }}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start',
          marginTop: 24,
        }}>
        <AppCheckBox
          status={sentEmail}
          onChangeValue={() => {
            setSendEmail(!sentEmail);
            if (!sentEmail) {
              bottomSheetRef.current?.snapToIndex(0);
            }
          }}
        />
        <Text style={{color: theme.colors.text_primary, marginLeft: 8}}>
          Gửi email đến mọi người
        </Text>
      </TouchableOpacity>
      <SelectedStaff
        bottomSheetRef={bottomSheetRef}
        data={staffData}
        setData={setStaffData}
        onCancel={() => setSendEmail(false)}
      />
    </MainLayout>
  );
};
export default AddNote;
const StaffDataFake: IStaff[] = [
  {
    id: 1,
    name: 'Hà Nguyễn',
    position: 'Software Tester',
    isSelected: false,
  },
  {
    id: 2,
    name: 'Đinh Thùy Linh',
    position: 'Ethical Hacker',
    isSelected: false,
  },
  {
    id: 3,
    name: 'Phương Anh',
    position: 'UI/UX Designer',
    isSelected: false,
  },
  {
    id: 4,
    name: 'Trần Bảo Hân',
    position: 'Software Tester',
    isSelected: false,
  },
  {
    id: 5,
    name: 'Hà Nguyễn',
    position: 'Software Tester',
    isSelected: false,
  },
];