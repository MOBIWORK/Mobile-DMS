import React from 'react';
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import { NavigationProp } from '../../navigation';
import { useTranslation } from 'react-i18next';
import { SvgIcon } from '../common';
import { SvgIconTypes } from '../../assets/svgIcon';

const ItemuWidget = ({
    source,
    name,
    navigate,
    isTouchable = true,
}: PropTypes) => {
    const { colors } = useTheme();
    const navigation = useNavigation<NavigationProp>();
    const { t: getLabel } = useTranslation();

    if (isTouchable) {
        return (
            <TouchableOpacity onPress={() => navigation.navigate(navigate)}>
                <View style={{ alignItems: 'center', paddingVertical: 8 }}>
                    <View
                        style={[
                            styles.iconContail as ViewStyle,
                            {
                                marginBottom: 8,
                                padding: 8,
                                borderRadius: 8,
                                borderColor: colors.border,
                                borderWidth: 1,
                            },
                        ]}>
                        <SvgIcon source={source}  size={32} colorTheme="action"/>
                    </View>
                    <Text
                        style={{
                            color: colors.text_secondary,
                            fontSize: 12,
                            fontWeight: '400',
                            textAlign: 'center',
                            paddingHorizontal: 8,
                        }}>
                        {getLabel(name)}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    } else {
        return (
            <View>
                <View style={{ alignItems: 'center', paddingVertical: 8 }}>
                    <View
                        style={[
                            styles.iconContail as ViewStyle,
                            {
                                marginBottom: 8,
                                padding: 8,
                                borderRadius: 8,
                                borderColor: colors.border,
                                borderWidth: 1,
                            },
                        ]}>
                        <SvgIcon source={source}  size={20} colorTheme="action"/>
                    </View>
                    <Text
                        style={{
                            color: colors.text_secondary,
                            fontSize: 12,
                            fontWeight: '400',
                            textAlign: 'center',
                            paddingHorizontal: 8,
                        }}>
                        {getLabel(name)}
                    </Text>
                </View>
            </View>
        );
    }
};

interface PropTypes {
    source: SvgIconTypes;
    name: string;
    navigate: any;
    isTouchable?: boolean;
}

export default ItemuWidget;

const styles = StyleSheet.create({
    icon: {
        height: 32,
        width: 32,
    },
    iconContail: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});
