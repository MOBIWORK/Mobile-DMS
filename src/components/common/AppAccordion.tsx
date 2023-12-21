import React, {FC, ReactElement, useState} from 'react';
import {ImageAssets} from '../../assets';
import {Image, View, ViewStyle} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {ListItem} from '@rneui/themed';
import {AppIcons} from './AppIcons';
import {AppConstant} from '../../const';

const AppAccordion: FC<AppAccordionProps> = ({
  styles,
  titleInsideType,
  title,
  children,
}) => {
  const {colors} = useTheme();
  const [expanded, setExpanded] = useState<boolean>(true);
  return (
    <ListItem.Accordion
      isExpanded={expanded}
      onPress={() => setExpanded(!expanded)}
      expandIcon={
        <Image
          source={ImageAssets.ChevronUpIcon}
          style={{width: 24, height: 24}}
          resizeMode={'cover'}
        />
      }
      icon={
        <AppIcons
          iconType={AppConstant.ICON_TYPE.MateriallIcon}
          name={'chevron-right'}
          size={24}
          color={colors.text_secondary}
        />
      }
      style={{marginTop: 16, ...styles}}
      containerStyle={{
        paddingRight: 8,
        paddingVertical: titleInsideType ? undefined : 20,
        width: '100%',
        borderRadius: titleInsideType ? 0 : 16,
        borderBottomLeftRadius: expanded ? 0 : 16,
        borderBottomRightRadius: expanded ? 0 : 16,
        backgroundColor: titleInsideType ? undefined : colors.bg_default,
      }}
      content={
        <>
          <ListItem.Content>
            <ListItem.Title
              style={{
                fontSize: 14,
                fontWeight: '500',
                color: titleInsideType
                  ? colors.text_secondary
                  : colors.text_primary,
              }}>
              {title}
            </ListItem.Title>
          </ListItem.Content>
        </>
      }>
      <View
        style={{
          borderRadius: 16,
          borderTopLeftRadius: titleInsideType ? 16 : 0,
          borderTopRightRadius: titleInsideType ? 16 : 0,
          backgroundColor: colors.bg_default,
          padding: 16,
          paddingTop: titleInsideType ? undefined : 0,
        }}>
        {children}
      </View>
    </ListItem.Accordion>
  );
};
interface AppAccordionProps {
  styles?: ViewStyle;
  titleInsideType: boolean;
  title: string;
  children: ReactElement;
}
export default AppAccordion;
