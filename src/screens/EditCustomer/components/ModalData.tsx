import {
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
  TextStyle,
  NativeSyntheticEvent,
  TextInputSubmitEditingEventData,
  FlatList,
} from 'react-native';
import React, { useCallback, useMemo, useState, useTransition } from 'react';
import isEqual from 'react-fast-compare';
import { AppIcons, Block, AppText as Text } from '../../../components/common';
import Modal from 'react-native-modal';
import { AppTheme, useTheme } from '../../../layouts/theme';
import { useTranslation } from 'react-i18next';
import { AppConstant } from '../../../const';
import {
  listFilterType,
  listFrequencyType,
} from '../../Customer/components/data';
import {
  DetailCustomerType,
  ListChannel,
  ListCustomerRoute,
  ListCustomerType,
  ListTypeCustomer,
} from '../../../models/types';
import { Searchbar } from 'react-native-paper';
import { ImageAssets } from '../../../assets';
import { useSelector } from '../../../config/function';
type Props = {
  type: string;
  isVisible: boolean;
  onBackButton: () => void;
  data: DetailCustomerType;
  setData: React.Dispatch<React.SetStateAction<DetailCustomerType>>;
};

const ModalData = ({ onBackButton, type, isVisible, setData, data }: Props) => {
  const theme = useTheme();
  const styles = modalStyles(theme);
  const { t: getLabel } = useTranslation();

  const [filterText, setFilterText] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [isPending, startEffect] = useTransition();
  const customerType: ListCustomerType[] = useSelector(
    state => state.customer.listCustomerType,
  );
  const listRoute: ListCustomerRoute[] = useSelector(
    state => state.customer.listCustomerRoute,
  );
  const listTypeCustomer: ListTypeCustomer[] = useSelector(
    state => state.customer.listTypeCustomer,
  );

  const listChannel: ListChannel[] = useSelector(
    state => state.customer.listChannel,
  );

  const dataMemo = useMemo(() => {
    const normalizedFilterText = filterText
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .split(' '); // Normalize,

    const filteredItems = customerType?.filter(item => {
      const normalizedName = item.name
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .split(' '); // Normalize, remove diacritics, convert to lowercase, and split into words

      // Check if every word in normalizedFilterText is included in normalizedName
      return normalizedFilterText.every((word: any) =>
        normalizedName.some(nameWord => nameWord.includes(word)),
      );
    });
    return filteredItems.length > 1 ? filteredItems : customerType;
  }, [filterText]);

  const handleItem = (text: any) => {
    setSearchValue(text);
    startEffect(() => {
      setFilterText(text);
    });
  };
  const onSubmitEnd = (
    event: NativeSyntheticEvent<TextInputSubmitEditingEventData>,
  ) => {
    setSearchValue(event.nativeEvent.text);
    startEffect(() => {
      setFilterText(event.nativeEvent.text);
    });
  };

  const handlePress = useCallback(
    (item: any) => {
      setData(prev => {
        const isItemInFrequency = prev?.frequency?.includes(item.value);
        const updatedFrequency = isItemInFrequency
          ? prev?.frequency?.filter(
            (selectedItem: any) => selectedItem !== item.value,
          )
          : [...(prev?.frequency || []), item.value];
        return {
          ...prev,
          frequency: updatedFrequency,
          routers: [{ frequency: updatedFrequency, router_code: prev.routers?.[0]?.router_code ? prev.routers?.[0]?.router_code : '', router_name: prev.routers?.[0]?.router_code ? prev.routers?.[0]?.router_code : '' }]
        };
      });
    },
    [setData],
  );

  return (
    <Modal
      isVisible={isVisible}
      onBackButtonPress={onBackButton}
      onBackdropPress={onBackButton}
      animationIn={'slideInUp'}
      animationOut={'slideOutDown'}
      backdropOpacity={0.5}
      style={styles.modalStyle}>
      {type === 'customer_type' ? (
        <Block
          height={200}
          colorTheme="bg_default"
          borderTopLeftRadius={16}
          borderTopRightRadius={16}>
          <Block style={styles.headerBottomSheet}>
            <TouchableOpacity onPress={onBackButton}>
              <AppIcons
                iconType={AppConstant.ICON_TYPE.IonIcon}
                name={'close'}
                size={24}
                color={theme.colors.text_primary}
              />
            </TouchableOpacity>

            <Text style={styles.titleHeaderText}>
              {getLabel('customerType')}
            </Text>
            <Text style={styles.titleHeaderText} />
          </Block>
          {listFilterType.map((item: any) => {
            return (
              <TouchableOpacity
                style={styles.containItemBottomView}
                key={item.id.toString()}
                onPress={() => {
                  setData(prev => ({
                    ...prev,
                    customer_type: item.title,
                  }));
                }}>
                <Text
                  style={styles.itemText(
                    getLabel(item.title),
                    data.customer_type,
                  )}>
                  {getLabel(item.title)}
                </Text>
                {getLabel(item.title) === data.customer_type && (
                  <AppIcons
                    iconType={AppConstant.ICON_TYPE.Feather}
                    name="check"
                    size={24}
                    color={theme.colors.primary}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </Block>
      ) : type === 'customer_group' ? (
        <Block
          height={400}
          colorTheme="bg_default"
          borderTopLeftRadius={16}
          borderTopRightRadius={16}>
          <Block style={styles.headerBottomSheet}>
            <TouchableOpacity onPress={onBackButton}>
              <AppIcons
                iconType={AppConstant.ICON_TYPE.IonIcon}
                name={'close'}
                size={24}
                color={theme.colors.text_primary}
              />
            </TouchableOpacity>

            <Text style={styles.titleHeaderText}>
              {getLabel('groupCustomer')}
            </Text>
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
              inputStyle={{ color: theme.colors.text_primary }}
              style={styles.searchBar}
              iconColor={theme.colors.text_disable}
              onClearIconPress={() => setSearchValue('')}
            />
          </Block>
          <FlatList
            data={customerType && customerType.length > 0 ? dataMemo : []}
            keyExtractor={item => item.name}
            showsVerticalScrollIndicator={false}
            windowSize={11}
            initialNumToRender={10}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  style={styles.containItemBottomView}
                  key={item.name}
                  onPress={() => {
                    setData(prev => ({
                      ...prev,
                      customer_group: item.customer_group_name,
                    }));
                    onBackButton();
                  }}>
                  <Text
                    style={styles.itemText(
                      item.customer_group_name,
                      data.customer_group,
                    )}>
                    {item.customer_group_name}
                  </Text>
                  {item.customer_group_name === data.customer_group && (
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
      ) : type === 'type_customer' ? (
        <Block
          height={400}
          colorTheme="bg_default"
          borderTopLeftRadius={16}
          borderTopRightRadius={16}>
          <Block style={styles.headerBottomSheet}>
            <TouchableOpacity onPress={onBackButton}>
              <AppIcons
                iconType={AppConstant.ICON_TYPE.IonIcon}
                name={'close'}
                size={24}
                color={theme.colors.text_primary}
              />
            </TouchableOpacity>

            <Text style={styles.titleHeaderText}>
              {getLabel('typeCustomer')}
            </Text>
            <Text style={styles.titleHeaderText} />
          </Block>
          {/* <Block
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
              inputStyle={{ color: theme.colors.text_primary }}
              style={styles.searchBar}
              iconColor={theme.colors.text_disable}
              onClearIconPress={() => setSearchValue('')}
            />
          </Block> */}
          <FlatList
            data={listTypeCustomer || []}
            keyExtractor={item => item.name}
            showsVerticalScrollIndicator={false}
            windowSize={11}
            initialNumToRender={10}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  style={styles.containItemBottomView}
                  key={item.name}
                  onPress={() => {
                    setData(prev => ({
                      ...prev,
                      sfa_customer_type: item.customer_type_name,
                    }));
                    onBackButton();
                  }}>
                  <Text
                    style={styles.itemText(
                      item.customer_type_name,
                      data.sfa_customer_type,
                    )}>
                    {item.customer_type_name}
                  </Text>
                  {item.customer_type_name === data.sfa_customer_type && (
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
      ) : type === 'channel' ? (
        <Block
          height={400}
          colorTheme="bg_default"
          borderTopLeftRadius={16}
          borderTopRightRadius={16}>
          <Block style={styles.headerBottomSheet}>
            <TouchableOpacity onPress={onBackButton}>
              <AppIcons
                iconType={AppConstant.ICON_TYPE.IonIcon}
                name={'close'}
                size={24}
                color={theme.colors.text_primary}
              />
            </TouchableOpacity>

            <Text style={styles.titleHeaderText}>
              {getLabel('typeCustomer')}
            </Text>
            <Text style={styles.titleHeaderText} />
          </Block>
          {/* <Block
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
              inputStyle={{ color: theme.colors.text_primary }}
              style={styles.searchBar}
              iconColor={theme.colors.text_disable}
              onClearIconPress={() => setSearchValue('')}
            />
          </Block> */}
          <FlatList
            data={listChannel || []}
            keyExtractor={item => item.name}
            showsVerticalScrollIndicator={false}
            windowSize={11}
            initialNumToRender={10}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  style={styles.containItemBottomView}
                  key={item.name}
                  onPress={() => {
                    setData(prev => ({
                      ...prev,
                      sfa_sale_channel: item.name,
                    }));
                    onBackButton();
                  }}>
                  <Text
                    style={styles.itemText(
                      item.sales_channel_name,
                      data.sfa_sale_channel,
                    )}>
                    {item.sales_channel_name}
                  </Text>
                  {item.sales_channel_name === data.sfa_sale_channel && (
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
      ) : type === 'frequency' ? (
        <Block
          colorTheme="bg_default"
          borderTopLeftRadius={16}
          borderTopRightRadius={16}>
          <Block style={styles.headerBottomSheet}>
            <TouchableOpacity
              onPress={() => {
                setData(prev => ({
                  ...prev,
                  frequency: [prev.frequency],
                }));
                onBackButton();
              }}>
              <AppIcons
                iconType={AppConstant.ICON_TYPE.IonIcon}
                name={'close'}
                size={24}
                color={theme.colors.text_primary}
              />
            </TouchableOpacity>
            <Text style={styles.titleHeaderText}>{getLabel('frequency')}</Text>
            <Text
              onPress={onBackButton}
              style={[styles.titleHeaderText, { color: theme.colors.primary }]}>
              Lưu
            </Text>
          </Block>
          {listFrequencyType.map((item: any) => {
            return (
              <TouchableOpacity
                style={styles.containItemBottomView}
                key={item.id.toString()}
                onPress={() => handlePress(item)}>
                <Text style={{ marginVertical: 8 }}>{item.title}</Text>
                {data.frequency && data.frequency.includes(item.value) && (
                  <AppIcons
                    iconType={AppConstant.ICON_TYPE.Feather}
                    name="check"
                    size={24}
                    color={theme.colors.primary}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </Block>
      ) : (
        type === 'gland' && (
          <Block
            colorTheme="bg_default"
            borderTopLeftRadius={16}
            borderTopRightRadius={16}>
            <Block style={styles.headerBottomSheet}>
              <TouchableOpacity onPress={onBackButton}>
                <AppIcons
                  iconType={AppConstant.ICON_TYPE.IonIcon}
                  name={'close'}
                  size={24}
                  color={theme.colors.text_primary}
                />
              </TouchableOpacity>

              <Text style={styles.titleHeaderText}>{getLabel('gland')}</Text>
              <Text style={styles.titleHeaderText} />
            </Block>
            {listRoute &&
              listRoute.length > 0 &&
              listRoute?.map(item => {
                return (
                  <TouchableOpacity
                    style={styles.containItemBottomView}
                    key={item.name}
                    onPress={() => {
                      console.log(item, 'item')
                      setData(prev => ({
                        ...prev,
                        routers: [{ frequency: prev?.routers?.[0]?.frequency || '', router_code: item.channel_code, router_name: item.channel_name }],
                      }));
                      onBackButton();
                    }}>
                    <Text
                      style={styles.itemText(
                        item.channel_name,
                        data.routers?.[0] ?? '',
                      )}>
                      {item.channel_name}
                    </Text>
                    {item.channel_name === data.routers?.[0] && (
                      <AppIcons
                        iconType={AppConstant.ICON_TYPE.Feather}
                        name="check"
                        size={24}
                        color={theme.colors.primary}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
          </Block>
        )
      )}
    </Modal>
  );
};

export default React.memo(ModalData, isEqual);

const modalStyles = (theme: AppTheme) =>
  StyleSheet.create({
    modalStyle: {
      // backgroundColor: theme.colors.bg_default,
      marginHorizontal: 0,
      marginVertical: 0,
      justifyContent: 'flex-end',
    } as ViewStyle,
    headerBottomSheet: {
      marginHorizontal: 16,
      marginBottom: 16,
      paddingVertical: 9,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    } as ViewStyle,
    containItemBottomView: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginHorizontal: 16,
      marginBottom: 5,
    } as ViewStyle,
    titleHeaderText: {
      fontSize: 18,
      fontWeight: '500',
      lineHeight: 24,
      color: theme.colors.text_primary,
    } as TextStyle,
    itemText: (text: string, value?: string) =>
    ({
      fontSize: 16,
      fontWeight: text === value ? '600' : '400',
      lineHeight: 21,
      marginBottom: 16,
      color: theme.colors.text_primary,
    } as TextStyle),
    searchBar: {
      backgroundColor: theme.colors.bg_default,
      borderRadius: 10,
      width: '90%',
      marginLeft: 12,
    } as ViewStyle,
  });
