import React, {useRef} from 'react';
import {MainLayout} from '../../layouts';
import {StyleSheet, Text, TextStyle, View, ViewStyle} from 'react-native';
import {AppTheme, useTheme} from '../../layouts/theme';
import {AppConstant, DataConstant} from '../../const';
import ItemWidget from '../../components/Widget/ItemWidget';
import {useIsFocused} from '@react-navigation/native';
import {onResetSearchValueOfVisit} from '../Visit/VisitList/SearchVisit';
import isEqual from 'react-fast-compare';

const WidgetScreen = () => {
  const theme = useTheme();
  const styles = createStyleSheet(theme);
  const arrWidget = useRef<any[]>(DataConstant.DataWidget);
  const isFocus = useIsFocused();

  React.useEffect(() => {
    if (isFocus) {
      //delete search visit value in ListVisit.tsx
      onResetSearchValueOfVisit();
    }
  }, [isFocus]);

  return (
    <MainLayout style={styles.layout}>
      <Text style={styles.textHdr}>Xem thêm</Text>
      <View style={styles.containerWidget}>
        <View style={styles.containerItem}>
          {arrWidget &&
            arrWidget.current.map(item => (
              <View
                key={item.id}
                style={{
                  width: (AppConstant.WIDTH - 80) / 4,
                  marginLeft: 16,
                }}>
                <ItemWidget
                  name={item.name}
                  source={item.icon}
                  navigate={item.navigate}
                />
              </View>
            ))}
        </View>
      </View>
    </MainLayout>
  );
};

export default React.memo(WidgetScreen,isEqual);

const createStyleSheet = (theme: AppTheme) =>
  StyleSheet.create({
    layout: {
      backgroundColor: theme.colors.bg_neutral,
    } as ViewStyle,
    containerItem: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginLeft: -16,
    } as ViewStyle,
    textHdr: {
      fontSize: 24,
      lineHeight: 30,
      fontWeight: '500',
      color: theme.colors.text_primary,
      paddingVertical: 8,
    } as TextStyle,
    containerWidget: {
      marginTop: 22,
      paddingVertical: 16,
      backgroundColor: theme.colors.bg_default,
      borderRadius: 16,
    } as ViewStyle,
  });
