import { Platform, StyleSheet, View, Text, Button } from 'react-native';
import { Stack, useNavigation } from 'expo-router';
import { useState } from 'react'


export default function test() {
  console.log('render')
  const [count, setCount] = useState(0)



  return (
    <View >
      <Text className="bg-blue-400">test</Text>
      <Text className="bg-blue-400">{count}</Text>
      <Button
        title="Inc"
        onPress={() => setCount(count + 1) }
      />
      
    </View>
  );
}