import React, {FC, ReactNode} from 'react';
import {ScrollView, View, ViewStyle} from 'react-native';

const AppContainer: FC<AppContainerProps> = ({children, style, onScroll}) => {
  return (
    <View style={{flex: 1}}>
      <ScrollView
        onScroll={onScroll ?? undefined}
        scrollEventThrottle={16}
        style={[{flex: 1}, style]}
        contentContainerStyle={{flexGrow: 1}}
        showsVerticalScrollIndicator={false}>
        <View onStartShouldSetResponder={() => true}>{children}</View>
      </ScrollView>
    </View>
  );
};

interface AppContainerProps {
  children: ReactNode;
  style?: ViewStyle;
  onScroll?: (event: any) => void;
}

export default AppContainer;
