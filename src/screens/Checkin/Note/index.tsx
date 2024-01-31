import React, {useEffect, useRef} from 'react';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import {ExtendedTheme, useNavigation, useTheme} from '@react-navigation/native';
import {MainLayout} from '../../../layouts';
import {
  AppButton,
  AppContainer,
  AppHeader,
  SvgIcon,
} from '../../../components/common';
import {Button} from 'react-native-paper';
import BottomSheet from '@gorhom/bottom-sheet';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ItemNoteVisitDetail} from '../../../models/types';
import {ImageAssets} from '../../../assets';
import {NavigationProp, goBack} from '../../../navigation';
import {ScreenConstant} from '../../../const';
import {dispatch} from '../../../utils/redux';
import {appActions} from '../../../redux-store/app-reducer/reducer';
import {useSelector} from '../../../config/function';

const CheckinNote = () => {
  const theme = useTheme();
  const styles = createStyleSheet(theme);
  const {bottom} = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const mounted = useRef<boolean>(true);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const listNote = useSelector(state => state.app?.dataCheckIn?.listNote);

  useEffect(() => {
    mounted.current;
    dispatch(appActions.getListNote());
    mounted.current = false;
    return () => {};
  }, []);

  const EmptyNote = () => {
    return (
      <>
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
      </>
    );
  };
  const ListNote = () => {
    const _renderNoteItem = (item: ItemNoteVisitDetail) => {
      return (
        <Pressable>
          <Pressable
            onPress={() =>
              navigation.navigate(ScreenConstant.NOTE_DETAIL, {data: item})
            }
            style={styles.noteItemContainer}>
            <Text
              style={{
                color: theme.colors.text_primary,
                fontSize: 16,
                fontWeight: '500',
              }}>
              {item.noteType}
            </Text>
            <View style={[styles.infoContainer, {marginVertical: 4}]}>
              <Image
                source={ImageAssets.NoticeIcon}
                style={{width: 16, height: 16}}
                resizeMode={'cover'}
              />
              <Text style={{color: theme.colors.text_secondary, marginLeft: 4}}>
                {item.description}
              </Text>
            </View>
            <View style={styles.infoContainer}>
              <Image
                source={ImageAssets.ClockIcon}
                style={{width: 16, height: 16}}
                resizeMode={'cover'}
              />
              <Text style={{color: theme.colors.text_secondary, marginLeft: 4}}>
                {item.time}, {item.date}
              </Text>
            </View>
          </Pressable>
        </Pressable>
      );
    };

    return (
      <FlatList
        style={{width: '100%'}}
        showsVerticalScrollIndicator={false}
        data={NoteData}
        renderItem={({item}) => _renderNoteItem(item)}
      />
    );
  };

  return (
    <MainLayout style={{backgroundColor: theme.colors.bg_neutral}}>
      <AppHeader
        style={styles.header}
        label={'Ghi chú'}
        onBack={() => goBack()}
      />
      <View style={styles.body}>
        {listNote && listNote?.length > 0 ? <ListNote /> : <EmptyNote />}
        {/* <EmptyNote /> */}
        {/*<AppContainer*/}
        {/*  style={{*/}
        {/*    marginBottom: bottom,*/}
        {/*  }}>*/}
        {/*  <>*/}
        {/*  </>*/}
        {/*</AppContainer>*/}
        {/*<ListNote />*/}
      </View>
      <View style={styles.footer}>
        <AppButton
          style={{width: '100%'}}
          label={'Hoàn thành'}
          onPress={() => console.log('123')}
        />
      </View>
    </MainLayout>
  );
};
export default CheckinNote;
const createStyleSheet = (theme: ExtendedTheme) =>
  StyleSheet.create({
    header: {
      flex: 0.5,
      alignItems: 'flex-start',
    } as ViewStyle,
    body: {
      flex: 9,
      alignItems: 'center',
      justifyContent: 'center',
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

const NoteData: ItemNoteVisitDetail[] = [
  {
    noteType: 'Loại ghi chú',
    description: 'Mô tả ghi chú',
    content:
      'Ghi chú cho đơn hàng ngày 20/12/2023 Unleash your professional potential with Wordtune GenAI tools for work. Busy professionals have tons of work to get through. Some accept the frustration while others choose Wordtune to speed up their tasks.',
    time: '10:20:00',
    date: '21/11/2023',
  },
  {
    noteType: 'Loại ghi chú',
    description: 'Mô tả ghi chú',
    content:
      'Ghi chú cho đơn hàng ngày 20/12/2023 Unleash your professional potential with Wordtune GenAI tools for work. Busy professionals have tons of work to get through. Some accept the frustration while others choose Wordtune to speed up their tasks.',
    time: '10:20:00',
    date: '21/11/2023',
  },
  {
    noteType: 'Loại ghi chú',
    description: 'Mô tả ghi chú',
    content:
      'Ghi chú cho đơn hàng ngày 20/12/2023 Unleash your professional potential with Wordtune GenAI tools for work. Busy professionals have tons of work to get through. Some accept the frustration while others choose Wordtune to speed up their tasks.',
    time: '10:20:00',
    date: '21/11/2023',
  },
  {
    noteType: 'Loại ghi chú',
    description: 'Mô tả ghi chú',
    content:
      'Ghi chú cho đơn hàng ngày 20/12/2023 Unleash your professional potential with Wordtune GenAI tools for work. Busy professionals have tons of work to get through. Some accept the frustration while others choose Wordtune to speed up their tasks.',
    time: '10:20:00',
    date: '21/11/2023',
  },
];
