import React, { useEffect, useMemo, useRef, useState } from 'react'
import { MainLayout } from '../../../layouts'
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { View, useWindowDimensions } from 'react-native';
import TabOverview from './TabOverview';
import TabComment from './TabComment';
import { AppBottomSheet, AppHeader, AppIcons } from '../../../components/common';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NavigationProp, RouterProp } from '../../../navigation';
import { StyleSheet } from 'react-native';
import { Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ICON_TYPE } from '../../../const/app.const';
import BottomSheet from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/BottomSheet';
import { OrderService } from '../../../services';
import { ApiConstant } from '../../../const';
import { IOrderDetail, KeyAbleProps } from '../../../models/types';
import { useTranslation } from 'react-i18next';
import { CommonUtils } from '../../../utils';
import { useTheme } from '../../../layouts/theme';



const OrderDetail = () => {

    const layout = useWindowDimensions();
    const navigation = useNavigation<NavigationProp>();
    const { colors } = useTheme();
    const {t  :getLabel}= useTranslation()
    const [index, setIndex] = React.useState(0);
    const bottomSheet = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ["15%"], []);
    const [routes] = useState([
        { key: 'overview', title: 'overview' },
        { key: 'comments', title: 'exchange' },
    ]);
    const route = useRoute<RouterProp<"ORDER_DETAIL_SCREEN">>();
    const name = route.params.name;
    
    const [data ,setData] = useState<IOrderDetail>();

    const renderTabBar = (props: any) => {
        return (
            <TabBar
                {...props}
                renderLabel={({ focused, route }) => {
                    return (
                        <Text key={route.key} style={[styles.textTabBar as any, { color: focused ? colors.primary : colors.text_disable }]}>
                            {getLabel(route.title || "")}
                        </Text>
                    );
                }}
                indicatorStyle={styles.indicatorStyle}
                style={styles.tabBar}
            />
        );
    };

    const styles = StyleSheet.create({
        container: { width: '100%', height: '100%', backgroundColor: colors.bg_default },
        tabBar: {
            backgroundColor: '#ffffff',
            borderBottomWidth: 1,
            borderColor: colors.bg_default,
        },
        textTabBar: {
            fontSize: 16,
            lineHeight: 24,
            fontWeight: "500",
        },
        indicatorStyle: {
            backgroundColor: colors.primary,
            padding: 1.5,
            marginBottom: -2,
        },
        divider: {
            zIndex: 100,
            position: 'absolute',
            width: 1,
            height: 48,
            backgroundColor: 'black',
            alignSelf: 'center',
        },
    });

    const renderScreen = SceneMap({
        overview: () => <TabOverview data={data}/> ,
        comments: TabComment,
    });

    const fetchDataDetail = async ()=>{
        const {status ,data} :KeyAbleProps= await OrderService.getDetail(name);
        if (status === ApiConstant.STT_OK) {
            setData(data.result);
        }
    }

    useEffect(()=>{
        fetchDataDetail()
    },[name])
    return (
        <MainLayout style={{paddingHorizontal :0}}>
            <AppHeader label={getLabel("orderDetail")}
                onBack={() => navigation.goBack()}
                style={{ paddingHorizontal: 16, marginBottom: 20 }}
                rightButton={
                    <TouchableOpacity
                        onPress={()=>bottomSheet.current && bottomSheet.current.snapToIndex(0)}
                    >
                        <AppIcons iconType={ICON_TYPE.MateriallIcon} name='more-vert' size={24} color={colors.text_secondary} />
                    </TouchableOpacity>
                }
            />
            <TabView
                navigationState={{ index, routes }}
                renderTabBar={renderTabBar}
                renderScene={renderScreen}
                onIndexChange={setIndex}
                initialLayout={{ width: layout.width }}
                
            />

            <AppBottomSheet snapPointsCustom={snapPoints} bottomSheetRef={bottomSheet}>
                <View style={{ paddingHorizontal: 16, marginTop: -5 }}>
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: "center" }}>
                        <AppIcons name='bell-outline' iconType='MaterialCommunity' size={18} color={colors.text_secondary} />
                        <Text style={{ fontSize: 14, lineHeight: 24, fontWeight: "400", color: colors.text_primary, marginLeft: 8, paddingVertical: 4 }}>{getLabel("remind")}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {
                        bottomSheet.current && bottomSheet.current.close()
                    }} style={{ flexDirection: 'row', alignItems: "center" }}>
                        <AppIcons name='edit' iconType='AntIcon' size={18} color={colors.text_secondary} />
                        <Text style={{ fontSize: 14, lineHeight: 24, fontWeight: "400", color: colors.text_primary, marginLeft: 8, paddingVertical: 4 }}>{getLabel("edit")}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {
                        bottomSheet.current && bottomSheet.current.close()
                    }} style={{ flexDirection: 'row', alignItems: "center" }}>
                        <AppIcons name='delete-outline' iconType='MaterialCommunity' size={18} color={colors.primary} />
                        <Text style={{ fontSize: 14, lineHeight: 24, fontWeight: "400", color: colors.primary, marginLeft: 8, paddingVertical: 4 }}>{getLabel("delete")}</Text>
                    </TouchableOpacity>

                </View>
            </AppBottomSheet>
        </MainLayout>

    )
}

export default OrderDetail