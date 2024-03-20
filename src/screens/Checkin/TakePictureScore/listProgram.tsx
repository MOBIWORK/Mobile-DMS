import {FlatList, Image, StyleSheet, ViewStyle} from 'react-native';
import React from 'react';
import isEqual from 'react-fast-compare';
import {Block, SvgIcon, AppText as Text} from '../../../components/common';
import {BottomSheetMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import {TouchableOpacity} from '@gorhom/bottom-sheet';
import {AppTheme, useTheme} from '../../../layouts/theme';
import {ImageAssets} from '../../../assets';
import {dispatch} from '../../../utils/redux';
import {checkinActions} from '../../../redux-store/checkin-reducer/reducer';
import {useSelector} from '../../../config/function';
import {shallowEqual} from 'react-redux';

type Props = {
  bottomSheetMethod: React.MutableRefObject<BottomSheetMethods | undefined>;
  data: any[];
  onPressConfirm: (listProgram: any[]) => Promise<void>;
};

const ListProgram = (props: Props) => {
  const theme = useTheme();
  const styles = rootStyles(theme);
  const [listSelect, setListSelect] = React.useState<any[]>([]);

  const handleSelectItem = (item: string, list?: any) => {
    if (listSelect.includes(item)) {
      // If the data is already selected, remove it from the selectedData array
      setListSelect(prevSelected =>
        prevSelected.filter(selectedItem => selectedItem !== item),
      );
    } else {
      // If the data is not selected, add it to the selectedData array
      setListSelect(prevSelected => [...prevSelected, item]);
    }
  };
  const selectedProgram: any[] = useSelector(
    state => state.checkin.selectedProgram,
    shallowEqual,
  );

  const listHeaderComponent = React.useMemo(() => {
    return (
      <Block style={styles.listSelectStyle}>
        {listSelect &&
          listSelect.length > 0 &&
          listSelect.map((item, index) => {
            return (
              <TouchableOpacity
                key={index}
                onPress={() =>
                  setListSelect(prev =>
                    prev.filter(selected => selected != item),
                  )
                }
                style={styles.selectedItem}>
                <Text>{item} </Text>
                <SvgIcon source="Close" size={20} colorTheme="black" />
              </TouchableOpacity>
            );
          })}
      </Block>
    );
  }, [listSelect]);

  const handleConfirmSelect = () => {
    const existingProgramNames =
      selectedProgram && selectedProgram.length > 0
        ? selectedProgram.map((program: any) => program.campaign_name)
        : [];

    // Filter out programs from props.data that are already in selectedProgram
    const newProgramsToAdd = props.data.filter(
      (item: any) =>
        listSelect.includes(item.campaign_name) &&
        !existingProgramNames.includes(item.campaign_name),
    );

    // Merge existing selected programs with new ones
    const updatedSelectedProgram = Array.isArray(selectedProgram)
      ? [...selectedProgram, ...newProgramsToAdd]
      : [...newProgramsToAdd];

    dispatch(checkinActions.setSelectedProgram(updatedSelectedProgram));
    props.onPressConfirm(listSelect);
    setListSelect([]);
  };

  return (
    <Block>
      <Block
        justifyContent="space-between"
        alignItems="center"
        direction="row"
        paddingHorizontal={8}>
        <TouchableOpacity
          onPress={() => props.bottomSheetMethod?.current?.close()}>
          <Text fontSize={16} fontWeight="500" colorTheme="bg_disable">
            Hủy
          </Text>
        </TouchableOpacity>
        <Text fontSize={18} fontWeight="500">
          Chương trinh
        </Text>
        <TouchableOpacity
          onPress={handleConfirmSelect}
          disabled={listSelect.length > 0 ? false : true}>
          <Text
            fontSize={16}
            fontWeight="500"
            colorTheme={listSelect.length > 0 ? 'action' : 'bg_disable'}>
            Xác nhận
          </Text>
        </TouchableOpacity>
      </Block>

      <FlatList
        data={props.data}
        keyExtractor={(item, index) => item?.name}
        showsVerticalScrollIndicator={false}
        bounces={false}
        initialNumToRender={5}
        ListHeaderComponent={listHeaderComponent}
        renderItem={({item, index}) => {
          return (
            <TouchableOpacity
              style={styles.campaignContain}
              onPress={() => {
                handleSelectItem(item.campaign_name, item);
              }}>
              <Text lineHeight={20}>{item.campaign_name}</Text>
              {listSelect.includes(item.campaign_name) && (
                <Image
                  source={ImageAssets.CheckIcon}
                  style={{width: 24, height: 24}}
                  tintColor={theme.colors.primary}
                />
              )}
            </TouchableOpacity>
          );
        }}
      />
    </Block>
  );
};

export default React.memo(ListProgram, isEqual);

const rootStyles = (theme: AppTheme) =>
  StyleSheet.create({
    campaignContain: {
      height: 28,
      //   backgroundColor: 'red',
      paddingHorizontal: 8,
      marginVertical: 8,
      marginTop: 8,
      justifyContent: 'space-between',
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 8,
    } as ViewStyle,
    listSelectStyle: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      rowGap: 8,
      columnGap: 16,
      flexWrap: 'wrap',
      marginTop: 24,
      marginBottom: 16,
      marginHorizontal: 16,
    } as ViewStyle,
    selectedItem: {
      padding: 8,
      backgroundColor: theme.colors.bg_disable,
      borderRadius: 20,
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
    } as ViewStyle,
    handleConfirm: (length: number) => ({} as ViewStyle),
  });
