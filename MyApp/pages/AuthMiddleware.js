import React, { useEffect, useState, useContext } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const AuthMiddleware = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const checkToken = async () => {
      let token;
      try {
        token = await AsyncStorage.getItem('userToken');
      } catch (e) {
        console.error(e);
      }
      if (token) {
        // Tokenが存在する場合（ログイン済み）
        navigation.navigate('Home');
      } else {
        // Tokenが存在しない場合（未ログイン）
        navigation.navigate('Login');
      }
      setIsLoading(false);
    };

    checkToken();
  }, [navigation]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return null; // 認証チェック後、子コンポーネントは直接レンダリングしない
};

export default AuthMiddleware;
