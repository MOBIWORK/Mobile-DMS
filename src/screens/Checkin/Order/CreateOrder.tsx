import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { MainLayout } from '../../../layouts';
import {
    AppBottomSheet,
    AppButton,
    AppContainer,
    AppHeader,
    AppIcons,
    AppInput,
} from '../../../components/common';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NavigationProp, RouterProp } from '../../../navigation/screen-type';
import {
    ImageStyle,
    Pressable,
    StyleSheet,
    Text,
    TextStyle,
    View,
    ViewStyle,
    TouchableOpacity
} from 'react-native';
import { AppTheme, useTheme } from '../../../layouts/theme';
import { Button, TextInput } from 'react-native-paper';
import { ICON_TYPE } from '../../../const/app.const';
import { Image } from 'react-native';
import { ImageAssets } from '../../../assets';
import { CommonUtils } from '../../../utils';
import ItemProduct from './components/ItemProduct';
import BottomSheet from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/BottomSheet';
import FilterListComponent, {
    IFilterType,
} from '../../../components/common/FilterListComponent';
import { ApiConstant, AppConstant, ScreenConstant } from '../../../const';
import { OrderService, ProductService } from '../../../services';
import { IProduct, IProductPromotion, IResOrganization, KeyAbleProps } from '../../../models/types';
import { useSelector } from '../../../config/function';
import { useTranslation } from 'react-i18next';
import { dispatch } from '../../../utils/redux';
import { productActions } from '../../../redux-store/product-reducer/reducer';
import { useMMKVObject } from 'react-native-mmkv';
import { DatePickerModal } from 'react-native-paper-dates';
import { SingleChange } from 'react-native-paper-dates/lib/typescript/Date/Calendar';

const defautItem1 = {
    "doctype": "Sales Order Item",
    "name": "new-sales-order-item-earlpsogzi",
    "child_docname": "new-sales-order-item-earlpsogzi",
    "parenttype": "Sales Order",
    "parent": "new-sales-order-hnnkmtrehm",
    "is_free_item": 0,
    "conversion_factor": 1
}

