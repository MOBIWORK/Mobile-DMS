import {
  ActivityIndicator,
  FlatList,
  NativeSyntheticEvent,
  StyleSheet,
  TextInputSubmitEditingEventData,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import React, {useMemo, useState, useTransition} from 'react';
import Modal from 'react-native-modal';
import {Block, AppIcons, AppText as Text} from '../../../components/common';
import {AppConstant} from '../../../const';
import {getLabel} from '../../../language';
import {AppTheme, useTheme} from '../../../layouts/theme';
import isEqual from 'react-fast-compare';
import {IDataCustomers, ListCustomerTerritory} from '../../../models/types';
import {Searchbar} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
import {ImageAssets} from '../../../assets';

type Props = {
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  listTerritory: ListCustomerTerritory[];
  data: IDataCustomers;
  setData: React.Dispatch<React.SetStateAction<IDataCustomers>>;
  openModal: boolean;
  onBackButtonPress: () => void;
};

const ModalArea = (props: Props) => {
  const theme = useTheme();
  const styles = rootStyles(theme);
  const {
    setOpenModal,
    data,
    listTerritory,
    setData,
    openModal,
    onBackButtonPress,
  } = props;
  const [searchValue, setSearchValue] = useState<string>('');
  const [filterText, setFilterText] = useState<string>('');
  const {t: getLabel} = useTranslation();
  const [isPending, startTransition] = useTransition();

  const dataMemo = useMemo(() => {
    const normalizedFilterText = filterText
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .split(' '); // Normalize, remove diacritics, convert to lowercase, and split into words

    const filteredItems = listTerritory.filter(item => {
      const normalizedName = item.name
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .split(' '); // Normalize, remove diacritics, convert to lowercase, and split into words

        return normalizedFilterText.every(word =>
        normalizedName.some(nameWord => nameWord.includes(word)),
      );
    });
  
    console.log(normalizedFilterText,'item texr')

    return filteredItems.length > 0 ? filteredItems : listTerritory;
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
    });
  };
  return (
    <Modal
      isVisible={openModal}
      animationIn={'slideInUp'}
      animationOut={'slideOutDown'}
      onBackButtonPress={onBackButtonPress}
      backdropOpacity={0.5}
      style={styles.modalStyle}>
      <Block
        height={400}
        colorTheme="bg_default"
        borderTopLeftRadius={16}
        borderTopRightRadius={16}>
        <Block style={styles.headerBottomSheet}>
          <TouchableOpacity
            style={styles.containClose}
            onPress={() => {
              setOpenModal(false);
            }}>
            <AppIcons
              iconType={AppConstant.ICON_TYPE.IonIcon}
              name={'close'}
              size={24}
              color={theme.colors.text_disable}
            />
          </TouchableOpacity>

          <Text style={styles.titleHeaderText}>{getLabel('area')}</Text>
          <Text style={styles.titleHeaderText} />
        </Block>
        <Block
          direction="row"
          alignItems="center"
          justifyContent="flex-start"
          marginBottom={20}
          width={'100%'}>
          <Searchbar
            placeholder={getLabel('search') + '...'}
            value={searchValue}
            onChangeText={handleItem}
            onSubmitEditing={onSubmitEnd}
            icon={ImageAssets.SearchIcon}
            placeholderTextColor={theme.colors.text_disable}
            inputStyle={{color: theme.colors.text_primary}}
            style={styles.searchBar}
            iconColor={theme.colors.text_disable}
            onClearIconPress={() => setSearchValue('')}
          />
        </Block>
        <FlatList
          data={dataMemo}
          keyExtractor={(item, index) => item.name}
          showsVerticalScrollIndicator={false}
          bounces
          initialNumToRender={10}
          windowSize={21}
          renderItem={({item, index}) => {
            return  (
              <TouchableOpacity
                style={styles.containItemBottomView}
                key={index.toString()}
                onPress={() => {
                  setData(prev => ({
                    ...prev,
                    territory: item?.territory_name! || '',
                  }));
                  setOpenModal(false);
                  setSearchValue('');
                }}>
                <Text
                  style={styles.itemText(item.territory_name, data.territory)}>
                  {item.territory_name}
                </Text>
                {item.territory_name === data.territory && (
                  <AppIcons
                    iconType={AppConstant.ICON_TYPE.Feather}
                    name="check"
                    size={24}
                    color={theme.colors.primary}
                  />
                )}
              </TouchableOpacity>
            );
          }}
        />
      </Block>
    </Modal>
  );
};

export default React.memo(ModalArea, isEqual);

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
      // backgroundColor: theme.colors.bg_default,
      marginHorizontal: 0,
      marginVertical: 0,
      justifyContent: 'flex-end',
      // borderTopLeftRadius:26,
      // borderTopRightRadius:26
      // marginTop:200
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
      backgroundColor: theme.colors.bg_default,
      borderRadius: 10,
      width: '90%',
      marginLeft: 12,
    } as ViewStyle,
  });
