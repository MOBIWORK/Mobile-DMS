import {
  ActivityIndicator,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, { useMemo,  useState} from 'react';
import {
  Accordion,
  AppHeader,
  Block,
  AppText as Text,
} from '../../../components/common';
import {useTheme} from '../../../layouts/theme';
import {RootStackParamList, navigate, pop} from '../../../navigation';
import {useSelector} from '../../../config/function';
import {shallowEqual} from 'react-redux';
import {rootStyles} from './style';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ScreenConstant} from '../../../const';
import {RouteProp, useRoute} from '@react-navigation/native';
import isEqual from 'react-fast-compare';
import {dispatch} from '../../../utils/redux';
import {checkinActions} from '../../../redux-store/checkin-reducer/reducer';
import {
  DataSendMarkScore,
  IItemCheckIn,
} from '../../../redux-store/checkin-reducer/type';
import {ListCampaignScore, ParamsList} from './type';
import {IUser} from '../../../models/types';
import {Modal} from 'react-native-paper';
type Props = {};
interface DataResultAlbum extends DataSendMarkScore {
  title: string;
  image: [];
}

const ListAlbumScore = (props: Props) => {
  const theme = useTheme();
  const styles = rootStyles(theme);
  const itemParams: ParamsList =
    useRoute<RouteProp<RootStackParamList, 'LIST_ALBUM_SCORE'>>().params.data;
  const listProgramSelected: ListCampaignScore[] = useSelector(
    state => state.checkin?.selectedProgram,
    shallowEqual,
  );
  const listImageResponse = useSelector(
    state => state.checkin?.imageToMark,
    shallowEqual,
  );
  const itemCheckin: IItemCheckIn[] = useSelector(
    state => state.checkin?.categoriesCheckin,
    shallowEqual,
  );

  const userInfor: IUser = useSelector(
    state => state.app.userProfile,
    shallowEqual,
  );
  const [appLoading, setAppLoading] = useState<boolean>();

  const resultData: DataResultAlbum[] = listProgramSelected?.map(campaign => {
    return {
      title: campaign?.campaign_name,
      image: listImageResponse.map((item: any) => item.file_url),
      e_name: userInfor.employee,
      campaign_code: campaign.name,
      category: campaign.categories,
      customer_code: itemParams.kh_ma,
      images: JSON.stringify(
        listImageResponse.map((item: any) => item.file_url),
      ),
      images_time: parseFloat(
        listImageResponse.map((item: any) => item.date_time)[
          listImageResponse.map((item: any) => item.date_time).length - 1
        ],
      ),
      setting_score_audit: campaign.setting_score_audit,
    };
  });
  const confirmUploadImage = async () => {
    try {
      setAppLoading(true);
      const newData: any = itemCheckin.map(item =>
        item.key === 'take_picture_score'
          ? {...item, isDone: true, screenName: ScreenConstant.LIST_ALBUM_SCORE}
          : item,
      );

      dispatch(checkinActions.setDataCategoriesCheckin(newData));
      for (let index = 0; index < resultData.length; index++) {
        const element = resultData[index];
        let {title, image, ...rest} = element;
        dispatch(checkinActions.createReportMarkScore(rest));
      }
      // let data:DataSendMarkScore ={
    } catch (err) {
      console.log(`[err: ]`, err);
    } finally {
      setAppLoading(false);
    }
    //   customer_code:itemParams.kh_ten,
    //   campaign_code:li
    // }
  };
  const listHeaderComponent = useMemo(() => {
    return (
      <Block colorTheme="bg_neutral">
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
          <TouchableOpacity
            onPress={() =>
              navigate(ScreenConstant.TAKE_PICTURE_SCORE, {
                data: itemParams,
                screen: 'ListAlbum',
              })
            }>
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
      <Block block>
        <FlatList
          data={resultData}
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
      <Block color="transparent" paddingHorizontal={16}>
        <TouchableOpacity style={styles.buttonEnd} onPress={confirmUploadImage}>
          <Text fontSize={14} colorTheme="white" fontWeight="bold">
            Hoàn thành
          </Text>
        </TouchableOpacity>
      </Block>

      <Modal visible={appLoading!} style={styles.modal}>
        <Block
          borderRadius={16}
          justifyContent="center"
          alignItems="center"
          colorTheme="white"
          padding={80}>
          <ActivityIndicator size="large" color={theme.colors.action} />
          <Text>Đang tải ảnh, từ từ</Text>
        </Block>
      </Modal>
    </SafeAreaView>
  );
};

export default React.memo(ListAlbumScore, isEqual);