const CreateOrder = () => {

    const navigation = useNavigation<NavigationProp>();
    const { colors } = useTheme();
    const styles = createSheetStyle(useTheme());
    const bottomSheetRef = useRef<BottomSheet>(null);
    const bottomSheetWh = useRef<BottomSheet>(null);
    const snapPointDetail = useMemo(() => ['70%'], []);
    const router = useRoute<RouterProp<'CHECKIN_ORDER'>>();
    const type = router.params.type;
    const { t: getLabel, i18n } = useTranslation();

    const [openDate, setOpenDate] = useState<boolean>(false);
    const [organization, _] = useMMKVObject<IResOrganization>(AppConstant.Organization)
    const [date, setDate] = useState<number>(new Date().getTime());
    const [DataWarehouse, setDataWarehouse] = useState<IFilterType[]>([]);
    const [dataDiscount, setDataDiscount] = useState<IFilterType[]>([
        {
            label: 'Grand Total',
            value: 'grand',
            isSelected: true,
        },
        {
            label: 'Net Total',
            value: 'net',
            isSelected: false,
        },
    ]);
    const [dataVat, setDataVat] = useState<any[]>([]);
    const data = useSelector(state => state.product.dataSelected);
    const dataCheckin = useSelector(state => state.app.dataCheckIn);
    const [products, setProducts] = useState<IProduct[]>([]);
    const [productsPromotion, setProductsPromotion] = useState<IProductPromotion[]>([]);
    const [productDetail, setProductDetail] = useState<IProduct | any>();

    const [dataCategorie, setDataCategorie] = useState<IFilterType[]>([]);
    const [toggleTab, setToggleTab] = useState<number>(1);
    const [labelBottonSheet, setLabelBottonSheet] = useState<string>("");

    const [warehouse, setWarehouse] = useState<IFilterType>();
    const [vat, setVat] = useState<object | any>({ label: "", value: "", rate: "" });
    const [discount, setDiscount] = useState<any>({
        label: 'Grand Total',
        value: 'grand',
        discount_percentage: 0,
    });

    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [grandTotalPrice, setGrandTotalPrice] = useState<number>(0);
    const [discountAmount, setDiscountAmout] = useState<number>(0);
    const [vatAmount, setVatAmount] = useState<number>(0);

    const onBackScreen = () => {
        dispatch(productActions.setProductSelected([]))
        navigation.goBack()
    };

    const renderUiNoData = () => {
        return (
            <View style={[styles.containerNodata]}>
                <View style={{ marginTop: 70 }}>
                    <View style={{ alignItems: 'center', rowGap: 8 }}>
                        <Image
                            style={styles.iconImage}
                            source={ImageAssets.IconBill}
                            resizeMode="cover"
                        />
                        <Text style={[styles.textDescNoDt]}>{getLabel("selectProduct")}</Text>
                    </View>
                    <View style={[styles.flexSpace as any, { marginTop: 24 }]}>
                        <Button
                            style={{
                                width: '48%',
                                marginRight: 16,
                                borderColor: colors.action,
                            }}
                            textColor={colors.action}
                            labelStyle={[styles.textBtt as any, { fontWeight: '500' }]}
                            icon="plus"
                            mode="outlined"
                            onPress={() =>
                                navigation.navigate(ScreenConstant.CHECKIN_SELECT_PRODUCT)
                            }>
                            {getLabel("selectProduct")}
                        </Button>
                        <Button
                            style={{ width: '48%', borderColor: colors.action }}
                            textColor={colors.action}
                            labelStyle={[styles.textBtt as any, { fontWeight: '500' }]}
                            icon="barcode-scan"
                            mode="outlined"
                            onPress={() => console.log('Pressed')}>
                            {getLabel("scanCode")}
                        </Button>
                    </View>
                </View>
            </View>
        );
    };

    const showDetailProdcut = (item: IProduct) => {
        setProductDetail(item)
        if (bottomSheetRef.current) bottomSheetRef.current.snapToIndex(0);
    };

    const toggleButtonUi = useCallback((tab: number, productKm: number) => {
        if (type == 'ORDER') {
            return (
                <View style={[styles.flexSpace, { marginBottom: 20 }]}>
                    <Pressable
                        onPress={() => setToggleTab(1)}
                        style={[styles.toggleBt(tab == 1 ? true : false)]}>
                        <Text style={[styles.txTgBt(tab == 1 ? true : false)]}>
                            Sản phẩm
                        </Text>
                    </Pressable>
                    <Pressable
                        onPress={() => setToggleTab(2)}
                        style={[styles.toggleBt(tab == 2 ? true : false)]}>
                        <Text style={[styles.txTgBt(tab == 2 ? true : false)]}>
                            Sản phẩm KM ({productKm})
                        </Text>
                    </Pressable>
                </View>
            );
        } else {
            return '';
        }
    }, []);

    const renderProduct = (tab: number) => {
        if (tab == 1) {
            return (
                <>
                    {products.length > 0 ? (
                        <View style={[styles.flexSpace]}>
                            <Button
                                onPressIn={() =>
                                    navigation.navigate(ScreenConstant.CHECKIN_SELECT_PRODUCT)
                                }
                                style={{
                                    width: '48%',
                                    marginRight: 16,
                                    borderColor: colors.action,
                                }}
                                textColor={colors.action}
                                labelStyle={[styles.textBtt as any, { fontWeight: '500' }]}
                                icon="plus"
                                mode="outlined"
                                onPress={() => console.log('Pressed')}>
                                {getLabel("selectProduct")}
                            </Button>
                            <Button
                                style={{ width: '48%', borderColor: colors.action }}
                                textColor={colors.action}
                                labelStyle={[styles.textBtt as any, { fontWeight: '500' }]}
                                icon="barcode-scan"
                                mode="outlined"
                                onPress={() => console.log('Pressed')}>
                                {getLabel("scanCode")}
                            </Button>
                        </View>
                    ) : (
                        renderUiNoData()
                    )}
                    <View style={{ marginTop: 20, rowGap: 8 }}>
                        {products.map((item, i) => (
                            <Pressable key={i} onPress={() => showDetailProdcut(item)}>
                                <ItemProduct
                                    onRemove={(id) => handlerRemoveItemProduct(id)}
                                    name={item.item_name}
                                    code={item.item_code}
                                    dvt={item.stock_uom}
                                    quantity={item.quantity ? item.quantity : 0}
                                    percentage_discount={item.discount}
                                    price={item.price || 0}
                                />
                            </Pressable>
                        ))}
                    </View>
                </>
            );
        } else {
            return (
                <>
                    <View>
                        {productsPromotion.map((item, i) => (
                            <Pressable key={i}>
                                <ItemProduct
                                    name={item.item_name}
                                    code={item.item_code}
                                    dvt={item.stock_uom}
                                    quantity={item.qty}
                                />
                            </Pressable>
                        ))}
                    </View>
                </>
            );
        }
    };

    const renderDetailProduct = () => {
        let priceTotalOrder = 0;
        if (productDetail) {
            priceTotalOrder = productDetail.quantity ? (productDetail.price * productDetail.quantity) : 0
        }
        return (
            <View style={{ marginTop: 24, rowGap: 20 }}>
                <AppInput
                    label={getLabel("productCode")}
                    value={productDetail?.item_code || ""}
                    hiddenRightIcon
                    disable
                    styles={{ backgroundColor: colors.bg_neutral }}
                />
                <AppInput
                    label={getLabel("unit")}
                    onPress={() => onOpenBottonSheetData("unit")}
                    value={productDetail?.stock_uom || ""}
                    hiddenRightIcon
                    editable={false}
                    rightIcon={
                        <TextInput.Icon
                            onPress={() => onOpenBottonSheetData("unit")}
                            icon={'chevron-down'}
                            color={colors.text_secondary}
                        />
                    }
                />

                <AppInput
                    label={getLabel("unitPrice")}
                    value={productDetail?.price ? CommonUtils.formatCash(productDetail.price.toString()) : ""}
                    hiddenRightIcon
                    editable={false}
                    styles={{ backgroundColor: colors.bg_neutral }}
                    rightIcon={
                        <TextInput.Affix
                            text="VND"
                            textStyle={{ color: colors.text_secondary, fontSize: 12 }}
                        />
                    }
                />
                <AppInput
                    label={getLabel("quantity")}
                    value={productDetail?.quantity?.toString() || ""}
                    onChangeValue={(txt: string) => setProductDetail({ ...productDetail, quantity: txt == "" ? 0 : parseInt(txt) })}
                    hiddenRightIcon
                    inputProp={{
                        keyboardType: 'numeric',
                    }}
                />

                <AppInput
                    label={getLabel("intoMoney")}
                    value={priceTotalOrder ? CommonUtils.formatCash(priceTotalOrder.toString()) : ""}
                    hiddenRightIcon
                    editable={false}
                    styles={{ backgroundColor: colors.bg_neutral }}
                    rightIcon={
                        <TextInput.Affix
                            text="VND"
                            textStyle={{ color: colors.text_secondary, fontSize: 12 }}
                        />
                    }
                />
            </View>
        );
    };

    const onOpenBottonSheetData = (typeData: string) => {
        switch (typeData) {
            case "discount":
                setLabelBottonSheet("typeDiscount")
                setDataCategorie(dataDiscount);
                break;
            case "warehouse":
                setLabelBottonSheet("warehouse")
                setDataCategorie(DataWarehouse);
                break;
            case "vat":
                setLabelBottonSheet("typeVat")
                setDataCategorie(dataVat);
                break;
            case "unit": {
                setLabelBottonSheet("unit")
                if (productDetail) {
                    const units = productDetail.details;
                    const newUnits: IFilterType[] = units.map((item1: any) => {
                        return productDetail.stock_uom === item1.uom ? { label: item1.uom, value: productDetail.item_code, isSelected: false } : { label: item1.uom, value: productDetail.item_code, isSelected: false }
                    });
                    setDataCategorie(newUnits);
                } else {
                    setDataCategorie([]);
                }
            }
                break;
            default:
                setDataCategorie([]);
                break;
        }
        if (bottomSheetWh.current) {
            bottomSheetWh.current.snapToIndex(0);
        }
    };

    const onChangeData = (item: IFilterType | any) => {
        switch (labelBottonSheet) {
            case "typeDiscount": {
                setDiscount((prev: any) => ({ ...prev, label: item.label, value: item.value }));
                const newData = dataDiscount.map(item1 =>
                    item1.value == item.value
                        ? { ...item, isSelected: true }
                        : { ...item1, isSelected: false },
                );
                setDataDiscount(newData)
            }
                break;
            case "warehouse": {
                setWarehouse(item);
                const newWhs = DataWarehouse.map(item1 =>
                    item1.value == item.value
                        ? { ...item, isSelected: true }
                        : { ...item1, isSelected: false },
                );
                setDataWarehouse(newWhs);
            }
                break;
            case "typeVat": {
                setVat(item)
                const newWhs = dataVat.map(item1 =>
                    item1.value == item.value
                        ? { ...item, isSelected: true }
                        : { ...item1, isSelected: false },
                );
                setDataVat(newWhs);
            }
                break;
            case "unit": {
                if (productDetail) {
                    const priceUom = productDetail.details.find((item1: any) => item1.uom === item.label);
                    const newData = { ...productDetail, stock_uom: item.label, price: priceUom ? priceUom.price : 0 }
                    setProductDetail(newData);
                }
            }
                break;
            default:
                break;
        }
        if (bottomSheetWh.current) {
            setDataCategorie([]);
            bottomSheetWh.current.close();
        }
    };

    const onCalculateTotalOrderPrice = () => {
        const sum = products.reduce((accumulator, item) => {
            let total = 0;
            let discountPrice = 0;
            let grandTotal = 0
            if (item.quantity) {
                total = item.price * item.quantity
                discountPrice = (total * item.discount / 100)
                grandTotal = total - discountPrice;

            }
            return accumulator + grandTotal;
        }, 0);
        setTotalPrice(sum)
    };

    const onChangeDiscount = (input: string, txt: string) => {
        let amount = 0;
        let percentage = 0;
        switch (input) {
            case "discount":
                percentage = Number(txt);
                if (discount.value == "grand") {
                    amount = (Number(txt) / 100) * (vatAmount + totalPrice);
                } else {
                    amount = (Number(txt) / 100) * totalPrice
                }
                break;
            case "discountAmount":
                amount = Number(txt)
                if (discount.value == "grand") {
                    percentage = (Number(txt) / (totalPrice + vatAmount)) * 100
                } else {
                    percentage = (Number(txt) / totalPrice) * 100
                }
                break
            default:
                break;
        }
        setDiscount(((prev: any) => ({ ...prev, discount_percentage: percentage })))
        setDiscountAmout(amount)
    };

    const fetchDataWarehouse = async () => {
        const { data, status }: KeyAbleProps = await ProductService.getWarehouse();
        if (status === ApiConstant.STT_OK) {
            const result = data.result;
            const newData: IFilterType[] = [];
            for (let i = 0; i < result.length; i++) {
                const element = result[i];
                newData.push({
                    value: element.name,
                    label: element.name,
                    isSelected: false,
                });
            }
            setDataWarehouse(newData);
        }
    };

    const fetchDataVat = async () => {
        const { status, data }: KeyAbleProps = await OrderService.getListVat();
        if (status === ApiConstant.STT_OK) {
            const result = data.result;
            const newData: any[] = [];
            for (let i = 0; i < result.length; i++) {
                const element = result[i];
                newData.push({
                    value: element.name,
                    label: element.title,
                    rate: element.rate,
                    price: 0,
                    isSelected: false,
                });
            }
            setDataVat(newData);
        }
    };

    const fetchProductPromotion = async () => {
        if (type === "ORDER") {
            if (data.length > 0) {
                const newItems = data.map((item: any) => ({ ...defautItem1, item_code: item.item_code, uom: item.stock_uom, qty: item.quantity, stock_qty: item.quantity }))
                const objecData = {
                    "items": newItems,
                    "customer": dataCheckin.item.customer_code,        // Khách hàng
                    "territory": "Vietnam",
                    "currency": "VND",
                    "price_list": "Standard Selling",
                    "price_list_currency": "VND",
                    "company": organization?.company_name || "",            // Lấy cty hiện tại
                    "doctype": "Sales Order",
                    "name": "new-sales-order-hnnkmtrehm",
                    "transaction_date": CommonUtils.taskDate(date),
                }
                const { data: res, status }: KeyAbleProps = await ProductService.getPromotionalProducts(objecData);
                if (status === ApiConstant.STT_OK) {
                    const result = res.result
                    for (let i = 0; i < result.length; i++) {
                        const element = result[i];
                        if (element.free_item_data && element.free_item_data.length > 0) {
                            setProductsPromotion(element.free_item_data)
                        }
                        if (element.discount_percentage) {
                            const newProducts = data.map(item => item.item_code === element.item_code ? { ...item, discount: element.discount_percentage } : item);
                            setProducts(newProducts)
                        }
                    }
                }
            }
        }

    };

    const onCalculateGrandPriceOrder = () => {
        const grand_price = totalPrice + vatAmount - discountAmount;
        setGrandTotalPrice(grand_price)
    };

    const handlerRemoveItemProduct = (id: string) => {
        const newProducts = products.filter(item => item.item_code !== id);
        setProducts(newProducts);
        dispatch(productActions.setProductSelected(newProducts))
    };

    const updateProductOrder = () => {
        if (productDetail) {
            const newProducts = products.map(item => item.item_code === productDetail.item_code ? ({ ...item, quantity: productDetail.quantity, price: productDetail.price }) : item);
            dispatch(productActions.setProductSelected(newProducts));
        }
        if (bottomSheetRef.current) {
            bottomSheetRef.current.close();
        }
    };

    const recalculateVatorDiscount = () => {
        let vt = 0;
        let dsc = 0;
        switch (discount.value) {
            case "net":
                dsc = (discount.discount_percentage / 100) * totalPrice
                vt = (vat.rate / 100) * (totalPrice - dsc);
                break;
            case "grand":
                vt = (vat.rate / 100) * totalPrice;
                dsc = (discount.discount_percentage / 100) * (totalPrice + vt)
                break;
            default:
                break;
        }
        setVatAmount(vt);
        setDiscountAmout(dsc);
    };

    const isDisabled = useMemo(() => {
        if (!warehouse || warehouse?.value === "") {
            return true
        } else {
            return false
        }
    }, [warehouse])

    const onConfirmSingle = React.useCallback<SingleChange>(
        params => {
            setOpenDate(false);
            const newDate = new Date(params.date ?? '');
            setDate(newDate.getTime())
        },
        [setOpenDate, setDate],
    );

    const onDismissSingle = React.useCallback(() => {
        setOpenDate(false);
    }, [setOpenDate]);



    const onCreatedOrder = async () => {
        let status: any = 0
        const arrItems = products.map(item => ({ item_code: item.item_code, qty: item.quantity, rate: item.price, uom: item.stock_uom, discount_percentage: item.discount }))
        const objectData: any = {
            set_warehouse: warehouse?.value,
            apply_discount_on: discount.label,
            additional_discount_percentage: discount.discount_percentage,
            discount_amount: discountAmount,
            rate_taxes: vat.rate,
            taxes_and_charges: vat.value,
            company: organization?.company_name,
            items: arrItems,
        }
        if (dataCheckin) {
            objectData["checkin_id"] = dataCheckin.checkin_id;
            objectData["customer"] = dataCheckin.item.name;
        }

        switch (type) {
            case "ORDER":
                objectData['delivery_date'] = new Date(date).getTime() / 1000;
                objectData["grand_total"] = grandTotalPrice;
                status = (await OrderService.createdOrder(objectData)).status;
                break;
            case "RETURN_ORDER":
                objectData["grand_total"] = grandTotalPrice - (grandTotalPrice * 2);
                status = (await OrderService.createdReturnOrder(objectData)).status;
                break
            default:
                break;
        }
        if (status === ApiConstant.STT_CREATED) onBackScreen();
    };

    useEffect(() => {
        fetchDataWarehouse();
        fetchDataVat();
    }, []);

    useEffect(() => {
        setProducts(data);
        fetchProductPromotion();
    }, [data]);

    useLayoutEffect(() => {
        onCalculateTotalOrderPrice();
    }, [products]);

    useEffect(() => {
        onCalculateGrandPriceOrder();
    }, [totalPrice, vatAmount, discountAmount]);

    useEffect(() => {
        recalculateVatorDiscount();
    }, [products, discount, vat]);


    return (
        <>
            <MainLayout style={styles.layout}>
                <AppHeader
                    style={{ paddingHorizontal: 16 }}
                    label={type == 'ORDER' ? getLabel("createOrder") : getLabel("createOrderReturn")}
                    onBack={onBackScreen}
                />
                <AppContainer style={styles.appContainer}>
                    <View style={{ rowGap: 20, paddingHorizontal: 16 }}>

                        <View style={{ rowGap: 20 }}>
                            {type == 'ORDER' && (
                                <AppInput
                                    label={getLabel("deliveryDate")}
                                    value={CommonUtils.convertDate(date)}
                                    editable={false}
                                    onPress={()=>setOpenDate(true)}
                                    rightIcon={
                                        <TextInput.Icon
                                            onPress={()=>setOpenDate(true)}
                                            icon={'calendar-month-outline'}
                                            size={20}
                                            color={colors.text_secondary}
                                        />
                                    }
                                />
                            )}

                            <AppInput
                                label={getLabel("eXwarehouse")}
                                value={warehouse?.label ? warehouse.label : ''}
                                editable={false}
                                onPress={() => onOpenBottonSheetData("warehouse")}
                                rightIcon={
                                    <TextInput.Icon
                                        onPress={() => onOpenBottonSheetData("warehouse")}
                                        icon={'chevron-down'}
                                        color={colors.text_secondary}
                                    />
                                }
                            />
                        </View>

                        <View>
                            <View style={styles.flexSpace}>
                                <Text style={styles.titleSection}>{getLabel("product")}</Text>
                                <TouchableOpacity>
                                    <AppIcons
                                        name="chevron-down"
                                        size={22}
                                        iconType={ICON_TYPE.Feather}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={[styles.containerSection]}>
                                {productsPromotion.length > 0 &&
                                    toggleButtonUi(toggleTab, productsPromotion.length)}
                                {renderProduct(toggleTab)}
                            </View>
                        </View>

                        <View>
                            <View style={styles.flexSpace}>
                                <Text style={styles.titleSection}>VAT</Text>
                                <TouchableOpacity>
                                    <AppIcons
                                        name="chevron-down"
                                        size={22}
                                        iconType={ICON_TYPE.Feather}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View
                                style={[
                                    styles.containerSection,
                                    { paddingVertical: 20, rowGap: 20 },
                                ]}>
                                <AppInput
                                    value={vat.label}
                                    label={getLabel("formVat")}
                                    editable={false}
                                    onPress={() => onOpenBottonSheetData('vat')}
                                    rightIcon={
                                        <TextInput.Icon
                                            onPress={() => onOpenBottonSheetData('vat')}
                                            icon={'chevron-down'}
                                            color={colors.text_secondary}
                                        />
                                    }
                                />
                                <AppInput
                                    value={vat.rate.toString()}
                                    label="VAT(%)"
                                    editable={false}
                                    styles={{ backgroundColor: colors.bg_neutral }}
                                    rightIcon={<TextInput.Affix text="%" />}
                                />
                                <AppInput
                                    value={CommonUtils.formatCash(vatAmount.toString())}
                                    label={getLabel("priceVate")}
                                    editable={false}
                                    styles={{ backgroundColor: colors.bg_neutral }}
                                    rightIcon={
                                        <TextInput.Affix text="VND" textStyle={{ fontSize: 12 }} />
                                    }
                                />
                            </View>
                        </View>

                        <View>
                            <View style={styles.flexSpace}>
                                <Text style={styles.titleSection}>Chiết khấu đơn</Text>
                                <TouchableOpacity>
                                    <AppIcons
                                        name="chevron-down"
                                        size={22}
                                        iconType={ICON_TYPE.Feather}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View
                                style={[
                                    styles.containerSection,
                                    { paddingVertical: 20, rowGap: 20 },
                                ]}>
                                <AppInput
                                    value={discount.label}
                                    label={getLabel("typeDiscount")}
                                    editable={false}
                                    onPress={() => onOpenBottonSheetData('discount')}
                                    rightIcon={
                                        <TextInput.Icon
                                            onPress={() => onOpenBottonSheetData('discount')}
                                            icon={'chevron-down'}
                                            color={colors.text_secondary}
                                        />
                                    }
                                />
                                <AppInput
                                    value={discount.discount_percentage.toString()}
                                    label={getLabel("discountPercentage")}
                                    onChangeValue={(txt) => onChangeDiscount("discount", txt)}
                                    inputProp={{
                                        keyboardType: 'numeric'
                                    }}
                                    rightIcon={<TextInput.Affix text="%" />}
                                />
                                <AppInput
                                    value={discountAmount.toString()}
                                    label={getLabel("discountAmount")}
                                    onChangeValue={(txt) => onChangeDiscount("discountAmount", txt)}
                                    inputProp={{
                                        keyboardType: 'numeric'
                                    }}
                                    rightIcon={
                                        <TextInput.Affix text="VND" textStyle={{ fontSize: 12 }} />
                                    }
                                />
                            </View>
                        </View>

                        <View style={{ marginBottom: 50 }}>
                            <View style={styles.flexSpace}>
                                <Text style={styles.titleSection}>{getLabel("detailPay")}</Text>
                                <TouchableOpacity>
                                    <AppIcons
                                        name="chevron-down"
                                        size={22}
                                        iconType={ICON_TYPE.Feather}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View
                                style={[
                                    styles.containerSection,
                                    styles.shadow,
                                    { paddingVertical: 16, rowGap: 12 },
                                ]}>
                                <View style={styles.flexSpace}>
                                    <Text style={styles.labelPay}>{getLabel("intoMoney")}</Text>
                                    <Text style={styles.price}>{CommonUtils.formatCash(totalPrice.toString())}</Text>
                                </View>
                                <View style={styles.flexSpace}>
                                    <Text style={styles.labelPay}>{getLabel("discount")}</Text>
                                    <Text style={styles.price}>{CommonUtils.formatCash(discountAmount.toString())}</Text>
                                </View>
                                <View style={styles.flexSpace}>
                                    <Text style={styles.labelPay}>VAT</Text>
                                    <Text style={styles.price}>{CommonUtils.formatCash(vatAmount.toString())}</Text>
                                </View>
                                <View style={[styles.flexSpace, { alignItems: 'flex-end' }]}>
                                    <Text style={styles.labelPay}>{getLabel("totalPrice")}</Text>
                                    <Text style={styles.totalPrice}>{CommonUtils.formatCash(grandTotalPrice.toString())}</Text>
                                </View>
                            </View>
                        </View>

                    </View>
                </AppContainer>

                <View style={styles.footerView}>
                    <View
                        style={[
                            styles.flexSpace,
                            { paddingVertical: 12, alignItems: 'flex-end' },
                        ]}>
                        <Text style={styles.tTotalPrice}>{getLabel("totalPrice")}</Text>
                        <Text style={styles.totalPrice}>
                            {CommonUtils.formatCash(grandTotalPrice.toString())}
                        </Text>
                    </View>
                    <AppButton
                        label={getLabel("orderCreated")}
                        style={styles.button}
                        disabled={isDisabled}
                        onPress={() => onCreatedOrder()}
                    />
                </View>

            </MainLayout>

            <AppBottomSheet
                bottomSheetRef={bottomSheetRef}
                snapPointsCustom={snapPointDetail}>
                <View style={{ paddingHorizontal: 16 }}>
                    <AppHeader
                        label={getLabel("product")}
                        backButtonIcon={
                            <AppIcons
                                name="close-sharp"
                                iconType={ICON_TYPE.IonIcon}
                                size={28}
                                color={colors.text_secondary}
                                onPress={() =>
                                    bottomSheetRef.current && bottomSheetRef.current.close()
                                }
                            />
                        }
                    />
                    {renderDetailProduct()}
                    <View style={[styles.flexSpace, { marginTop: 36 }]}>
                        <AppButton
                            style={{ width: '49%', backgroundColor: colors.bg_neutral }}
                            styleLabel={{ color: colors.text_secondary }}
                            label={getLabel("cancel")}
                            onPress={() =>
                                bottomSheetRef.current && bottomSheetRef.current.close()
                            }
                        />
                        <AppButton
                            style={{ width: '49%' }}
                            label={getLabel("update")}
                            onPress={() => updateProductOrder()}
                        />
                    </View>
                </View>
            </AppBottomSheet>

            <AppBottomSheet
                bottomSheetRef={bottomSheetWh}
                snapPointsCustom={snapPointDetail}>
                <FilterListComponent
                    title={getLabel(labelBottonSheet)}
                    data={dataCategorie}
                    searchPlaceholder={getLabel("search")}
                    onClose={() => {
                        bottomSheetWh.current && bottomSheetWh.current.close();
                        setDataCategorie([])
                    }}
                    handleItem={onChangeData}
                />
            </AppBottomSheet>

            <DatePickerModal
                locale={i18n.language ?? 'vi'}
                mode="single"
                startYear={1900}
                visible={openDate}
                label={getLabel('selectDate')}
                onDismiss={onDismissSingle}
                date={new Date(date)}
                onConfirm={onConfirmSingle}
            />
        </>
    );

};

