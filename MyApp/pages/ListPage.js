import React, { useState, useEffect } from 'react';
import { View, FlatList, Image, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingScreen from './LoadingScreen';


const ListPage = ({ navigation }) => {
  const [Data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // ロード状態を管理

  useEffect(() => {
    axios.get('http://35.79.230.186/laravel-api/api/list')
    .then(response => {
      setData(response.data);
      setIsLoading(false);
    })
    .catch(error => {
      console.error('Error fetching form data:', error);
    }); 
  }, []);

  const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    var R = 6371; // 地球の半径 (km)
    var dLat = deg2rad(lat2-lat1);  
    var dLon = deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
        var R = 6371; // 地球の半径 (km)
        var dLat = deg2rad(lat2-lat1);  
        var dLon = deg2rad(lon2-lon1); 
        var a = 
          Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
          Math.sin(dLon/2) * Math.sin(dLon/2)
          ; 
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        var d = R * c; // 距離 (km)
        return d;
      }
      
      const deg2rad = (deg) => {
        return deg * (Math.PI/180)
      }
      
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(-a)); 
    var d = R * c; // 距離 (km)
    return d;
  }
  
  const deg2rad = (deg) => {
    return deg * (Math.PI/180)
  }

  if (isLoading) {
    return <LoadingScreen />;
  }


  return (
    <View style={styles.container}>
      <FlatList
        data={Data.user_posts}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Image source={{ uri: `http://35.79.230.186/laravel-api/storage/${item.img_url}` }} style={styles.image} />
            <Text style={styles.text}>Address: {item.address}</Text>
            <Text style={styles.text}>
              Distance to Tokyo: {getDistanceFromLatLonInKm(item.latitude, item.longitude, 35.6895, 139.6917).toFixed(2)} km
            </Text>
            <Text style={styles.text}>
              Distance to Osaka: {getDistanceFromLatLonInKm(item.latitude, item.longitude, 34.6937, 135.5023).toFixed(2)} km
            </Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
  text: {
    flex: 1,
    flexWrap: 'wrap',
    alignSelf: 'center',
  },
});

export default ListPage;
