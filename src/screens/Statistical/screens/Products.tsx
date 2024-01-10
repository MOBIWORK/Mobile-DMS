import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import isEqual from 'react-fast-compare'

type Props = {}

const Products = (props: Props) => {
  return (
    <View>
      <Text>Products</Text>
    </View>
  )
}

export default React.memo(Products,isEqual)

const styles = StyleSheet.create({})