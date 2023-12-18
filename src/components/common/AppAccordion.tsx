import React, {FC, ReactElement} from 'react';
import Accordition from '@volkenomakers/react-native-accordion';
import {ImageAssets} from '../../assets';
import {View} from 'react-native';
import {useTheme} from '@react-navigation/native';
const AppAccordion: FC<AppAccordionProps> = ({
  titleInsideType,
  title,
  children,
}) => {
  const {colors} = useTheme();
  return (
    <Accordition
      containerStyle={{
        padding: 0,
        borderRadius: titleInsideType ? 0 : 16,
        backgroundColor: titleInsideType ? undefined : colors.bg_default,
      }}
      titleStyle={{
        padding: 16,
        fontSize: 14,
        fontWeight: '500',
        color: titleInsideType ? colors.text_secondary : colors.text_primary,
      }}
      iconStyle={{width: 24, height: 24, resizeMode: 'contain'}}
      icon={ImageAssets.ChevronUpIcon}
      title={titleInsideType ? title : title.toUpperCase()}>
      <View
        style={{
          borderRadius: titleInsideType ? 16 : 0,
          backgroundColor: titleInsideType ? colors.bg_default : undefined,
          padding: 16,
          paddingTop: titleInsideType ? undefined : 0,
        }}>
        {children}
      </View>
    </Accordition>
  );
};
interface AppAccordionProps {
  titleInsideType: boolean;
  title: string;
  children: ReactElement;
}
export default AppAccordion;
