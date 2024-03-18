import React, {useEffect, useState} from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import {MainLayout} from '../../layouts';
import {useNavigation} from '@react-navigation/native';
import {AppHeader, AppIcons} from '../../components/common';
import {NavigationProp} from '../../navigation/screen-type';
import {useTranslation} from 'react-i18next';
import {AppConstant, DataConstant} from '../../const';
import AppContainer from '../../components/AppContainer';
import {IWidget} from '../../models/types';
import {useMMKVString} from 'react-native-mmkv';
import ItemuWidget from '../../components/Widget/ItemWidget';
import {AppTheme, useTheme} from '../../layouts/theme';

const UtilitiesLoveScreen = () => {
  const {colors} = useTheme();
  const styles = createSheetStyle(useTheme());
  const navigation = useNavigation<NavigationProp>();
  const {t: getLabel} = useTranslation();
  const [isEdit, setEdit] = useState<boolean>(false);
  const [widgetFv, setWidgetFv] = useMMKVString(AppConstant.Widget);
  const [widgets, setWidgets] = useState<IWidget[]>(DataConstant.DataWidget);
  const [favourites, setFavourites] = useState<IWidget[]>([]);

  const changeUtilltiesFavourites = (type: string, item: IWidget) => {
    switch (type) {
      case 'add':
        if (favourites.length < 4) {
          setFavourites([...favourites, item]);
          const newArr = widgets.map(item2 =>
            item2.id === item.id ? {...item2, isUse: true} : item2,
          );
          setWidgets(newArr);
        }
        break;
      case 'remove':
        if (favourites.length > 1) {
          setFavourites(favourites.filter(data => item.id !== data.id));
          const newArr = widgets.map(item2 =>
            item2.id === item.id ? {...item2, isUse: false} : item2,
          );
          setWidgets(newArr);
        }
        break;
      default:
        break;
    }
  };

  const getUtlFavourites = () => {
    if (widgetFv) {
      const arrN = JSON.parse(widgetFv);
      setFavourites(arrN);
      const mergedArray = widgets.map(item1 => {
        const matchingItem = arrN.find((item2: any) => item2.id === item1.id);
        if (matchingItem) {
          return {...item1, isUse: true};
        } else {
          return item1;
        }
      });
      setWidgets(mergedArray);
    }
  };

  const onSave = () => {
    setEdit(false);
    setWidgetFv(JSON.stringify(favourites));
  };

  useEffect(() => {
    getUtlFavourites();
  }, []);

  return (
    <MainLayout style={styles.layout}>
      <AppContainer>
        <View style={styles.container}>
          <AppHeader
            label={getLabel('Tuỳ chỉnh tiện ích')}
            onBack={() => navigation.goBack()}
          />
          <View>
            <View style={[styles.flexSpace]}>
              <Text style={[styles.titleView]}>
                {getLabel('Tiên ích yêu thích')}
              </Text>
              <Text style={[styles.action]}>
                {isEdit ? (
                  <Text onPress={() => onSave()}>{getLabel('Lưu lại')}</Text>
                ) : (
                  <Text onPress={() => setEdit(!isEdit)}>
                    {getLabel('Chỉnh sửa')}
                  </Text>
                )}
              </Text>
            </View>
            {isEdit && (
              <View style={styles.viewDesc}>
                <Text style={[styles.descAction]}>
                  {getLabel('Nhấn giữ và kéo để di chuyển tiện ích')}
                </Text>
              </View>
            )}
            <View style={styles.viewWg}>
              <View style={[styles.containerItem]}>
                {favourites &&
                  favourites.map(item => (
                    <View key={item.id} style={styles.viewItem}>
                      <ItemuWidget
                        name={item.name}
                        source={item.icon}
                        navigate={item.navigate}
                        isTouchable={isEdit ? false : true}
                        handleChangeWidget={() =>
                          changeUtilltiesFavourites('remove', item)
                        }
                      />
                      {isEdit ? (
                        <Pressable
                          onPress={() =>
                            changeUtilltiesFavourites('remove', item)
                          }
                          style={styles.positionBt}>
                          <AppIcons
                            iconType="AntIcon"
                            name="minuscircle"
                            size={16}
                            color={colors.text_disable}
                          />
                        </Pressable>
                      ) : (
                        ''
                      )}
                    </View>
                  ))}
              </View>
            </View>
          </View>
          <View>
            <Text style={[styles.titleView]}>{getLabel('Tất cả')}</Text>
            <View style={styles.viewWg}>
              <View style={[styles.containerItem]}>
                {widgets &&
                  widgets.map(item => (
                    <View
                      key={item.id}
                      style={[
                        styles.viewItem,
                        {opacity: item.isUse && isEdit ? 0.7 : 1},
                      ]}>
                      <ItemuWidget
                        name={item.name}
                        source={item.icon}
                        navigate={item.navigate}
                        isTouchable={isEdit ? false : true}
                        handleChangeWidget={() =>
                          item.isUse
                            ? changeUtilltiesFavourites('remove', item)
                            : changeUtilltiesFavourites('add', item)
                        }
                      />
                      {isEdit ? (
                        <View style={styles.positionBt}>
                          {item.isUse ? (
                            <AppIcons
                              onPress={() =>
                                changeUtilltiesFavourites('remove', item)
                              }
                              iconType="AntIcon"
                              name="minuscircle"
                              size={16}
                              color={colors.text_disable}
                            />
                          ) : (
                            <AppIcons
                              onPress={() =>
                                changeUtilltiesFavourites('add', item)
                              }
                              iconType="IonIcon"
                              name="add-circle"
                              size={20}
                              color={colors.success}
                            />
                          )}
                        </View>
                      ) : (
                        ''
                      )}
                    </View>
                  ))}
              </View>
            </View>
          </View>
        </View>
      </AppContainer>
    </MainLayout>
  );
};