export default CreateOrder;

const createSheetStyle = (theme: AppTheme) =>
    StyleSheet.create({
        layout: {
            backgroundColor: theme.colors.bg_neutral,
            paddingHorizontal: 0,
        } as ViewStyle,
        flexSpace: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        } as ViewStyle,
        appContainer: {
            flex: 1,
            marginTop: 22,
        } as ViewStyle,
        titleSection: {
            fontSize: 14,
            lineHeight: 21,
            fontWeight: '500',
            color: theme.colors.text_secondary,
        } as TextStyle,
        containerSection: {
            paddingHorizontal: 16,
            paddingVertical: 16,
            backgroundColor: theme.colors.bg_default,
            borderRadius: 16,
            marginTop: 8,
        } as ViewStyle,
        textBtt: {
            fontSize: 14,
            lineHeight: 21,
            fontWeight: '500',
        } as TextStyle,
        containerNodata: {
            height: 316,
        } as ViewStyle,
        textDescNoDt: {
            fontSize: 16,
            lineHeight: 24,
            fontWeight: '400',
            color: theme.colors.text_disable,
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
            borderColor: theme.colors.border,
        } as ViewStyle,
        button: {
            width: '100%',
            marginVertical: 12,
        } as ViewStyle,
        tTotalPrice: {
            fontSize: 14,
            lineHeight: 21,
            fontWeight: '500',
            color: theme.colors.text_secondary,
        } as TextStyle,
        totalPrice: {
            fontSize: 20,
            lineHeight: 30,
            fontWeight: '500',
            color: theme.colors.text_primary,
        } as TextStyle,
        toggleBt: (active: boolean) =>
        ({
            alignContent: 'center',
            borderRadius: 24,
            paddingVertical: 10,
            backgroundColor: active
                ? 'rgba(196, 22, 28, 0.08)'
                : theme.colors.bg_default,
            width: '50%',
        } as ViewStyle),
        txTgBt: (active: boolean) =>
        ({
            fontSize: 16,
            fontWeight: '500',
            lineHeight: 24,
            textAlign: 'center',
            color: active ? theme.colors.primary : theme.colors.text_disable,
        } as TextStyle),
        labelPay: {
            fontSize: 14,
            lineHeight: 21,
            fontWeight: '500',
            color: theme.colors.text_secondary,
        } as TextStyle,
        price: {
            fontSize: 16,
            lineHeight: 24,
            fontWeight: '400',
            color: theme.colors.text_primary,
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
    });