import {} from 'react-native';
import React from 'react';
import isEqual from 'react-fast-compare';
import {useTheme} from '../../layouts/theme';
import {rootStyles} from './styles';
import {Block, AppText as Text} from '../../components/common';
import {RouteProp, useRoute} from '@react-navigation/native';
import {AuthorizeParamsList} from '../../navigation/screen-type';
import {DMSConfigMobile} from '../../services/appService';
import {useSelector} from '../../config/function';
import {shallowEqual} from 'react-redux';

type Props = {};

const BeforeCheckin = (props: Props) => {
  const theme = useTheme();
  const styles = rootStyles(theme);
  const params =
    useRoute<RouteProp<AuthorizeParamsList, 'BEFORE_CHECKIN'>>().params;
  const systemConfig: DMSConfigMobile = useSelector(
    state => state.app.systemConfig,
    shallowEqual,
  );
  


  return (
    <Block>
      <Text>BeforeCheckin</Text>
    </Block>
  );
};

export default React.memo(BeforeCheckin, isEqual);
