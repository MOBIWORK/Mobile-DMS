import React, {useEffect, useRef} from 'react';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import {
  ExtendedTheme,
  useIsFocused,
  useNavigation,
  useTheme,
} from '@react-navigation/native';
import {MainLayout} from '../../../layouts';
import {
  AppButton,
  AppHeader,
  SvgIcon,
  AppText as Text,
} from '../../../components/common';
import {Button, IconButton} from 'react-native-paper';
import {NoteType} from '../../../models/types';
import {ImageAssets} from '../../../assets';
import {NavigationProp} from '../../../navigation/screen-type';
import {ApiConstant, ScreenConstant} from '../../../const';
import {dispatch} from '../../../utils/redux';
import {useSelector} from '../../../config/function';
import {checkinActions} from '../../../redux-store/checkin-reducer/reducer';
import {CommonUtils} from '../../../utils';
import {useTranslation} from 'react-i18next';
import {goBack} from '../../../navigation/navigation-service';
import {CheckinService} from '../../../services';
import {noteActions} from '../../../redux-store/note-reducer/reducer';

const CheckinNote = () => {
  const theme = useTheme();
  const styles = createStyleSheet(theme);
  const {t: getLabel} = useTranslation();
  const navigation = useNavigation<NavigationProp>();
  const data = useSelector(state => state.checkin.dataNote);
  const dataCheckin = useSelector(state => state.app.dataCheckIn);
  const categoriesCheckin = useSelector(
    state => state.checkin.categoriesCheckin,
  );
  const isForcus = useIsFocused();

  const getData = async () => {
    {
      const {status, data}: any = await CheckinService.getNoteCheckin({
        custom_checkin_id: dataCheckin.checkin_id,
      });
      if (status == ApiConstant.STT_OK) {
        dispatch(checkinActions.setData({typeData: 'note', data: data.result}));
      }
    }
  };

  useEffect(() => {
    if (isForcus) {
      getData();
    }
  }, [isForcus]);

  const completeCheckin = () => {
    const newData = categoriesCheckin.map(item =>
      item.key === 'note' ? {...item, isDone: true} : item,
    );
    dispatch(checkinActions.setDataCategoriesCheckin(newData));
    navigation.goBack();
  };

  const EmptyNote = () => {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <SvgIcon source={'EmptyNote'} size={90} />
        <Text style={{color: theme.colors.text_secondary}}>
          Chưa có ghi chú nào
        </Text>
        <Button
          style={{marginTop: 16, borderColor: theme.colors.action}}
          icon={'plus'}
          mode={'outlined'}
          labelStyle={{color: theme.colors.action}}
          onPress={() => navigation.navigate(ScreenConstant.ADD_NOTE)}>
          Tạo ghi chú
        </Button>
      </View>
    );
  };

  const ListNote = () => {
    const _renderNoteItem = (item: NoteType) => {
      return (
        <Pressable
          onPress={() =>
            navigation.navigate(ScreenConstant.NOTE_DETAIL, {data: item})
          }
          style={styles.noteItemContainer}>
          <Text colorTheme="text_primary" fontSize={16} fontWeight="500">
            {item.title}
          </Text>
          <View style={[styles.infoContainer, {marginVertical: 4}]}>
            <Image
              source={ImageAssets.NoticeIcon}
              style={{width: 16, height: 16}}
              resizeMode={'cover'}
            />
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{color: theme.colors.text_secondary, marginLeft: 4}}>
              {item.content}
            </Text>
          </View>
          <View style={styles.infoContainer}>
            <Image
              source={ImageAssets.ClockIcon}
              style={{width: 16, height: 16}}
              resizeMode={'cover'}
            />
            <Text style={{color: theme.colors.text_secondary, marginLeft: 4}}>
              {CommonUtils.convertDateToString(item.creation)}
            </Text>
          </View>
        </Pressable>
      );
    };

    return (
      <View style={{marginTop: 20, width: '100%'}}>
        <View style={styles.flexSpace}>
          <Text>{getLabel('noteList')}</Text>
          <IconButton
            icon="plus"
            iconColor={theme.colors.action}
            size={12}
            style={{
              borderColor: theme.colors.action,
            }}
            mode="outlined"
            onPress={() => navigation.navigate(ScreenConstant.ADD_NOTE)}
          />
        </View>
        <FlatList
          style={{width: '100%'}}
          showsVerticalScrollIndicator={false}
          data={data}
          renderItem={({item}) => _renderNoteItem(item)}
        />
      </View>
    );
  };

  return (
    <MainLayout style={{backgroundColor: theme.colors.bg_neutral}}>
      <AppHeader
        style={styles.header}
        label={getLabel('note')}
        onBack={() => goBack()}
      />
      <View style={styles.body}>
        {data.length > 0 ? <ListNote /> : <EmptyNote />}
      </View>
      <View style={styles.footer}>
        <AppButton
          style={{width: '100%'}}
          label={getLabel('completed')}
          onPress={() => completeCheckin()}
        />
      </View>
    </MainLayout>
  );
};
export default CheckinNote;

const createStyleSheet = (theme: ExtendedTheme) =>
  StyleSheet.create({
    flexSpace: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    } as ViewStyle,
    header: {
      flex: 0.5,
      alignItems: 'flex-start',
    } as ViewStyle,
    body: {
      flex: 9,
      alignItems: 'center',
    } as ViewStyle,
    footer: {
      flex: 1,
      alignItems: 'flex-start',
    } as ViewStyle,
    infoContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
    } as ViewStyle,
    noteItemContainer: {
      padding: 16,
      marginVertical: 8,
      width: '100%',
      borderRadius: 16,
      backgroundColor: theme.colors.bg_default,
    } as ViewStyle,
  });
