import {
  StyleSheet,
  Text,
  View,
  ViewStyle,
  Image,
  ImageStyle,
} from 'react-native';
import React from 'react';
import {IDataCustomer} from '../../../models/types';
import {AppTheme, useTheme} from '../../../layouts/theme';
import {AppText} from '../../../components/common';
import {MainLayout} from '../../../layouts';

type Props = {
  data: IDataCustomer;
};

const InforView = (props: Props) => {
  const theme = useTheme();
  const styles = rootStyles(theme);
  console.log(props.data);
  return (
    <View style={styles.root}>
      <View style={styles.containImage}>
        <Image
          source={{
            uri:
              props.data.imageSource != undefined
                ? props.data.imageSource
                : 'https://yt3.googleusercontent.com/ytc/APkrFKa93uRfPROMhBKD5UCngwnLlJqVyhbfJEptGLtK=s900-c-k-c0x00ffffff-no-rj',
          }}
          style={styles.imageStyle}
          resizeMode="center"
        />
      </View>
      <MainLayout style={styles.containContent}>
        <View>
          <AppText
            fontSize={16}
            fontWeight="400"
            colorTheme="text_secondary"
            lineHeight={24}>
            Tên khách hàng
          </AppText>
          <AppText
            fontSize={16}
            fontWeight="400"
            colorTheme="text_primary"
            lineHeight={24}>
            {props.data.nameCompany != '' ? props.data.nameCompany : ` ---`}
          </AppText>
          <View style={styles.divider} />
        </View>
        <View>
          <AppText
            fontSize={16}
            fontWeight="400"
            colorTheme="text_secondary"
            lineHeight={24}>
            Mã khách hàng
          </AppText>
          <AppText
            fontSize={16}
            fontWeight="400"
            colorTheme="text_primary"
            lineHeight={24}>
            KH-12345
          </AppText>
          <View style={styles.divider} />
        </View>
        <View>
          <AppText
            fontSize={16}
            fontWeight="400"
            colorTheme="text_secondary"
            lineHeight={24}>
            Loại khách hàng
          </AppText>
          <AppText
            fontSize={16}
            fontWeight="400"
            colorTheme="text_primary"
            lineHeight={24}>
            {props.data.type != '' ? props.data.type : ` ---`}
          </AppText>
          <View style={styles.divider} />
        </View>
        <View>
          <AppText
            fontSize={16}
            fontWeight="400"
            colorTheme="text_secondary"
            lineHeight={24}>
            Nhóm khách hàng
          </AppText>
          <AppText
            fontSize={16}
            fontWeight="400"
            colorTheme="text_primary"
            lineHeight={24}>
            {props.data.group != '' ? props.data.group : ` ---`}
          </AppText>
          <View style={styles.divider} />
        </View>
        <View>
          <AppText
            fontSize={16}
            fontWeight="400"
            colorTheme="text_secondary"
            lineHeight={24}>
            Khu vực
          </AppText>
          <AppText
            fontSize={16}
            fontWeight="400"
            colorTheme="text_primary"
            lineHeight={24}>
            {props.data.area != '' ? props.data.area : ` ---`}
          </AppText>
          <View style={styles.divider} />
        </View>
        <View>
          <AppText
            fontSize={16}
            fontWeight="400"
            colorTheme="text_secondary"
            lineHeight={24}>
            Ngày sinh nhật
          </AppText>
          <AppText
            fontSize={16}
            fontWeight="400"
            colorTheme="text_primary"
            lineHeight={24}>
            {props.data.dob != '' ? props.data.dob : ` ---`}
          </AppText>
          <View style={styles.divider} />
        </View>
        <View>
          <AppText
            fontSize={16}
            fontWeight="400"
            colorTheme="text_secondary"
            lineHeight={24}>
            Tuyến
          </AppText>
          <AppText
            fontSize={16}
            fontWeight="400"
            colorTheme="text_primary"
            lineHeight={24}>
            {props.data.gland != '' ? props.data.gland : ` ---`}
          </AppText>
          <View style={styles.divider} />
        </View>
        <View>
          <AppText
            fontSize={16}
            fontWeight="400"
            colorTheme="text_secondary"
            lineHeight={24}>
            Hạn mức công nợ
          </AppText>
          <AppText
            fontSize={16}
            fontWeight="400"
            colorTheme="text_primary"
            lineHeight={24}>
            {props.data.debtLimit != '' ? props.data.debtLimit : ` ---`}
          </AppText>
          <View style={styles.divider} />
        </View>
        <View>
          <AppText
            fontSize={16}
            fontWeight="400"
            colorTheme="text_secondary"
            lineHeight={24}>
            Mô tả
          </AppText>
          <AppText
            fontSize={16}
            fontWeight="400"
            colorTheme="text_primary"
            lineHeight={24}>
            {props.data.description != '' ? props.data.description : ` ---`}
          </AppText>
          <View style={styles.divider} />
        </View>
        <View>
          <AppText
            fontSize={16}
            fontWeight="400"
            colorTheme="text_secondary"
            lineHeight={24}>
            Website
          </AppText>
          <AppText
            fontSize={16}
            fontWeight="400"
            colorTheme="text_primary"
            lineHeight={24}>
            {props.data.websiteURL != '' ? props.data.websiteURL : ` ---`}
          </AppText>
          <View style={styles.divider} />
        </View>
      </MainLayout>
    </View>
  );
};

export default React.memo(InforView);

const rootStyles = (theme: AppTheme) =>
  StyleSheet.create({
    root: {
      backgroundColor: theme.colors.bg_default,
      borderRadius: 12,
      marginVertical: 10,
    } as ViewStyle,
    containImage: {
      justifyContent: 'center',
      alignSelf: 'center',
      paddingVertical: 16,
      //   backgroundColor:'red'
    } as ViewStyle,
    imageStyle: {
      width: 90,
      height: 90,
      borderRadius: 12,
      //   backgroundColor:'red'
    } as ImageStyle,
    containContent: {
      paddingTop: 0,
    } as ViewStyle,
    divider: {
      height: 1,
      backgroundColor: theme.colors.divider,
      marginVertical: 12,
    } as ViewStyle,
  });
