import { StyleSheet, Text, TextStyle, View } from 'react-native'
import React, { useCallback, useState } from 'react'
import { MainLayout } from '../../../layouts'
import { AppAvatar, AppContainer, AppHeader, AppIcons, AppText, Block, SvgIcon } from '../../../components/common'
import { useNavigation, useRoute } from '@react-navigation/native'
import { NavigationProp, RouterProp } from '../../../navigation/screen-type';
import { AppTheme, useTheme } from '../../../layouts/theme'
import { ViewStyle } from 'react-native'
import { AppService } from '../../../services'
import { useDeepCompareEffect } from '../../../config/function'
import RenderHTML from 'react-native-render-html'
import { WIDTH } from '../../../const/app.const'
import AvatarStack from '../../../components/Notification/AvatarStack'
import isEqual from 'react-fast-compare'
const NotificationDetail = () => {
    const navigation = useNavigation<NavigationProp>();
    const theme = useTheme()
    const styles = createSheetStyle(theme);
    const route = useRoute<RouterProp<'NOTIFY_DETAIL'>>();
    const { colors } = useTheme();
    const name = route.params
    const [notifications, setNotifications] = useState<any[]>([]);
    const [htmlMessage, setHtmlMessage] = useState<any>({})
    const [employeeWatched, setEmployeeWatched] = useState<any[]>([]);


    useDeepCompareEffect(() => {
        getNotiDetail();
    }, [name])
    const getNotiDetail = useCallback(async () => {
        const response: any = await AppService.getNotificationDetail(name);
        if (response?.message === 'Thành công') {
            const data = response.result.data;
            setNotifications([data]);
            setEmployeeWatched(data.employee_watched);
            const message = data.message.replace(/<img\s+src=\\"\/files\/([^"]+)\">/g, '<img src="/files/$1">');
            setHtmlMessage(message);
        }
    }, [name]);
    return (
        <MainLayout style={{ backgroundColor: colors.bg_neutral }}>
            <AppHeader
                onBack={() => navigation.goBack()}
            />
            {notifications &&
                notifications.map((item, i) => (
                    <AppContainer>
                        <AppText style={[styles.header_title, { color: colors.text_primary }]}>{item.notice_title}</AppText>
                        <Block style={styles.containSecondView}>
                            <AppAvatar size={24} url={item.user_image} />
                            <AppText fontSize={14} colorTheme="text_secondary" fontWeight="400">
                                {' '}{item.full_name} |{' '}
                            </AppText>
                            <AppIcons
                                size={12}
                                name="clockcircleo"
                                iconType="AntIcon"
                                color={colors.text_secondary}
                            />
                            <AppText fontSize={14} colorTheme="text_secondary" fontWeight="400">
                                {' '}{item.from_date}{' '}
                            </AppText>
                        </Block>
                        <Block style={styles.containerItem}>
                            {htmlMessage && (
                                <RenderHTML enableExperimentalMarginCollapsing contentWidth={WIDTH - 70} source={{ html: htmlMessage }} />
                            )}
                        </Block>
                        {employeeWatched && (
                            <Block style={styles.footerContainer}>
                                <AvatarStack
                                    view={employeeWatched.length.toString()}
                                    avatars={employeeWatched.filter(emp => emp.image !== undefined).map(emp => emp.image)} />
                            </Block>
                        )}
                    </AppContainer>
                ))}
        </MainLayout>
    )
}


export default React.memo(NotificationDetail,isEqual);


const createSheetStyle = (theme: AppTheme) =>
    StyleSheet.create({
        headeLb: {
            textAlign: 'left',
            marginLeft: 5,
        } as TextStyle,
        containerItem: {
            borderRadius: 16,
            overflow: 'hidden',
            backgroundColor: theme.colors.bg_default,
            marginTop: 8,
            paddingHorizontal: 16,
        } as ViewStyle,
        header_title: {
            fontSize: 20,
            fontWeight: '500',
            lineHeight: 30,
            paddingVertical: 8,
        } as TextStyle,
        containSecondView: {
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            paddingVertical: 8,
        } as ViewStyle,
        footerContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
        } as ViewStyle,
    });
