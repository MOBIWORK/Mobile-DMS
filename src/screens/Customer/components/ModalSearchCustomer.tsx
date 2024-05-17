import {
  ImageStyle,
  StyleSheet,
  TextInputSubmitEditingEventData,
  TextStyle,
  TouchableOpacity,
} from 'react-native';
import React, {useCallback, useMemo, useState, useTransition} from 'react';
import {AppTheme, useTheme} from '../../../layouts/theme';
import Modal from 'react-native-modal';
import {ViewStyle} from 'react-native';
import {useTranslation} from 'react-i18next';
import {NativeSyntheticEvent} from 'react-native';
import {IDataCustomers} from '../../../models/types';
import {
  AppIcons,
  AppImage,
  Block,
  SvgIcon,
  AppText as Text,
} from '../../../components/common';
import {Searchbar} from 'react-native-paper';
import {ImageAssets} from '../../../assets';
import {useSelector} from '../../../config/function';
import {shallowEqual} from 'react-redux';
import {dispatch} from '../../../utils/redux';
import {appActions} from '../../../redux-store/app-reducer/reducer';

type Props = {
  showModal: boolean;
  onBackButtonPress: () => void;
  setDataCustomer: React.Dispatch<React.SetStateAction<IDataCustomers[]>>;
  data: IDataCustomers[];
};

const ModalSearchCustomer = (props: Props) => {
  const theme = useTheme();
  const styles = rootStyles(theme);
  const {showModal, onBackButtonPress, setDataCustomer, data} = props;
  const [searchValue, setSearchValue] = useState<string>('');
  const [filterText, setFilterText] = useState<string>('');
  const {t: getLabel} = useTranslation();
  const [isPending, startTransition] = useTransition();
  const listCustomer: IDataCustomers[] = useSelector(
    state => state.customer.listCustomer?.data,
    shallowEqual,
  );
  const listSearch = useSelector(state => state.app?.listSearch, shallowEqual);

  const dataMemo = useMemo(() => {
    const normalizedFilterText = filterText
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .split(' '); // Normalize, remove diacritics, convert to lowercase, and split into words

    const filteredItems = data?.filter(item => {
      const normalizedName = item.name
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .split(' '); // Normalize, remove diacritics, convert to lowercase, and split into words

      return normalizedFilterText.every(word =>
        normalizedName.some(nameWord => nameWord.includes(word)),
      );
    });

    return  data && filteredItems?.length > 0  ? filteredItems : [];
  }, [filterText]);

  const handleItem = (text: any) => {
    setSearchValue(text);
    startTransition(() => {
      setFilterText(text);
    });
  };
  const onSubmitEnd = (
    event: NativeSyntheticEvent<TextInputSubmitEditingEventData>,
  ) => {
    setSearchValue(event.nativeEvent.text);
    startTransition(() => {
      setFilterText(event.nativeEvent.text);
      setDataCustomer(dataMemo);
      dispatch(appActions.setListSearch(event.nativeEvent.text));
    });
    onBackButtonPress();
  };

  const onBack = useCallback(() => {
    startTransition(() => {
      setDataCustomer(listCustomer);
    });
    onBackButtonPress();
  }, [data]);

  const onClear = (item: string) => {
    dispatch(appActions.clearOnSelect(item));
  };
  const onClearIconPress = useCallback(() => {
    setSearchValue('');
    startTransition(() => {
      setDataCustomer(listCustomer);
    });
  }, [searchValue]);

  return (
    <Modal
      isVisible={showModal}
      animationIn="slideInUp"
      animationOut={'slideOutDown'}
      backdropOpacity={0.5}
      onBackButtonPress={onBackButtonPress}
      onBackdropPress={onBackButtonPress}
      style={styles.modalStyle}>
      <Block block colorTheme="bg_default">
        <Block
          direction="row"
          marginTop={10}
          justifyContent="center"
          alignItems="center"
          paddingHorizontal={20}>
          <TouchableOpacity onPress={onBack}>
            <Block width={24} height={24} justifyContent="center" middle>
              <SvgIcon source="arrowLeft" size={24} />
            </Block>
          </TouchableOpacity>
          <Searchbar
            value={searchValue}
            placeholder={getLabel('search') + '...'}
            onChangeText={handleItem}
            onSubmitEditing={onSubmitEnd}
            icon={ImageAssets.SearchIcon}
            placeholderTextColor={theme.colors.text_disable}
            inputStyle={{color: theme.colors.text_primary}}
            style={styles.searchBar}
            iconColor={theme.colors.text_disable}
            onClearIconPress={onClearIconPress}
          />
        </Block>
        <Block paddingVertical={12} paddingHorizontal={16}>
          <Block marginBottom={20}>
            <Text fontSize={14} colorTheme="text_primary" fontWeight="500">
              Tìm kiếm gần đây
            </Text>
          </Block>
          {listSearch &&
          typeof listSearch != 'undefined' &&
          listSearch?.length > 0 ? (
            <Block>
              {listSearch.map((item: string, index: number) => {
                return (
                  <Block
                    key={index}
                    direction="row"
                    paddingVertical={8}
                    justifyContent="space-between"
                    alignItems="center">
                    <Text
                      fontSize={16}
                      colorTheme="text_primary"
                      fontWeight="500">
                      {item}
                    </Text>
                    <TouchableOpacity
                      style={styles.clearText}
                      onPress={() => onClear(item)}>
                      <AppImage
                        source="CloseIcon"
                        size={10}
                        style={styles.iconClose}
                      />
                    </TouchableOpacity>
                  </Block>
                );
              })}
            </Block>
          ) : null}
        </Block>
      </Block>
    </Modal>
  );
};

export default ModalSearchCustomer;

const rootStyles = (theme: AppTheme) =>
  StyleSheet.create({
    headerBottomSheet: {
      marginHorizontal: 16,
      marginBottom: 8,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      // marginVertical:16,
      paddingVertical: 8,
      height: 43,
      // backgroundColor:'red'
    } as ViewStyle,
    titleHeaderText: {
      fontSize: 18,
      fontWeight: '500',
      lineHeight: 24,
      color: theme.colors.text_primary,
    } as TextStyle,
    itemText: (text: string, value: string) =>
      ({
        fontSize: 16,
        fontWeight: text === value ? '600' : '400',
        lineHeight: 21,
        marginBottom: 16,
        color: theme.colors.text_primary,
      } as TextStyle),
    containItemBottomView: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginHorizontal: 16,
      marginBottom: 5,
    } as ViewStyle,
    modalStyle: {
      marginHorizontal: 0,
      marginVertical: 0,
    } as ViewStyle,
    containClose: {
      width: 26,
      height: 26,
      justifyContent: 'center',
      alignContent: 'center',
      // paddingVertical:8
      // backgroundColor:'red'
    } as ViewStyle,
    searchBar: {
      backgroundColor: theme.colors.bg_neutral,
      borderRadius: 10,
      // width: '90%',
      marginLeft: 12,
      flex: 1,
    } as ViewStyle,
    clearText: {
      width: 28,
      height: 28,
    } as ViewStyle,
    iconClose: {
      width: 24,
      height: 24,
      tintColor: theme.colors.text_disable,
    } as ImageStyle,
  });
