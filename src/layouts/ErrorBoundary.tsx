import { Button, StyleSheet } from 'react-native'
import React from 'react'
import { Block, AppText as Text } from '../components/common';



const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error, resetErrorBoundary: () => void }) => (
    <Block justifyContent='center' alignItems='center'> 
      <Text>Đã có lỗi xảy ra:</Text>
      <Text>{error.message}</Text>
      <Button title="Thử lại" onPress={resetErrorBoundary} />
    </Block>
  );

export default ErrorFallback

const styles = StyleSheet.create({})