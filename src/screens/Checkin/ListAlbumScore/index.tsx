import {
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useMemo} from 'react';
import {
  Accordion,
  AppHeader,
  Block,
  AppText as Text,
} from '../../../components/common';
import {useTheme} from '../../../layouts/theme';
import { RootStackParamList, navigate, pop} from '../../../navigation';
import {useSelector} from '../../../config/function';
import {shallowEqual} from 'react-redux';
import {rootStyles} from './style';
import {SafeAreaView} from 'react-native-safe-area-context';
import { ScreenConstant } from '../../../const';
import { RouteProp, useRoute } from '@react-navigation/native';
type Props = {};

const ListAlbumScore = (props: Props) => {
  const theme = useTheme();
  const styles = rootStyles(theme);
  const itemParams =
  useRoute<RouteProp<RootStackParamList, 'LIST_ALBUM_SCORE'>>().params.data;
  const listProgramSelected = useSelector(
    state => state.checkin.selectedProgram,
    shallowEqual,
  );
  const listImageResponse = useSelector(
    state => state.checkin.imageToMark,
    shallowEqual,
  );
  // const listProgram = useSelector(state => state.checkin.listProgramCampaign)
  const newArray = React.useMemo(() => {
    const result = listProgramSelected?.map((campaign: any) => {
      return {
        title: campaign.campaign_name,
        image: listImageResponse,
      };
    });

    return result.filter((item: any) => item.image.length > 0);
  }, []);

  const listHeaderComponent = useMemo(() => {
    return (
      <Block colorTheme='bg_neutral'>
        <AppHeader
          style={styles.header}
          label="Chấm điểm trưng bày"
          onBack={() => pop(2)}
        />
        <Block
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          paddingHorizontal={16}
          marginTop={16}>
          <Text fontSize={14} colorTheme="text_secondary" fontWeight="600">
            Số chương trình: {listProgramSelected?.length}
          </Text>
          <TouchableOpacity onPress={() => navigate(ScreenConstant.TAKE_PICTURE_SCORE,{data:itemParams,screen:'ListAlbum'})}>
            <Text fontSize={14} fontWeight="600" colorTheme="action">
              <Text fontSize={20}>+</Text> Thêm ảnh chụp
            </Text>
          </TouchableOpacity>
        </Block>
      </Block>
    );
  }, []);
  return (
    <SafeAreaView style={styles.root} edges={['bottom', 'top']}>
      <Block block >
        <FlatList
          data={newArray}
          keyExtractor={(item, index) => index.toString()}
          bounces={false}
          showsVerticalScrollIndicator={false}
          decelerationRate={'normal'}
          ListHeaderComponent={listHeaderComponent}
          stickyHeaderIndices={[0]}
          renderItem={({item}) => {
            return (
              <Accordion type="regular" title={item.title}>
                <FlatList
                  numColumns={3}
                  data={item.image}
                  keyExtractor={(item, index) => index.toString()}
                  decelerationRate={'fast'}
                  renderItem={({item, index}) => {
                    return (
                      <Block padding={5} alignItems="center">
                        <Image style={styles.cameraImg} source={{uri: item}} />
                      </Block>
                    );
                  }}
                />
              </Accordion>
            );
          }}
        />
      </Block>
      <Block  color='transparent' paddingHorizontal={16}>
        <TouchableOpacity
          style={styles.buttonEnd}>
          <Text fontSize={14} colorTheme='white' fontWeight='bold'>Hoàn thành</Text>
        </TouchableOpacity>
      </Block>
    </SafeAreaView>
  );
};

export default ListAlbumScore;
