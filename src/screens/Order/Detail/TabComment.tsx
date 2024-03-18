import React from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import {MainLayout} from '../../../layouts';
import AppContainer from '../../../components/AppContainer';
import {AppAvatar, AppIcons} from '../../../components/common';
import {Text} from 'react-native-paper';
import {ICON_TYPE} from '../../../const/app.const';
import {AppTheme, useTheme} from '../../../layouts/theme';
import {TextStyle} from 'react-native';

const TabComment = () => {
  const {colors} = useTheme();
  const styles = createStyles(useTheme());
  return (
    <MainLayout
      style={{backgroundColor: colors.bg_neutral, paddingHorizontal: 0}}>
      <AppContainer style={{marginTop: 16, paddingHorizontal: 16}}>
        <View
          style={{
            padding: 16,
            backgroundColor: colors.bg_default,
            borderRadius: 16,
          }}>
          <View
            style={[
              {paddingVertical: 4, flexDirection: 'row', marginBottom: 10},
            ]}>
            <AppAvatar
              size={40}
              url={'https://picture.vn/wp-content/uploads/2015/12/da-lat.png'}
            />
            <View style={{marginLeft: 8}}>
              <View>
                <Text style={[styles.userComment]}>Đỗ Toàn</Text>
                <Text style={[styles.commentCt]}>Đơn này đã bị huỷ</Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Text style={[styles.timeCmt]}>10 phút trước</Text>
              </View>
            </View>
          </View>
        </View>
      </AppContainer>
      <View style={styles.footer}>
        <View style={styles.containerFt}>
          <View style={styles.containerInput}>
            <TextInput
              placeholderTextColor={colors.text_secondary}
              placeholder="Nhập nội dung"
              value={''}
              style={[styles.inputStyle, {color: colors.text_secondary}]}
            />
          </View>
          <TouchableOpacity style={{marginLeft: 12}}>
            <AppIcons
              iconType={ICON_TYPE.MaterialCommunity}
              name="send"
              size={28}
              color={colors.text_secondary}
            />
          </TouchableOpacity>
        </View>
      </View>
    </MainLayout>
  );
};

export default TabComment;

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    footer: {
      backgroundColor: theme.colors.bg_default,
      borderTopWidth: 1,
      borderColor: theme.colors.border,
      padding: 16,
    } as ViewStyle,
    containerFt: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    } as ViewStyle,
    containerInput: {
      flex: 1,
      backgroundColor: theme.colors.bg_neutral,
      paddingHorizontal: 12,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 100,
    },
    userComment: {
      color: theme.colors.text_primary,
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '500',
    } as TextStyle,
    commentCt: {
      color: theme.colors.text_primary,
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '400',
    } as TextStyle,
    timeCmt: {
      color: theme.colors.text_secondary,
      fontSize: 14,
      lineHeight: 21,
      fontWeight: '400',
    } as TextStyle,
    inputStyle: {
      height: 36,
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '400',
      paddingRight: 60,
      paddingTop: 8,
    } as TextStyle,
  });
