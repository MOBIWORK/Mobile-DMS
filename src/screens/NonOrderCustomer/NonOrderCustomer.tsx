import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import isEqual from 'react-fast-compare'

type Props = {}

const NonOrderCustomer = (props: Props) => {
  return (
    <View>
      <Text>NonOrderCustomer</Text>
    </View>
  )
}

export default React.memo(NonOrderCustomer,isEqual)

const styles = StyleSheet.create({})