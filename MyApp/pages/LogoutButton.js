import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { View, Text, Button, StyleSheet } from 'react-native';

const LogoutButton = () => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    axios.post('http://35.79.230.186/laravel-api/api/logout', {}, { withCredentials: true })
    .then(response => {
        // ログアウト成功時の処理（例: ユーザーをログインページにリダイレクト）
        console.log(response.data.message);
    })
    .catch(error => {
        // エラー処理
        console.error('Logout error:', error);
    });
    // AsyncStorageからトークンを削除
    await AsyncStorage.removeItem('userToken');

    // ログイン画面または任意の画面にナビゲート
    navigation.navigate('Login');
  };

  return (
    <Button title="Logout" onPress={handleLogout} />
  );
};

export default LogoutButton;
