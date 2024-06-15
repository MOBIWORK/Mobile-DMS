import {TouchableOpacity} from 'react-native';
import React, {useTransition} from 'react';
import {IItemCheckIn} from './ultil';
import {Block, SvgIcon, AppText as Text} from '../../../components/common';
import {useTheme} from '../../../layouts/theme';
import isEqual from 'react-fast-compare';
import {CheckinData} from '../../../services/appService';
import {navigate} from '../../../navigation/navigation-service';
import {ErrorBoundary} from 'react-error-boundary';
import ErrorFallBack from '../../../layouts/ErrorFallBack';

type Props = {
  item: IItemCheckIn;
  navData: CheckinData;
};

const ItemCheckIn = ({item, navData}: Props) => {
  const {colors} = useTheme();
  const [_, startTrans] = useTransition();
  return (
    <ErrorBoundary fallbackRender={ErrorFallBack}>
      <Block colorTheme="bg_default">
        <TouchableOpacity
          onPress={
            () =>
              startTrans(() => {
                navigate(item.screenName, {
                  type: item.type ? item.type : '',
                  data: navData,
                  screen: item.screenName,
                });
              })
            // console.log(item.screenName,'screen name')
          }>
          <Block
            direction="row"
            justifyContent="space-between"
            alignItems="center">
            <Block
              direction="row"
              alignItems="center"
              block
              paddingVertical={8}>
              <Block
                width={36}
                paddingRight={8}
                alignItems="center"
                justifyContent="center"
                height={36}
                paddingHorizontal={8}
                colorTheme={item.backgroundColor}
                borderRadius={8}>
                <SvgIcon source={item.icon} size={20} color={colors.border} />
              </Block>
              <Block direction="row" alignItems="center">
                <Text fontSize={14} colorTheme="text_primary">
                  {' '}
                  {item.name}
                </Text>
                {item.isRequire ? <SvgIcon source="Alert" size={16} /> : null}
              </Block>
            </Block>
            <Block direction="row" alignItems="center">
              {item.isDone ? (
                <SvgIcon source={'CheckCircle'} size={16} />
              ) : null}
              <SvgIcon source="arrowRight" size={24} />
            </Block>
          </Block>
        </TouchableOpacity>
      </Block>
    </ErrorBoundary>
  );
};

export default React.memo(ItemCheckIn, isEqual);
