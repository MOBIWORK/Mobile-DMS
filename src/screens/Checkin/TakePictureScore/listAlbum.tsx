import {
  FlatList,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  Image,
  ImageStyle,
  ViewStyle,
} from 'react-native';
import React from 'react';
import {Block, AppText as Text, SvgIcon} from '../../../components/common';
import {AppTheme} from '../../../layouts/theme';
import {AppConstant} from '../../../const';
import isEqual from 'react-fast-compare';

type Props = {
  albumImage: any[];
  selectedImages: any[];
  handleCameraPicture: () => void;
  handleSelectImage: (item: string) => void;
  theme: AppTheme;
  onPressAdding: () => void;
  listImageResponse: any[];
};

const listAlbum = (props: Props) => {
  // console.log(props.albumImage,'bb')

  const styles = rootStyles(props.theme);
  return (
    <Block block>
      <Block
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        marginBottom={8}
        marginTop={8}
        paddingHorizontal={8}>
        <Text fontSize={14} fontWeight="500" colorTheme="black">
          Hình ảnh
        </Text>
        {props.selectedImages.length > 0 ? (
          <TouchableOpacity onPress={() => props.onPressAdding()}>
            <Text fontSize={14} fontWeight="500" colorTheme="action">
              <Text fontSize={20} fontWeight="400">
                +
              </Text>{' '}
              Chương trình
            </Text>
          </TouchableOpacity>
        ) : (
          <Block />
        )}
      </Block>

      <FlatList
        numColumns={3}
        data={props.albumImage}
        keyExtractor={(item, index) => index.toString()}
        decelerationRate={'fast'}
        renderItem={({item, index}) => {
          // console.log(props.listImageResponse[0][index-1],item,'match')
          return (
            <Block padding={5} alignItems="center">
              {index === 0 ? (
                <Block marginRight={4}>
                  <Pressable
                    style={styles.cameraImg}
                    onPress={() => props.handleCameraPicture()}>
                    <SvgIcon source={'IconCamera'} size={24} />
                  </Pressable>
                </Block>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    props.handleSelectImage(item);
                    // console.log(item,props.listImageResponse[index+1],'select')
                  }}>
                  {props.selectedImages.includes(item)&& (
                    <Block
                      position="absolute"
                      zIndex={1000}
                      justifyContent="center"
                      alignItems="center"
                      width={'100%'}
                      height={'100%'}>
                      <Block
                        width={'100%'}
                        height={'100%'}
                        position="absolute"
                        zIndex={1000}
                        colorTheme="white"
                        opacity={0.4}
                        borderRadius={12}
                      />
                      <Block
                        opacity={1}
                        zIndex={9999999}
                        width={32}
                        height={32}
                        borderRadius={40}
                        colorTheme="action"
                        middle
                        alignItems="center"
                        justifyContent="center">
                        <Text
                          fontSize={16}
                          fontWeight="bold"
                          textAlign="center"
                          colorTheme="white">
                          {props.selectedImages.indexOf(item) + 1}
                        </Text>
                      </Block>
                    </Block>
                  )}
                  {props.listImageResponse.includes(item)&& (
                    <Block
                      position="absolute"
                      zIndex={1000}
                      justifyContent="center"
                      alignItems="center"
                      bottom={2}
                      left={2}>
                      <SvgIcon source="checkCircle" size={30}  color={'transparent'}/>
                    </Block>
                  )}
                  <Image
                    source={{uri: item}}
                    style={styles.cameraImg as ImageStyle}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              )}
            </Block>
          );
        }}
      />
    </Block>
  );
};

export default React.memo(listAlbum, isEqual);

const rootStyles = (theme: AppTheme) =>
  StyleSheet.create({
    cameraImg: {
      width: AppConstant.WIDTH * 0.28,
      height: AppConstant.WIDTH * 0.28,
      borderRadius: 12,
      backgroundColor: theme.colors.bg_neutral,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    } as ViewStyle,
  });
