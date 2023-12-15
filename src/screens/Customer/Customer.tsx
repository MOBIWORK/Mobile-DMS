import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

type Props = {}

const Customer = (props: Props) => {
  return (
    <View>
      <Text>Customer</Text>
    </View>
  )
}

export default React.memo(Customer)

const styles = StyleSheet.create({})