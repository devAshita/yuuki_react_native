import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native'; // Viewをインポート
import axios from 'axios';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import DetailPage from './pages/DetailPage';
import ListPage from './pages/ListPage';
import TwitterPage from './pages/TwitterPage';
import LoadingScreen from './pages/LoadingScreen';



const Stack = createStackNavigator();

const App = () => {
  const [initialRouteName, setInitialRouteName] = useState('Login');
  const [isLoading, setIsLoading] = useState(true); // ロード状態を管理

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('userToken');
      setInitialRouteName(token ? 'Home' : 'Login');
    };

    setIsLoading(false);
    checkToken();
  }, []);

  const withAuthCheck = Component => props => {
    const navigation = useNavigation();
  
    useEffect(() => {
      AsyncStorage.getItem('userToken').then(token => {
        if (!token) {
          setIsLoading(false);
          navigation.navigate('Login');
        } else {
          axios.post('http://35.79.230.186/laravel-api/api/auth_check', { token })
          .then(response => {
            //一致しなかったときにLogin画面へ
            if (!response.data.auth_check) {
              setIsLoading(false);
              navigation.navigate('Login');
            }
          })
          .catch(error => {
            setIsLoading(false);
            navigation.navigate('Login');
          });
        }
      });

      setIsLoading(false);
    }, []);
  
    return <Component {...props} />;
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRouteName}>
        <Stack.Screen name="Home" component={withAuthCheck(HomePage)} options={{ title: 'Home' }} />
        <Stack.Screen name="Detail" component={withAuthCheck(DetailPage)} options={{ title: 'Detail' }} />
        <Stack.Screen name="List" component={withAuthCheck(ListPage)} options={{ title: 'List' }} />
        <Stack.Screen name="Login" component={LoginPage} options={{ title: 'Login' }} />
        <Stack.Screen name="Twitter" component={TwitterPage} options={{ title: 'Twitter' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
