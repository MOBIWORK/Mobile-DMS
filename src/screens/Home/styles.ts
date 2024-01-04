import {StyleSheet, TextStyle, ViewStyle} from 'react-native';
import {AppTheme} from '../../layouts/theme';
import {AppConstant} from '../../const';
export const rootStyles = (theme: AppTheme) =>
  StyleSheet.create({
    mainLayout: {
      backgroundColor: theme.colors.bg_neutral,
      flex: 1,
      rowGap: 20,
      paddingHorizontal: 16,
    } as ViewStyle,
    flexSpace: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    } as ViewStyle,
    flex: {
      flexDirection: 'row',
      alignItems: 'center',
    } as ViewStyle,
    tilteSection: {
      fontSize: 14,
      lineHeight: 21,
      fontWeight: '500',
      color: theme.colors.text_disable,
      marginBottom: 8,
    } as TextStyle,
    shadow: {
      shadowColor: '#919EAB',

      shadowOffset: {
        width: 0,
        height: 12,
      },
      shadowOpacity: 0.3,
      shadowRadius: 24,
      elevation: 12,
    } as ViewStyle,
    widgetView: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    } as ViewStyle,
    header: {
      backgroundColor: theme.colors.bg_default,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      padding: 16,

      borderBottomWidth: 1,
      borderBottomColor: theme.colors.bg_disable,
      overflow: 'hidden',
      // marginBottom:10
      // overflow:'hidden'
    } as ViewStyle,
    containerIfU: {
      marginTop: -3,
      marginLeft: 8,
    } as ViewStyle,
    userName: {
      fontSize: 20,
      lineHeight: 30,
      fontWeight: '500',
      color: theme.colors.text_primary,
    } as TextStyle,
    containerTimekeep: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 16,
      borderRadius: 16,
      backgroundColor: theme.colors.bg_default,
      marginTop: 20,
    } as ViewStyle,
    containerCheckin: {
      marginBottom: 8,
      flex: 1,
      alignItems: 'center',
      padding: 16,
      borderRadius: 16,
      backgroundColor: theme.colors.bg_default,
    } as ViewStyle,
    checkinDesc: {
      fontSize: 14,
      lineHeight: 21,
      fontWeight: '500',
      marginTop: 12,
      color: theme.colors.text_secondary,
    } as TextStyle,
    btnTimekeep: {
      width: 48,
      height: 48,
      backgroundColor: theme.colors.success,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 12,
    } as ViewStyle,
    iconBtnTk: {
      width: 32,
      height: 32,
      tintColor: theme.colors.bg_default,
    },
    containerNtf: {
      marginBottom: 8,
      paddingVertical: 16,
      backgroundColor: theme.colors.bg_default,
      borderRadius: 16,
      minHeight: 360,
    } as ViewStyle,
    textProcess: {
      fontSize: 24,
      lineHeight: 28,
      fontWeight: '700',
      color: theme.colors.text_primary,
    } as TextStyle,
    textProcessDesc: {
      fontSize: 12,
      lineHeight: 21,
      fontWeight: '400',
      color: theme.colors.main,
    } as TextStyle,
    itemWorkSheet: {
      backgroundColor: theme.colors.bg_default,
      paddingHorizontal: 10,
      paddingVertical: 12,
      borderRadius: 16,
      marginBottom: 16,
    } as ViewStyle,
    worksheetLb: {
      fontSize: 12,
      fontWeight: '500',
      lineHeight: 18,
      color: theme.colors.text_primary,
    } as TextStyle,
    worksheetBar: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 8,
      paddingVertical: 4,
    } as ViewStyle,
    worksheetDt: {
      fontSize: 18,
      lineHeight: 27,
      fontWeight: '500',
      marginLeft: 8,
    } as TextStyle,
    map: {
      width: '100%',
      height: 360,
      borderRadius:20,
      // backgroundColor:theme.colors.bg_default,
      // borderWidth:1
      // backgroundColor:'red',
      alignContent:'center',
      alignItems:'center'
      // marginHorizontal:16

      // ...StyleSheet.absoluteFill
    } as ViewStyle,
    editView: {
      backgroundColor: theme.colors.bg_default,
      borderRadius: 16,
    } as ViewStyle,
    containWidgetView: {
      marginLeft: -16,
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingTop: 8,
    } as ViewStyle,
    containItemWidget: {
      marginBottom: 16,
      marginLeft: 16,
      width: (AppConstant.WIDTH - 80) / 4,
    } as ViewStyle,
    containProgressView: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    } as ViewStyle,
  });
