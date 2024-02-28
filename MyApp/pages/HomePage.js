import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import axios from 'axios';
import LogoutButton from './LogoutButton';

function HomePage({ navigation }) {
  const [data, setData] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://35.79.230.186/laravel-api/api/data');
        setData(response.data.message);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Home Screen</Text>
      <Text>{data}</Text>
      <Button title="Go to Details" onPress={() => navigation.navigate('Detail')} />
      <Button title="Go to List" onPress={() => navigation.navigate('List')} />
      <LogoutButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 22,
    marginBottom: 20,
  },
});

export default HomePage;
