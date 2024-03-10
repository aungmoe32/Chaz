import { Platform, StyleSheet, View, Text, Button } from 'react-native';
import { Stack, router } from 'expo-router';
import Loading from '../components/Loading';

export default function test() {


      
  return (
    <View className="flex-1  justify-center  items-center">

      <Loading size={130}></Loading>
      {/* <Text>Loading...</Text> */}
    </View>
  );
}