import {
  Image,
  Platform,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import React from 'react';
import {AppIcons, Block, AppText as Text} from '../../../components/common';
import {useTranslation} from 'react-i18next';
import isEqual from 'react-fast-compare';
import {AppTheme, useTheme} from '../../../layouts/theme';
import {AppConstant} from '../../../const';
import {ImageAssets} from '../../../assets';

type Props = {
  currentShit: any;
  onPressDeepLink: () => void;
};

const TimeKeep = (props: Props) => {
  const {currentShit, onPressDeepLink} = props;
  const {t: getLabel} = useTranslation();
  const theme = useTheme();
  const {colors} = useTheme();
  const styles = rootStyles(theme);

  return (
    <Block style={[styles.shadow, styles.containerTimeKeep]}>
      <Block>
        <Text style={[styles.userName]}>
          {currentShit?.shift_status || currentShit?.shift_status === 'Vào'
            ? getLabel('timeKeepOut')
            : getLabel('timeKeepIn')}
        </Text>
        <Block direction="row" alignItems="center" marginTop={8}>
          <AppIcons
            iconType={
              currentShit?.shift_type_now
                ? AppConstant.ICON_TYPE.AntIcon
                : AppConstant.ICON_TYPE.MateriallIcon
            }
            name={
              currentShit?.shift_type_now ? 'clockcircleo' : 'report-problem'
            }
            size={16}
            color={
              currentShit?.shift_type_now ? colors.text_secondary : colors.error
            }
          />
          <Text
            style={{
              marginLeft: 5,
              fontSize: 16,
              color: currentShit?.shift_type_now
                ? colors.text_secondary
                : colors.error,
            }}>
            {currentShit?.shift_type_now
              ? `${currentShit.shift_type_now.start_time} - ${currentShit.shift_type_now.end_time}`
              : getLabel('noShirtNow')}
          </Text>
        </Block>
      </Block>
      <TouchableOpacity
        style={[
          styles.btnTimekeep,
          {
            backgroundColor: !currentShit?.shift_type_now
              ? colors.bg_disable
              : currentShit?.shift_status || currentShit?.shift_status === 'Vào'
              ? colors.error
              : colors.success,
          },
        ]}
        onPress={onPressDeepLink}
        disabled={currentShit?.shift_type_now === false}>
        <Image
          source={ImageAssets.Usercheckin}
          resizeMode={'cover'}
          style={styles.iconBtnTk}
        />
      </TouchableOpacity>
    </Block>
  );
};

export default React.memo(TimeKeep, isEqual);

const rootStyles = (theme: AppTheme) =>
  StyleSheet.create({
    userName: {
      fontSize: 20,
      lineHeight: 30,
      fontWeight: '500',
      color: theme.colors.text_primary,
    } as TextStyle,
    shadow: {
      shadowColor: '#919EAB',

      ...Platform.select({
        android: {
          elevation: 12,
          // borderTopWidth: 2,
        },
        ios: {
          shadowOffset: {
            width: 0,
            height: 8,
          },
          shadowOpacity: 0.3,
          shadowRadius: 1.41,
        },
      }),
    } as ViewStyle,
    containerTimeKeep: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 16,
      borderRadius: 16,
      backgroundColor: theme.colors.bg_default,
      marginTop: 20,
      marginHorizontal: 16,
    } as ViewStyle,
    btnTimekeep: {
      width: 48,
      height: 48,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 12,
    } as ViewStyle,
    iconBtnTk: {
      width: 32,
      height: 32,
      tintColor: theme.colors.bg_default,
    },
  });
