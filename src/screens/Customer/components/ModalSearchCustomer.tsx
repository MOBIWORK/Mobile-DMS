import { StyleSheet, Text, TextStyle, View } from 'react-native'
import React from 'react'
import { AppTheme, useTheme } from '../../../layouts/theme'
import Modal from 'react-native-modal'
import { ViewStyle } from 'react-native'
type Props = {
    showModal:boolean,
    onBackButtonPress:() => void

}

const ModalSearchCustomer = (props: Props) => {
    const theme = useTheme()
    const styles =rootStyles(theme)
    const {showModal,onBackButtonPress} = props

  return (
    <Modal
    isVisible={showModal}
    animationIn='slideInUp'
    animationOut={'slideOutDown'}
    backdropOpacity={0.5}
    onBackButtonPress={onBackButtonPress}
    onBackdropPress={onBackButtonPress}
    >
      <Text>ModalSearchCustomer</Text>
    </Modal>
  )
}

export default ModalSearchCustomer

const rootStyles =(theme:AppTheme)  =>StyleSheet.create({
    headerBottomSheet: {
        marginHorizontal: 16,
        marginBottom: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        // marginVertical:16,
        paddingVertical: 8,
        height: 43,
        // backgroundColor:'red'
      } as ViewStyle,
      titleHeaderText: {
        fontSize: 18,
        fontWeight: '500',
        lineHeight: 24,
        color: theme.colors.text_primary,
      } as TextStyle,
      itemText: (text: string, value: string) =>
        ({
          fontSize: 16,
          fontWeight: text === value ? '600' : '400',
          lineHeight: 21,
          marginBottom: 16,
          color: theme.colors.text_primary,
        } as TextStyle),
      containItemBottomView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 16,
        marginBottom: 5,
      } as ViewStyle,
      modalStyle: {
        // backgroundColor: theme.colors.bg_default,
        marginHorizontal: 0,
        marginVertical: 0,
        justifyContent: 'flex-end',
        // borderTopLeftRadius:26,
        // borderTopRightRadius:26
        // marginTop:200
      } as ViewStyle,
      containClose: {
        width: 26,
        height: 26,
        justifyContent: 'center',
        alignContent: 'center',
        // paddingVertical:8
        // backgroundColor:'red'
      } as ViewStyle,
      searchBar: {
        backgroundColor: theme.colors.bg_default,
        borderRadius: 10,
        width: '90%',
        marginLeft: 12,
      } as ViewStyle,
})