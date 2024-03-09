import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import React, {useCallback} from 'react';
import {ProfileContent} from '../ultil/config';
import {useTheme} from '../../../layouts/theme';
import {AppSwitch, AppText, SvgIcon} from '../../../components/common';
import {useTranslation} from 'react-i18next';
import {useSelector} from '../../../config/function';

type Props = {
  item: ProfileContent;
  onSwitch: () => void;
};

const ContentItemView = (props: Props) => {
  const {item, onSwitch} = props;
  const theme = useTheme();
  const appTheme = useSelector(state => state.app.theme);
  const {t: getLabel, i18n} = useTranslation();

  const handleOnPress = useCallback(
    (name: string) => {
      switch (name) {
        case 'language':
          i18n.language === 'vi'
            ? i18n.changeLanguage('en')
            : i18n.changeLanguage('vi');
          break;
        case 'theme':
          onSwitch();
          break;
        default:
          break;
      }
    },
    [i18n.language, appTheme],
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.containLabel}
        onPress={() =>
          item.rightSide ? handleOnPress(item.name) : item.onPress()
        }>
        <SvgIcon source={item.icon} size={24} color={theme.colors.bg_neutral} />
        <AppText colorTheme="text_primary"> {getLabel(item.name)}</AppText>
      </TouchableOpacity>
      <TouchableOpacity onPress={onSwitch}>
        {item.rightSide && item.name === 'language' ? (
          <TouchableOpacity
            style={styles.containTouchable}
            onPress={() =>
              i18n.language === 'vi'
                ? i18n.changeLanguage('en')
                : i18n.changeLanguage('vi')
            }>
            {i18n.language === 'vi' ? (
              <SvgIcon source="VnFlag" size={20} />
            ) : (
              <SvgIcon source="EnFlag" size={20} />
            )}
            <Text>{''}</Text>
            <SvgIcon source="ArrowDown" size={16} />
          </TouchableOpacity>
        ) : item.rightSide && item.name === 'darkMode' ? (
          <View>
            <AppSwitch
              type="none"
              onSwitch={onSwitch}
              status={appTheme === 'dark'}
            />
          </View>
        ) : null}
      </TouchableOpacity>
    </View>
  );
};

export default ContentItemView;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  containLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  } as ViewStyle,
  containTouchable: {
    //   flex: 1,
    // backgroundColor:'red',
    paddingHorizontal: 8,
    flexDirection: 'row',
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
});
