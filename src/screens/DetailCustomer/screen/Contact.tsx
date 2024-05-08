import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import React from 'react';
import {AppTheme, useTheme} from '../../../layouts/theme';


import {AppIcons, AppText} from '../../../components/common';
import {AppConstant} from '../../../const';
import {useTranslation} from 'react-i18next';
import isEqual from 'react-fast-compare';
import { IDataCustomers} from '../../../models/types';
import {SafeAreaView} from 'react-native-safe-area-context';
import CardContactOverview from '../component/CardView';
import CardContactView from '../component/CardContactView';

type Props = {
  onPressAdding: () => void;
  data: IDataCustomers;
};

const Contact = (props: Props) => {
  const {onPressAdding} = props;
  const theme = useTheme();
  const styles = rootStyles(theme);
  const {t: getLabel} = useTranslation();

  return (
    <SafeAreaView style={styles.root} edges={['bottom']}>
      <View style={styles.containLabel}>
        <AppText fontSize={14} fontWeight="400" colorTheme="text_secondary">
          {getLabel('listContact')}
        </AppText>
        <TouchableOpacity style={styles.containButton} onPress={onPressAdding}>
          <AppIcons
            iconType={AppConstant.ICON_TYPE.AntIcon}
            name="plus"
            size={16}
            color={theme.colors.action}
          />
        </TouchableOpacity>
      </View>
      {props.data.contact &&
      props.data.contact != null &&
      props.data.contact.length > 0 ? (
        <FlatList
          data={props.data.contact}
          keyExtractor={(item, index) => item.first_name}
          showsVerticalScrollIndicator={false}
          initialNumToRender={10}
          windowSize={11}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          decelerationRate={'fast'}
          renderItem={({item}) => {
            return <CardContactView data={item} />;
          }}
        />
      ) : (
        <CardContactOverview data={props.data} />
      )}
    </SafeAreaView>
  );
};

export default React.memo(Contact, isEqual);

const rootStyles = (theme: AppTheme) =>
  StyleSheet.create({
    root: {
      paddingHorizontal: 16,
      backgroundColor: theme.colors.bg_neutral,
      flex: 1,
      // backgroundColor:'red',
      // flex:1
    } as ViewStyle,
    containLabel: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 16,
    } as ViewStyle,
    containButton: {
      width: 30,
      height: 30,
      borderRadius: 30,
      borderWidth: 1,
      borderColor: theme.colors.action,
      justifyContent: 'center',
      alignItems: 'center',
    } as ViewStyle,
  });
