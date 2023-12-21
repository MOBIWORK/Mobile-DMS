import { FlatList, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { ICustomer } from './data'
import CardView from './CardView'
import { IDataItem } from '../../../models/types'

type Props = {
    data:IDataItem[]
}

const ListCard = (props: Props) => {
  return (
    <FlatList
    data={props.data}
    decelerationRate={'fast'}
    showsVerticalScrollIndicator={false}
    keyExtractor={(item,index) => index.toString()}
    renderItem={({item,index}) =>{
        return <CardView {...item}  key={index}/>
    }}

    />
  )
}

export default React.memo(ListCard)

const styles = StyleSheet.create({})