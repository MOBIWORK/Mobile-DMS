import React, { useMemo, useRef, useState } from 'react'
import { MainLayout } from '../../../layouts'
import { AppBottomSheet, AppButton, AppContainer, AppHeader, AppIcons, AppInput } from '../../../components/common'
import { useNavigation } from '@react-navigation/native'
import { NavigationProp } from '../../../navigation'
import { ImageStyle, Pressable, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native'
import { AppTheme, useTheme } from '../../../layouts/theme'
import { Button, TextInput } from 'react-native-paper'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { ICON_TYPE } from '../../../const/app.const'
import { Image } from 'react-native'
import { ImageAssets } from '../../../assets'
import { CommonUtils } from '../../../utils'
import ItemProduct from './components/ItemProduct'
import BottomSheet from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/BottomSheet'
import FilterListComponent, { IFilterType } from '../../../components/common/FilterListComponent'

const CreateOrder = () => {

    const navigation = useNavigation<NavigationProp>();
    const { colors } = useTheme()
    const styles = createSheetStyle(useTheme());
    const bottomSheetRef = useRef<BottomSheet>(null);
    const bottomSheetWh = useRef<BottomSheet>(null);
    const snapPointDetail = useMemo(() => ["70%"], []);

    const [date,setDate] = useState<number>(new Date().getTime())
    const [DataWarehouse,setDataWarehouse] = useState<IFilterType[]>([
        {
            label :"Hn-1946",
            value : 1,
            isSelected : false
        },
        {
            label :"Aphal-TEST",
            value : 2,
            isSelected : false
        }
    ])

    const [warehouse,setWarehouse] = useState<IFilterType>();
    const [products, setPrpducts] = useState<any[]>([{}]);
    const [productsKm, setPrpductsKm] = useState<any[]>([{}]);
    const [toggleTab, setToggleTab] = useState<number>(1);
    const [totalPrice, setTotalPrice] = useState<number>(4100000);

    const renderUiNoData = () => {
        return (
            <View style={[styles.containerNodata]}>
                <View style={{ marginTop: 70 }}>
                    <View style={{ alignItems: "center", rowGap: 8 }}>
                        <Image style={styles.iconImage} source={ImageAssets.IconBill} resizeMode='cover' />
                        <Text style={[styles.textDescNoDt]}>Chọn sản phẩm</Text>
                    </View>
                    <View style={[styles.flexSpace as any, { marginTop: 24 }]}>
                        <Button
                            style={{ width: "48%", marginRight: 16, borderColor: colors.action }}
                            textColor={colors.action}
                            labelStyle={[styles.textBtt as any, { fontWeight: "500" }]}
                            icon="plus" mode="outlined" onPress={() => console.log('Pressed')} >
                            Chọn sản phẩm
                        </Button>
                        <Button
                            style={{ width: "48%", borderColor: colors.action }}
                            textColor={colors.action}
                            labelStyle={[styles.textBtt as any, { fontWeight: "500" }]}
                            icon="barcode-scan" mode="outlined" onPress={() => console.log('Pressed')}>
                            Quét mã
                        </Button>
                    </View>
                </View>
            </View>
        )
    }

    const showDetailProdcut = (item: any) => {
        if (bottomSheetRef.current) bottomSheetRef.current.snapToIndex(0)
    }

    const toggleButtonUi = (tab: number, productKm: number) => {
        return (
            <View style={[styles.flexSpace, { marginBottom: 20 }]}>
                <Pressable
                    onPress={() => setToggleTab(1)}
                    style={[styles.toggleBt(tab == 1 ? true : false)]}
                >
                    <Text style={[styles.txTgBt(tab == 1 ? true : false)]}>Sản phẩm</Text>
                </Pressable>
                <Pressable
                    onPress={() => setToggleTab(2)}
                    style={[styles.toggleBt(tab == 2 ? true : false)]}
                >
                    <Text style={[styles.txTgBt(tab == 2 ? true : false)]}>Sản phẩm KM ({productKm})</Text>
                </Pressable>
            </View>
        )
    }

    const renderProduct = (tab: number) => {
        if (tab == 1) {
            return (
                <>
                    {products.length > 0 ? (
                        <View style={[styles.flexSpace]}>
                            <Button
                                style={{ width: "48%", marginRight: 16, borderColor: colors.action }}
                                textColor={colors.action}
                                labelStyle={[styles.textBtt as any, { fontWeight: "500" }]}
                                icon="plus" mode="outlined" onPress={() => console.log('Pressed')} >
                                Chọn sản phẩm
                            </Button>
                            <Button
                                style={{ width: "48%", borderColor: colors.action }}
                                textColor={colors.action}
                                labelStyle={[styles.textBtt as any, { fontWeight: "500" }]}
                                icon="barcode-scan" mode="outlined" onPress={() => console.log('Pressed')}>
                                Quét mã
                            </Button>
                        </View>
                    ) : renderUiNoData()}
                    <View style={{ marginTop: 20, rowGap: 8 }}>
                        {products.map((item, i) => (
                            <Pressable key={i} onPress={() => showDetailProdcut(item)}>
                                <ItemProduct
                                    name='SP-123554'
                                    dvt='Cái'
                                    quantity={10}
                                    percentage_discount={3}
                                    discount={100000}
                                    price={1000000}
                                />
                            </Pressable>
                        ))}
                    </View>
                </>

            )
        } else {
            return (
                <>
                    <View>
                        {productsKm.map((item, i) => (
                            <Pressable key={i}>
                                <ItemProduct
                                    name='SP-123554'
                                    dvt='Cái'
                                    quantity={10}
                                    price={100000}
                                />
                            </Pressable>
                        ))}
                    </View>
                </>
            )
        }
    }

    const renderDetailProduct = () => {
        return (
            <View style={{ marginTop: 24, rowGap: 20 }}>
                <AppInput label='Mã sản phẩm' value='SP-123554' hiddenRightIcon disable styles={{ backgroundColor: colors.bg_neutral }} />
                <AppInput label='Đơn vị tính'
                    value='Cái'
                    hiddenRightIcon
                    rightIcon={
                        <TextInput.Icon
                            icon={'chevron-down'}
                            color={colors.text_secondary}
                        />
                    }
                />

                <AppInput label='Đơn giá'
                    value='500.000'
                    hiddenRightIcon
                    editable ={false}
                    styles={{backgroundColor :colors.bg_neutral}}
                    rightIcon={
                        <TextInput.Affix text='VND' textStyle={{color :colors.text_secondary ,fontSize :12}} />
                    }
                />
                <AppInput label='Số lượng'
                    value='3'
                    hiddenRightIcon
                />
                
                <AppInput label='Thành tiền'
                    value='1.500.000'
                    hiddenRightIcon
                    editable={false}
                    styles={{backgroundColor :colors.bg_neutral}}
                    rightIcon={
                        <TextInput.Affix text='VND' textStyle={{color :colors.text_secondary ,fontSize :12}} />
                    }
                />
            </View>
        )
    }

    const onChangeWarehouse = (item : IFilterType) =>{
        setWarehouse(item);
        console.log(item);
        
        const newWhs = DataWarehouse.map(item1=> item1.value == item.value ? {...item,isSelected : true} : {...item1,isSelected :false});
        setDataWarehouse(newWhs);
    }

    return (
        <>
            <MainLayout style={styles.layout}>
                <AppHeader label='Tạo đơn đặt' onBack={() => navigation.goBack()} />
                <AppContainer style={styles.appContainer}>
                    <View style={{ rowGap: 20, paddingHorizontal: 16 }}>

                        <View style={{ rowGap: 20 }}>
                            <AppInput
                                label='Ngày giao'
                                value={CommonUtils.convertDate(date)}
                                disable
                                rightIcon={
                                    <TextInput.Icon
                                        icon={'calendar-month-outline'}
                                        size={20}
                                        color={colors.text_secondary}
                                    />
                                }
                            />
                            <AppInput
                                label='Kho xuất'
                                value={warehouse?.label ? warehouse.label : ""}
                                editable={false}
                                onPress={()=> bottomSheetWh.current && bottomSheetWh.current.snapToIndex(0)}
                                rightIcon={
                                    <TextInput.Icon
                                        onPress={()=> bottomSheetWh.current && bottomSheetWh.current.snapToIndex(0)}
                                        icon={'chevron-down'}
                                        color={colors.text_secondary}
                                    />
                                }
                            />
                        </View>

                        <View>
                            <View style={styles.flexSpace}>
                                <Text style={styles.titleSection}>Sản phẩm</Text>
                                <TouchableOpacity>
                                    <AppIcons name='chevron-down' size={22} iconType={ICON_TYPE.Feather} />
                                </TouchableOpacity>
                            </View>
                            <View style={[styles.containerSection]}>

                                {productsKm.length > 0 && toggleButtonUi(toggleTab, productsKm.length)}
                                {renderProduct(toggleTab)}

                            </View>
                        </View>

                        <View>
                            <View style={styles.flexSpace}>
                                <Text style={styles.titleSection}>VAT</Text>
                                <TouchableOpacity>
                                    <AppIcons name='chevron-down' size={22} iconType={ICON_TYPE.Feather} />
                                </TouchableOpacity>
                            </View>
                            <View style={[styles.containerSection, { paddingVertical: 20, rowGap: 20 }]}>
                                <AppInput
                                    value=''
                                    label='Biểu mẫu VAT'
                                    onChangeValue={(txt: string) => { }}
                                    rightIcon={
                                        <TextInput.Icon
                                            icon={'chevron-down'}
                                            color={colors.text_secondary}
                                        />
                                    }
                                />
                                <AppInput
                                    value=''
                                    label='VAT(%)'
                                    onChangeValue={(txt: string) => { }}
                                    disable
                                    styles={{ backgroundColor: colors.bg_neutral }}
                                    rightIcon={
                                        <TextInput.Affix text='%' />
                                    }
                                />
                                <AppInput
                                    value=''
                                    label='Số tiền VAT'
                                    onChangeValue={(txt: string) => { }}
                                    disable
                                    styles={{ backgroundColor: colors.bg_neutral }}
                                    rightIcon={
                                        <TextInput.Affix text='VND' textStyle={{ fontSize: 12 }} />
                                    }
                                />
                            </View>
                        </View>

                        <View>
                            <View style={styles.flexSpace}>
                                <Text style={styles.titleSection}>Chiết khấu đơn</Text>
                                <TouchableOpacity>
                                    <AppIcons name='chevron-down' size={22} iconType={ICON_TYPE.Feather} />
                                </TouchableOpacity>
                            </View>
                            <View style={[styles.containerSection, { paddingVertical: 20, rowGap: 20 }]}>
                                <AppInput
                                    value=''
                                    label='Loại chiết khấu'
                                    rightIcon={
                                        <TextInput.Icon
                                            icon={'chevron-down'}
                                            color={colors.text_secondary}
                                        />
                                    }
                                />
                                <AppInput
                                    value=''
                                    label='Phần trăm chiết khấu'
                                    onChangeValue={(txt: string) => { }}
                                    rightIcon={
                                        <TextInput.Affix text='%' />
                                    }
                                />
                                <AppInput
                                    value=''
                                    label='Số tiền chiết khấu'
                                    onChangeValue={(txt: string) => { }}
                                    rightIcon={
                                        <TextInput.Affix text='VND' textStyle={{ fontSize: 12 }} />
                                    }
                                />
                            </View>
                        </View>

                        <View style={{ marginBottom: 80, }}>
                            <View style={styles.flexSpace}>
                                <Text style={styles.titleSection}>Chi tiết thanh toán</Text>
                                <TouchableOpacity>
                                    <AppIcons name='chevron-down' size={22} iconType={ICON_TYPE.Feather} />
                                </TouchableOpacity>
                            </View>
                            <View style={[styles.containerSection, styles.shadow, { paddingVertical: 16, rowGap: 12 }]}>
                                <View style={styles.flexSpace}>
                                    <Text style={styles.labelPay}>Giá tiền</Text>
                                    <Text style={styles.price}>5.000.000</Text>
                                </View>
                                <View style={styles.flexSpace}>
                                    <Text style={styles.labelPay}>Chiêt khấu</Text>
                                    <Text style={styles.price}>1.000.000</Text>
                                </View>
                                <View style={styles.flexSpace}>
                                    <Text style={styles.labelPay}>VAT</Text>
                                    <Text style={styles.price}>100.000</Text>
                                </View>
                                <View style={[styles.flexSpace, { alignItems: "flex-end" }]}>
                                    <Text style={styles.labelPay}>Tổng tiền</Text>
                                    <Text style={styles.totalPrice}>4.100.000</Text>
                                </View>
                            </View>
                        </View>

                    </View>
                </AppContainer>

                <View style={styles.footerView}>
                    <View style={[styles.flexSpace, { paddingVertical: 12, alignItems: "flex-end" }]}>
                        <Text style={styles.tTotalPrice}>Tổng tiền </Text>
                        <Text style={styles.totalPrice}>{CommonUtils.formatCash(totalPrice.toString())}</Text>
                    </View>
                    <AppButton label='Tạo đơn' style={styles.button} onPress={() => console.log("Order Submit")} />
                </View>
            </MainLayout>
            <AppBottomSheet bottomSheetRef={bottomSheetRef} snapPointsCustom={snapPointDetail}>
                <View style={{ paddingHorizontal: 16 }}>
                    <AppHeader label='Sản phẩm'
                        backButtonIcon={
                            <AppIcons name='close-sharp'
                                iconType={ICON_TYPE.IonIcon}
                                size={28}
                                color={colors.text_secondary}
                                onPress={() => bottomSheetRef.current && bottomSheetRef.current.close()}
                            />
                        }
                    />
                    {renderDetailProduct()}
                    <View style={[styles.flexSpace,{marginTop :36}]}>
                        <AppButton 
                            style={{width :"49%",backgroundColor :colors.bg_neutral}} 
                            styleLabel={{color :colors.text_secondary}} 
                            label='Huỷ' 
                            onPress={()=> bottomSheetRef.current && bottomSheetRef.current.close()}
                        />
                        <AppButton style={{width :"49%"}} label='Cập nhật' onPress={()=> console.log(1)}/>
                    </View>
                </View>

            </AppBottomSheet>
            <AppBottomSheet bottomSheetRef={bottomSheetWh} snapPointsCustom={snapPointDetail}>
                <FilterListComponent title='Kho xuất' data={DataWarehouse} 
                    onClose={() =>console.log(1)}
                    handleItem={onChangeWarehouse}
                />
            </AppBottomSheet>

        </>

    )
}

export default CreateOrder;

const createSheetStyle = (theme: AppTheme) => StyleSheet.create({
    layout: {
        backgroundColor: theme.colors.bg_neutral,
        paddingHorizontal: 0
    } as ViewStyle,
    flexSpace: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    } as ViewStyle,
    appContainer: {
        flex: 1,
        marginTop: 22,
    } as ViewStyle,
    titleSection: {
        fontSize: 14,
        lineHeight: 21,
        fontWeight: "500",
        color: theme.colors.text_secondary
    } as TextStyle,
    containerSection: {
        paddingHorizontal: 16,
        paddingVertical: 16,
        backgroundColor: theme.colors.bg_default,
        borderRadius: 16,
        marginTop: 8
    } as ViewStyle,
    textBtt: {
        fontSize: 14,
        lineHeight: 21,
        fontWeight: "500"
    } as TextStyle,
    containerNodata: {
        height: 316,
    } as ViewStyle,
    textDescNoDt: {
        fontSize: 16,
        lineHeight: 24,
        fontWeight: "400",
        color: theme.colors.text_disable
    } as TextStyle,
    iconImage: {
        width: 67,
        height: 75,
    } as ImageStyle,
    footerView: {
        backgroundColor: theme.colors.bg_default,
        paddingHorizontal: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderColor: theme.colors.border
    } as ViewStyle,
    button: {
        width: "100%",
        marginVertical: 12,
    } as ViewStyle,
    tTotalPrice: {
        fontSize: 14,
        lineHeight: 21,
        fontWeight: "500",
        color: theme.colors.text_secondary
    } as TextStyle,
    totalPrice: {
        fontSize: 20,
        lineHeight: 30,
        fontWeight: "500",
        color: theme.colors.text_primary
    } as TextStyle,
    toggleBt: (active: boolean) => ({
        alignContent: "center",
        borderRadius: 24,
        paddingVertical: 10,
        backgroundColor: active ? "rgba(196, 22, 28, 0.08)" : theme.colors.bg_default,
        width: "50%",
    } as ViewStyle),
    txTgBt: (active: boolean) => ({
        fontSize: 16,
        fontWeight: "500",
        lineHeight: 24,
        textAlign: "center",
        color: active ? theme.colors.primary : theme.colors.text_disable
    } as TextStyle),
    labelPay: {
        fontSize: 14,
        lineHeight: 21,
        fontWeight: "500",
        color: theme.colors.text_secondary
    } as TextStyle,
    price: {
        fontSize: 16,
        lineHeight: 24,
        fontWeight: "400",
        color: theme.colors.text_primary
    } as TextStyle,
    shadow: {
        shadowColor: '#919EAB',

        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 12,
    } as ViewStyle,
})