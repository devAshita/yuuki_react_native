import React, { useState, useEffect } from 'react';
import { View, Button, Image, Alert, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import LoadingScreen from './LoadingScreen';

export default function ImageUploader() {
    const [imageUri, setImageUri] = useState(null);
    const [upImageUri, setUpImageUri] = useState(null);
    const [isLoading, setIsLoading] = useState(false); // ロード状態を管理
    const [location, setLocation] = useState(); // ロード状態を管理
    const [address, setAddress] = useState('現在地の住所がここに表示されます');

    const pickImage = async () => {
        setIsLoading(true);
        const imagePermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (imagePermission.status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
          return;
        }
      
        // 位置情報のパーミッション
        const locationPermission = await Location.requestForegroundPermissionsAsync();
        if (locationPermission.status !== 'granted') {
          alert('Sorry, we need location permissions to make this work!');
          return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
    
        console.log(result); // ここで全体のresultをログ出力
    
        if (!result.cancelled && result.assets) {
            const location = await Location.getCurrentPositionAsync({});
            console.log(result.assets[0].uri); // 正しいuriをログ出力
            let reverseGeocode = await Location.reverseGeocodeAsync({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });
        
            let GetAddress = '取得できませんでした';
            if (reverseGeocode.length > 0) {
                GetAddress = `${reverseGeocode[0].country}${reverseGeocode[0].region}${reverseGeocode[0].city}${reverseGeocode[0].street}`;
                await setAddress(`${reverseGeocode[0].country}${reverseGeocode[0].region}${reverseGeocode[0].city}${reverseGeocode[0].street}`);
            }

            setUpImageUri(result.assets[0].uri); // 正しいuriを状態に設定
            uploadImage(result.assets[0].uri, location, GetAddress);
        }
        setIsLoading(false);
    };

    const uploadImage = async (uri, location, GetAddress) => {
        const formData = new FormData();
        
        // React Native の fetch ではなく、直接 uri を使用
        formData.append('image', { uri: uri, name: 'upload.jpg', type: 'image/jpeg'});
        formData.append('latitude', location.coords.latitude);
        formData.append('longitude', location.coords.longitude);
        formData.append('address', GetAddress);
    
        try {
            const response = await fetch('http://35.79.230.186/laravel-api/api/upload', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json',
                    // Content-Type を指定しないことで、適切な boundary とともに multipart/form-data が自動的に設定される
                },
            });
    
            const responseBody = await response.json();
            if (response.ok) {
                console.log(responseBody.path);
                setImageUri(responseBody.path);
                Alert.alert('Upload Successful', 'Your image has been uploaded successfully.');
            } else {
                Alert.alert('Upload Failed', 'There was an error uploading your image.');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Upload Failed', 'There was an error uploading your image.');
        }
        setIsLoading(false);
    };
    
    if (isLoading) {
        return <LoadingScreen />;
    }
    

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Button title="Pick an image from camera roll" onPress={pickImage} />
            {imageUri && <Image source={{ uri: `http://35.79.230.186/laravel-api/storage/${imageUri}` }} style={{ width: 200, height: 200 }} />}
            {upImageUri && <Image source={{ uri: upImageUri }} style={{ width: 200, height: 200 }} />}
            {location && ( <Text>Latitude: {location.coords.latitude}, Longitude: {location.coords.longitude}</Text> )}
            {address != '' && ( <Text>Address: {address}</Text> )}
        </View>
    );
}
