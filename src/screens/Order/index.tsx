import React, { useMemo, useRef, useState } from 'react'
import { MainLayout } from '../../layouts'
import { AppBottomSheet, AppButton, AppHeader, AppIcons, AppInput } from '../../components/common'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Image, Text, View } from 'react-native'
import { ImageAssets } from '../../assets'
import { useNavigation, useTheme } from '@react-navigation/native'
import FilterView from '../../components/common/FilterView'
import ButtonFilter from '../../components/common/ButtonFilter'
import { StyleSheet } from 'react-native'
import AppContainer from '../../components/AppContainer'
import { ICON_TYPE } from '../../const/app.const'
import { Button, TextInput } from 'react-native-paper';
import BottomSheet from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/BottomSheet'
import { AppConstant, ScreenConstant } from '../../const'
import FilterListComponent, { IFilterType } from '../../components/common/FilterListComponent'
import { NavigationProp } from '../../navigation'

const OrderList = () => {

    const { colors } = useTheme();
    const bottomSheetRef = useRef<BottomSheet>(null);
    const bottomSheetRefStatus = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['90%'], []);
    const navigation = useNavigation<NavigationProp>();

    const [dataStatus, setDataStatus] = useState<IFilterType[]>([
        {
            label: "Tất cả",
            isSelected: true
        },
        {
            label: "Chờ gửi",
            isSelected: false
        },
        {
            label: "Chờ duyệt",
            isSelected: false
        },
        {
            label: "Đã duyệt",
            isSelected: false
        },
    ])
    const [dataTimeOrder, setDataTimeOrder] = useState<IFilterType[]>([
        {
            label: "Tất cả",
            isSelected: true
        },
        {
            label: "Hôm nay",
            isSelected: false
        },
        {
            label: "Tuần này",
            isSelected: false
        },
        {
            label: "Tháng này",
            isSelected: false
        },
        {
            label: "Tháng trước",
            isSelected: false
        },
    ])
    const [dataTypeOrder, setDataTypeOrder] = useState<IFilterType[]>([
        {
            label: "Phiếu đặt hàng",
            isSelected: true
        },
        {
            label: "Phiếu mua hàng",
            isSelected: false
        },
    ])

    const [dataFilter,setDataFilter] = useState<IFilterType[]>([])
    const [label ,setLabel] = useState<string>("")
    const [status ,setStatus] = useState<string>("Tất cả")
    const [timeOrder ,setTimeOrder] = useState<string>("Tất cả")
    const [typeOrder ,setTypeOrder] = useState<string>("Phiếu đặt hàng")

    const onOpenBottomSheet = (type :string) =>{
        switch (type) {
            case "status":
                setLabel("Trạng thái");
                setDataFilter(dataStatus);
                break;
            case "timeOder":
                setLabel("Thời gian");
                setDataFilter(dataTimeOrder);
                break;
            case "typeOrder":
                setLabel("Loại phiếu");
                setDataFilter(dataTypeOrder);
                break;
            default:
                setDataFilter([])
                break;
        }
        if(bottomSheetRefStatus.current){
            bottomSheetRefStatus.current.snapToIndex(0)
        }
    }

    const onChangeData = (item: IFilterType) => {
        switch (label) {
            case "Trạng thái": {
                const newData = dataStatus.map(itemRes => {
                    if (item.label === itemRes.label) {
                        return { ...itemRes, isSelected: true };
                    } else {
                        return { ...itemRes, isSelected: false };
                    }
                });
                setStatus(item.label);
                setDataStatus(newData);
                break;
            }
            case "Thời gian": {
                    const newData = dataTimeOrder.map(itemRes => {
                        if (item.label === itemRes.label) {
                            return { ...itemRes, isSelected: true };
                        } else {
                            return { ...itemRes, isSelected: false };
                        }
                    });
                    setTimeOrder(item.label);
                    setDataTimeOrder(newData);
                    break;
            }
            case "Loại phiếu": {
                const newData = dataTypeOrder.map(itemRes => {
                    if (item.label === itemRes.label) {
                        return { ...itemRes, isSelected: true };
                    } else {
                        return { ...itemRes, isSelected: false };
                    }
                });
                setTypeOrder(item.label);
                setDataTypeOrder(newData);
                break;
            }

            default:
                break;
        }
        
        if(bottomSheetRefStatus.current) {
            bottomSheetRefStatus.current.close();
        }
    }

    const onSubmitFilter = ()=>{
        if(bottomSheetRef.current){
            bottomSheetRef.current.close();
        }
    }

    const renderUiItem = () => {
        return (
            <View style={[styles.containerItem, { backgroundColor: colors.bg_default }]}>
                <View style={[styles.flexSpace, { paddingBottom: 8 }]}>
                    <Text style={[styles.nameCustomer, { color: colors.text_primary }]}>
                        Tên khách hàng - Mã KH
                    </Text>
                    <View style={[styles.statusView, { backgroundColor: "rgba(255, 171, 0, 0.08)" }]}>
                        <Text style={[styles.textStatus, { color: colors.warning }]}>Chờ duyệt</Text>
                    </View>
                </View>
                <View style={{ paddingVertical: 8, borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.border }}>
                    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
                        <AppIcons iconType={ICON_TYPE.IonIcon} name='barcode-outline' size={18} color={colors.text_primary} />
                        <Text numberOfLines={1} ellipsizeMode='tail' style={[styles.itemDesc, { marginLeft: 6, color: colors.text_primary }]}>DH-12345</Text>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
                        <AppIcons iconType={ICON_TYPE.Feather} name='map-pin' size={18} color={colors.text_primary} />
                        <Text numberOfLines={1} ellipsizeMode='tail' style={[styles.itemDesc, { marginLeft: 6, color: colors.text_primary }]}>101 Tôn Dật Tiên, Tân Phú, Quận 7, Thành phố Hồ Chí Minh</Text>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
                        <AppIcons iconType={ICON_TYPE.Feather} name='clock' size={18} color={colors.text_primary} />
                        <Text numberOfLines={1} ellipsizeMode='tail' style={[styles.itemDesc, { marginLeft: 6, color: colors.text_primary }]}>08:00, 20/11/2023</Text>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
                        <AppIcons iconType={ICON_TYPE.Feather} name='truck' size={18} color={colors.text_primary} />
                        <Text numberOfLines={1} ellipsizeMode='tail' style={[styles.itemDesc, { marginLeft: 6, color: colors.text_primary }]}>20/11/2023</Text>
                    </View>
                </View>
                <View style={[styles.flexSpace, { marginTop: 8 }]}>
                    <Button icon="printer-outline"
                        mode="outlined"
                        style={{
                            borderColor: colors.action
                        }}
                        textColor={colors.action}
                        onPress={() => console.log('Pressed')}
                    >
                        In đơn
                    </Button>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Text style={{ fontSize: 12, lineHeight: 18, fontWeight: "500", marginRight: 10, color: colors.text_primary }}>Tổng tiền :</Text>
                        <Text style={[styles.nameCustomer, { color: colors.text_primary }]}>7.000.000</Text>
                    </View>
                </View>
            </View>
        )
    }

    const bottomSheetFilter = () => {
        return (
            <View style={{ padding: 16, paddingTop: 0, height: '100%' }}>
                <AppHeader
                    label={'Bộ lọc'}
                    onBack={() =>
                        bottomSheetRef.current && bottomSheetRef.current.close()
                    }
                    backButtonIcon={
                        <AppIcons
                            iconType={AppConstant.ICON_TYPE.IonIcon}
                            name={'close'}
                            size={24}
                            color={colors.text_primary}
                        />
                    }
                />
                <View style={{ marginTop: 32, rowGap: 24 }}>
                    <AppInput
                        label={'Thời gian đặt hàng'}
                        value={timeOrder}
                        editable={false}
                        onPress={()=> onOpenBottomSheet("timeOder")}
                        rightIcon={
                            <TextInput.Icon
                                onPress={()=> onOpenBottomSheet("timeOder")}
                                icon={'chevron-down'}
                                style={{ width: 24, height: 24 }}
                                color={colors.text_secondary}
                            />
                        }
                    />
                    <AppInput
                        label={'Loại phiếu'}
                        value={typeOrder}
                        editable={false}
                        onPress={()=> onOpenBottomSheet("typeOrder")}
                        rightIcon={
                            <TextInput.Icon
                                onPress={()=> onOpenBottomSheet("typeOrder")}
                                icon={'chevron-down'}
                                style={{ width: 24, height: 24 }}
                                color={colors.text_secondary}
                            />
                        }
                    />
                </View>
                <View
                    style={{
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                        paddingTop: 10,
                        position: 'absolute',
                        bottom: 0,
                        height: AppConstant.HEIGHT * 0.1,
                        width: '100%',
                        alignSelf: 'center',
                    }}>
                    <AppButton
                        style={{ width: '45%', backgroundColor: colors.bg_neutral }}
                        label={'Bỏ qua'}
                        styleLabel={{ color: colors.text_secondary }}
                        onPress={() => bottomSheetRef.current && bottomSheetRef.current.close()}
                    />
                    <AppButton
                        style={{ width: '45%' }}
                        label={'Áp dụng'}
                        onPress={() => onSubmitFilter()}
                    />
                </View>
            </View>
        );
    };


    return (
        <>
            <MainLayout style={{ backgroundColor: colors.bg_neutral }}>
                <AppHeader
                    label={'Đơn hàng'}
                    labelStyle={{ textAlign: 'left', marginLeft: 8 }}
                    rightButton={
                        <TouchableOpacity>
                            <Image
                                source={ImageAssets.SearchIcon}
                                style={{ width: 30, height: 30, tintColor: colors.text_secondary }}
                                resizeMode={'cover'}
                            />
                        </TouchableOpacity>
                    }
                />
                <View style={{ flexDirection: "row", marginTop: 16, paddingVertical: 8 }}>
                    <ButtonFilter label='Trạng thái' value={status} onPress={() => onOpenBottomSheet("status")} />
                    <FilterView
                        style={{ marginLeft: 8 }}
                        onPress={() => bottomSheetRef.current && bottomSheetRef.current.snapToIndex(0)}
                    />
                </View>
                <Text style={[styles.countOrder, { color: colors.text_primary, marginTop: 16, marginBottom: 12 }]}>
                    300  <Text style={{ color: colors.text_secondary }}>Đơn hàng</Text>
                </Text>
                <AppContainer>
                    <TouchableOpacity activeOpacity={0.7} onPress={()=> navigation.navigate(ScreenConstant.ORDER_DETAIL_SCREEN)} >
                        {renderUiItem()}
                    </TouchableOpacity>
                </AppContainer>
            </MainLayout>

            <AppBottomSheet bottomSheetRef={bottomSheetRef} snapPointsCustom={snapPoints}>
                {bottomSheetFilter()}
            </AppBottomSheet>

            <AppBottomSheet bottomSheetRef={bottomSheetRefStatus} snapPointsCustom={snapPoints}>
                <FilterListComponent
                    title={label}
                    data={dataFilter}
                    isSearch={false}
                    handleItem={onChangeData}
                    onClose={() => bottomSheetRefStatus.current && bottomSheetRefStatus.current.close()}
                />
            </AppBottomSheet>
        </>

    )
}

export default OrderList;

const styles = StyleSheet.create({
    flexSpace: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    countOrder: {
        fontSize: 14,
        lineHeight: 21,
        fontWeight: "400"
    },
    containerItem: {
        padding: 16,
        borderRadius: 16,
        marginBottom: 16
    },
    textStatus: {
        fontSize: 14,
        lineHeight: 21,
        fontWeight: "500"
    },
    nameCustomer: {
        fontSize: 16,
        lineHeight: 24,
        fontWeight: "500"
    },
    statusView: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8
    },
    itemDesc: {
        fontSize: 14,
        lineHeight: 21,
        fontWeight: "400",

    }
})