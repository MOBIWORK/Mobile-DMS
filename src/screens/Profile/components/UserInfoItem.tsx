import React, {FC} from 'react';
import {TouchableOpacity, View, Text, Image} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {AppIcons} from '../../../components/common';
import {AppConstant} from '../../../const';
const InfoItem: FC<InfoItemProps> = ({
  title,
  img,
  content,
  borderBottomDisable,
  onPress,
  unEdit,
}) => {
  const {colors} = useTheme();
  return (
    <TouchableOpacity
      style={{
        borderBottomWidth: borderBottomDisable ? 0 : 1,
        borderColor: colors.border,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
      }}
      onPress={onPress}
      disabled={unEdit}>
      <Text style={{fontSize: 16, color: colors.text_secondary}}>{title}</Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start',
          alignContent: 'flex-end',
        }}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {img ? (
            <Image
              source={{uri: img}}
              style={{width: 40, height: 40, borderRadius: 20}}
              resizeMode={'cover'}
            />
          ) : (
            <Text
              style={{
                fontSize: 16,
                color: colors.text_primary,
                maxWidth: 250,
              }}
              ellipsizeMode={'tail'}
              numberOfLines={1}>
              {content}
            </Text>
          )}
        </View>
        <View style={{marginLeft: 8}}>
          <AppIcons
            iconType={
              unEdit
                ? AppConstant.ICON_TYPE.Feather
                : AppConstant.ICON_TYPE.EntypoIcon
            }
            name={unEdit ? 'lock' : 'chevron-right'}
            color={colors.text_secondary}
            size={24}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};
interface InfoItemProps {
  title: string;
  onPress?: () => void;
  borderBottomDisable?: boolean;
  img?: string;
  content?: string;
  unEdit?: boolean;
}
export default InfoItem;
