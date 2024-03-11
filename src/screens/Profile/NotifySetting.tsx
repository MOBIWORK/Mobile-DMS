import React, {useState} from 'react';
import {MainLayout} from '../../layouts';
import {AppHeader} from '../../components/common';
import {useTranslation} from 'react-i18next';
import {useNavigation, useTheme} from '@react-navigation/native';
import {NavigationProp} from '../../navigation';
import {View, StyleSheet, Text, Switch, ViewStyle} from 'react-native';
import ProfileItem from './components/ProfileItem';
const NotifySetting = () => {
  const {t: getLabel} = useTranslation();
  const navigation = useNavigation<NavigationProp>();
  const {colors} = useTheme();

  const [abnormal, setAbnormal] = useState<boolean>(false);
  const [otherLogin, setOtherLogin] = useState<boolean>(false);
  const [update, setUpdate] = useState<boolean>(true);
  const [service, setService] = useState<boolean>(false);

  return (
    <MainLayout style={{backgroundColor: colors.bg_neutral}}>
      <AppHeader
        label={getLabel('notifySetting')}
        onBack={() => navigation.goBack()}
      />
      <View style={styles.itemContainer}>
        <Text style={{color: colors.text_secondary, marginVertical: 8}}>
          {getLabel('notifySecurity')}
        </Text>
        <View style={[styles.itemView, {backgroundColor: colors.bg_default}]}>
          <ProfileItem
            label={getLabel('notifyAbnormal')}
            rightComponent={
              <Switch
                value={abnormal}
                onValueChange={() => setAbnormal(!abnormal)}
              />
            }
          />
          <ProfileItem
            label={getLabel('notifyOtherLogin')}
            rightComponent={
              <Switch
                value={otherLogin}
                onValueChange={() => setOtherLogin(!otherLogin)}
              />
            }
          />
        </View>
      </View>
      <View style={styles.itemContainer}>
        <Text style={{color: colors.text_secondary, marginVertical: 8}}>
          {getLabel('receiveNews')}
        </Text>
        <View style={[styles.itemView, {backgroundColor: colors.bg_default}]}>
          <ProfileItem
            label={getLabel('notifyLastUpdate')}
            rightComponent={
              <Switch value={update} onValueChange={() => setUpdate(!update)} />
            }
          />
          <ProfileItem
            label={getLabel('notifyService')}
            rightComponent={
              <Switch
                value={service}
                onValueChange={() => setService(!service)}
              />
            }
          />
        </View>
      </View>
    </MainLayout>
  );
};
export default NotifySetting;
const styles = StyleSheet.create({
  itemContainer: {
    marginTop: 32,
    alignItems: 'flex-start',
    justifyContent: 'center',
  } as ViewStyle,
  itemView: {
    borderRadius: 8,
  },
});
