import { StyleSheet, View, ViewStyle, FlatList } from 'react-native';
import React from 'react';
import { AppTheme, useTheme } from '../../layouts/theme';
import { SkeletonLoading } from '../../components/common';


const LoadingSkeleton = () => {

  const theme = useTheme();
  const styles = styleLoading(theme);

  const renderItem = () => {
    return (
      <View style={styles.container}>
          <View style={[styles.flexSpace,{paddingBottom :16 , borderColor :theme.colors.divider,borderBottomWidth :1}]}>
            <SkeletonLoading width={100} height={25} borderRadius={8}/>
            <SkeletonLoading width={140} height={30} borderRadius={8}/>
          </View>
          <View style={{rowGap :4}}>
            <SkeletonLoading width={300} height={15} borderRadius={8}/>
            <SkeletonLoading width={200} height={15} borderRadius={8}/>
          </View>
          <View style={[styles.flexSpace,{marginTop :20}]}>
            <SkeletonLoading width={100} height={40} borderRadius={16}/>
            <SkeletonLoading width={50} height={20} borderRadius={16}/>

          </View>
      </View>
    )
  }

  return (
    <View>
      <FlatList
        data={new Array(5)}
        showsVerticalScrollIndicator={false}
        renderItem={() => renderItem()}
        contentContainerStyle={{ rowGap: 20 }}
      />
    </View>
  );
};

export default LoadingSkeleton;

const styleLoading = (theme: AppTheme) => StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor :theme.colors.bg_default,
    borderRadius : 16
  } as ViewStyle,
  flexSpace :{
    flexDirection :"row",
    alignItems :"center",
    justifyContent :"space-between"
  }as ViewStyle
});
