import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

type Props = {}

const DetailCustomer = (props: Props) => {
  return (
    <View>
      <Text>DetailCustomer</Text>
    </View>
  )
}

export default React.memo(DetailCustomer)

const styles = StyleSheet.create({})