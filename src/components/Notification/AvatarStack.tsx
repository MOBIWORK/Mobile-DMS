import React from 'react';
import { StyleSheet, View, ViewStyle, TextStyle } from 'react-native';
import { AppAvatar, AppText } from '../common';
import isEqual from 'react-fast-compare';
import { AppTheme, useTheme } from '../../layouts/theme';

const AvatarStack = ({ view, avatars }: PropTypes) => {
    const theme = useTheme()
    const styles = createSheetStyle(theme);
    const maxAvatarsToShow = 3;
    const extraAvatars = avatars.length - maxAvatarsToShow;

    return (
        <View style={styles.container}>
            <AppText style={styles.text}>Đã xem{'('}{view}{')'}</AppText>
            <View style={styles.avatarStack}>
                {extraAvatars > 0 && (
                    <View style={[styles.avatarContainer, styles.extraAvatar]}>
                        <AppAvatar size={24} name={`+${extraAvatars}`} />
                    </View>
                )}
                {avatars.slice(0, maxAvatarsToShow).map((avatar, index) => (
                    <View key={index} style={styles.avatarContainer}>
                        {avatar ? (
                            <AppAvatar size={24} url={avatar} />
                        ) : (
                            <AppAvatar size={24} url='https://www.elleman.vn/app/uploads/2019/05/20/4-buc-anh-dep-hinh-gau-truc.jpg' />
                        )}
                    </View>
                ))}
            </View>
        </View>
    );
};

interface PropTypes {
    view: string;
    avatars: string[];
}

export default React.memo(AvatarStack, isEqual);

const createSheetStyle = (theme: AppTheme) =>
    StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 8
        } as ViewStyle,
        text: {
            color: theme.colors.text_secondary,
            fontSize: 14,
            Lineheight: 21,
            marginRight: 12,
            fontWeight: '600'
        } as TextStyle,
        avatarStack: {
            flexDirection: 'row-reverse',
        } as ViewStyle,
        avatarContainer: {
            marginLeft: -8,
            borderColor: theme.colors.white,
            borderWidth: 1,
            borderRadius: 12,
            overflow: 'hidden',
        } as ViewStyle,
        extraAvatar: {
            justifyContent: 'center',
            alignItems: 'center',
        } as ViewStyle,
    });