export default UtilitiesLoveScreen;

const createSheetStyle = (theme: AppTheme) =>
  StyleSheet.create({
    flexSpace: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    } as ViewStyle,
    container: {
      paddingHorizontal: 16,
      rowGap: 24,
    } as ViewStyle,
    layout: {
      backgroundColor: theme.colors.bg_neutral,
      paddingHorizontal: 0,
    } as ViewStyle,
    header: {
      fontSize: 24,
      fontWeight: '500',
      lineHeight: 36,
      marginTop: 8,
      marginBottom: 20,
    } as TextStyle,
    titleView: {
      color: theme.colors.text_secondary,
      fontSize: 14,
      lineHeight: 21,
      fontWeight: '500',
    } as TextStyle,
    action: {
      fontSize: 14,
      lineHeight: 21,
      fontWeight: '500',
      color: theme.colors.action,
    } as TextStyle,
    containerItem: {
      flexDirection: 'row',
      paddingTop: 16,
      flexWrap: 'wrap',
      paddingBottom: 0,
      marginLeft: -16,
    } as ViewStyle,
    viewDesc: {
      backgroundColor: 'rgba(24, 119, 242, 0.05)',
      borderRadius: 4,
      padding: 10,
      marginBottom: 12,
      marginTop: 12,
    } as ViewStyle,
    descAction: {
      color: theme.colors.action,
      fontWeight: '400',
      borderRadius: 4,
    } as TextStyle,
    viewWg: {
      backgroundColor: theme.colors.bg_default,
      borderRadius: 16,
      minHeight: 100,
      marginTop: 8,
    } as ViewStyle,
    viewItem: {
      width: (AppConstant.WIDTH - 80) / 4,
      marginLeft: 16,
      marginBottom: 16,
      position: 'relative',
    } as ViewStyle,
    positionBt: {
      position: 'absolute',
      right: 8,
      top: 0,
    } as ViewStyle,
  });
