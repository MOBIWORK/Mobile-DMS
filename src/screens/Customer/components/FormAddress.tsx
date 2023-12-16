import {StyleSheet, View} from 'react-native';
import React from 'react';
import {AppHeader, AppIcons, AppText} from '../../../components/common';
import {AppConstant} from '../../../const';
import {BottomSheetMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import {useTheme} from '../../../layouts/theme';

type Props = {
  ref: React.RefObject<BottomSheetMethods>;
};

const FormAddress = (props: Props) => {
  const {ref} = props;
  const theme = useTheme();

  return (
    <View>
      <AppHeader
        label="Địa chỉ chính"
        onBack={() => ref.current?.close}
        backButtonIcon={
          <AppIcons
            iconType={AppConstant.ICON_TYPE.EntypoIcon}
            name="close"
            size={24}
            color={theme.colors.border}
          />
        }
      />
            

    </View>
  );
};

export default FormAddress;

const styles = StyleSheet.create({});
