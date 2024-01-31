import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MainLayout } from '../../../layouts';
import {
  AppAvatar,
  AppBottomSheet,
  AppButton,
  AppCheckBox,
  AppHeader,
  AppIcons,
  AppInput,
} from '../../../components/common';
import {TextInput} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '../../../navigation';
import { Pressable, Text, TouchableOpacity, View } from 'react-native';
import { IStaff, KeyAbleProps, StaffType } from '../../../models/types';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import FilterListComponent, { IFilterType } from '../../../components/common/FilterListComponent';
import { useSelector } from '../../../config/function';
import { CheckinService } from '../../../services';
import { ApiConstant } from '../../../const';
import { useTranslation } from 'react-i18next';
import { AppTheme, useTheme } from '../../../layouts/theme';
import { StyleSheet, TextInput as Input, ViewStyle, TextStyle } from 'react-native';
import { ICON_TYPE } from '../../../const/app.const';


const arrTypeNote = [
  {
    label: "Ghi chú về cửa hàng",
    value: "Ghi chú về cửa hàng",
    isSelected: false
  },
  {
    label: "Đã checkin của hàng",
    value: "Đã checkin của hàng",
    isSelected: false
  },
  {
    label: "Chưa đặt hàng",
    value: "Chưa đặt hàng",
    isSelected: false
  },
  {
    label: "Lỗi đặt trả hàng",
    value: "Lỗi đặt trả hàng",
    isSelected: false
  },
]

const AddNote = () => {

  const theme = useTheme();
  const { t: getLabel } = useTranslation();
  const { colors } = theme;
  const styles = createStyle(theme);
  const navigation = useNavigation<NavigationProp>();
  const bottomSheetRef = useRef<BottomSheet>();
  const snapPoint = useMemo(() => (["80"]), [])
  const dataCheckin = useSelector(state => state.app.dataCheckIn);
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [sentEmail, setSendEmail] = useState<boolean>(false);
  const [dataTypeNote, setDataTypeNote] = useState<IFilterType[]>(arrTypeNote);
  const [staffData, setStaffData] = useState<StaffType[]>([]);

  const onCreateNoteCheckin = async () => {
    const objectData = {
      title: title,
      content: content,
      custom_checkin_id: dataCheckin.checkin_id,
      email: [
        "phongtran100401@gmail.com"
      ]
    }
    const { status } = await CheckinService.createNote(objectData);
    if (status === ApiConstant.STT_CREATED) navigation.goBack();
  }

  const renderItem = (item: StaffType) => {
    return (
      <View style={styles.viewItem}>
        <View style={styles.flex}>
          <AppAvatar size={48} url={item.image} name={item.first_name} />
          <View style={{ marginLeft: 8 }}>
            <Text style={styles.codeEmploye}>{item.first_name}</Text>
            <Text style={styles.nameEmploye}>{item.user_id}</Text>
          </View>
        </View>
        <View style={{ paddingRight: 8 }}>
          <AppCheckBox styles={{ borderRadius: 10 }} status={item.isCheck ? true : false} onChangeValue={() => onCheckStaff(item, item.isCheck ? item.isCheck : false)} />
        </View>
      </View>
    )
  }

  const onCheckStaff = (staff: any, isCheck: boolean) => {
    if (!isCheck) {
      const newArr = staffData.map(item => {
        if (item.name == staff.name) {
          item.isCheck = true
        }
        return item;
      })
      setStaffData(newArr);
    } else {
      const newArr = staffData.map(item => {
        if (item.name == staff.name) {
          item.isCheck = false
        }
        return item;
      })
      setStaffData(newArr);
    }
    const arrStf = staffData.filter(item => item.isCheck == true);
    // setSelectPersonal(arrStf);
  }

  const onOpenBottonSheet = () =>{
    setSendEmail(true);
    if(bottomSheetRef.current) bottomSheetRef.current.snapToIndex(0);
  }

  const fetchDataStaff = async () => {
    const { data, status }: KeyAbleProps = await CheckinService.getListStaff();
    console.log(status);

    if (status === ApiConstant.STT_OK) {
      const result = data.result;

      setStaffData(result)
    }
  }

  useEffect(() => {
    fetchDataStaff();
  }, [])

  return (
    <MainLayout>
      <AppHeader onBack={() => navigation.goBack()} label={'Thêm ghi chú'} />

      <View style={{ flex: 1, justifyContent: "space-between" }}>
        <View >
          <View style={{ marginTop: 16, gap: 16 }}>
            <AppInput
              label={'Loại ghi chú'}
              value={title}
              onChangeValue={setTitle}
              rightIcon={
                <TextInput.Icon
                  icon={'chevron-down'}
                  style={{ width: 24, height: 24 }}
                  color={theme.colors.text_secondary}
                />
              }
            />
            <AppInput
              label={'Nội dung'}
              value={content}
              onChangeValue={setContent}
              inputProp={{
                numberOfLines: 1,
                multiline: true,
              }}
            />
          </View>
          <TouchableOpacity
            onPress={() => onOpenBottonSheet()}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
              marginTop: 24,
            }}>
            <AppCheckBox
              status={sentEmail}
              onChangeValue={() => onOpenBottonSheet()}
            />
            <Text style={{ color: theme.colors.text_primary, marginLeft: 8 }}>
              Gửi email đến mọi người
            </Text>
          </TouchableOpacity>


          <AppBottomSheet bottomSheetRef={bottomSheetRef} snapPointsCustom={snapPoint}>
            
          </AppBottomSheet>
        </View>

        <AppButton
          label={"Lưu"}
          style={{ width: "100%", marginBottom: 30 }}
          onPress={() => onCreateNoteCheckin()}
        />
      </View>

    </MainLayout>
  );
};
export default AddNote;

const createStyle = (theme: AppTheme) => StyleSheet.create({
  flex: {
    flexDirection: "row",
    alignItems: "center"
  } as ViewStyle,
  viewItem: {
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  } as ViewStyle,
  codeEmploye: {
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 24,
    color: theme.colors.text_primary
  } as TextStyle,
  nameEmploye: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 21,
    color: theme.colors.text_secondary
  } as TextStyle,
  textBt: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "500",
    color: theme.colors.action
  } as TextStyle,
  deleteBt: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.bg_default,
    width: 20,
    height: 20,
    borderRadius: 10,
    padding: 4,
    position: "absolute", top: -4, right: -4
  } as ViewStyle,
  viewBtt: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.bg_neutral,
    width: 16, height: 16,
    borderRadius: 8
  } as ViewStyle,
  containerSearch: {
    height: 50,
    backgroundColor: theme.colors.bg_neutral,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 12,
    borderRadius: 4
  } as ViewStyle
})
