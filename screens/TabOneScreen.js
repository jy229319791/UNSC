import React, { useState } from 'react';
import { StyleSheet, Button, TextInput, ScrollView, Text, View, Dimensions } from "react-native";
import MapView, { Marker } from 'react-native-maps';
import axios from 'axios';

// Get the window dimensions
const { width, height } = Dimensions.get('window'); 



export default function TabOneScreen({ navigation }) {
  const [text1, onChangeText] = useState('');
  const [nearbyParkings, setNearbyParkings] = useState([]);
  const [region, setRegion] = useState({
    latitude: 47.5851,  // Default location: Bellevue College
    longitude: -122.1481,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [showMap, setShowMap] = useState(false);  // Hide map by default

  const handleGeolocate = async () => {
    try {
      const { data } = await axios.post('https://www.googleapis.com/geolocation/v1/geolocate?key=api-keyonDiscord');
      const { lat, lng } = data.location;

      const parkingResponse = await axios.get(`http://10.0.2.2:3000/findParking?x=${lat}&y=${lng}`);
      setNearbyParkings(parkingResponse.data);

      setRegion({
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005
      });
      setShowMap(true);  // Show map on success
    } catch (error) {
      console.error('Error fetching geolocation or parking data:', error);
      setShowMap(false);  // Hide map on error
    }
  };
  const Search = () => {
    fetch('http://localhost:3000/getParking', {
      method: 'Get'
    });
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title1}>Find</Text>

        <Text style={styles.Text}>Bike Parking</Text>
        <TextInput
          style={styles.input}
          onChangeText={onChangeText}
          value={text1}
        />
        <Button onPress={Search} title="Search" />
        <Text style={styles.Text}></Text>
        <View
          style={styles.separator}
          lightColor="#eee"
          darkColor="rgba(255,255,255,0.1)"
        />
        <Button title="Geolocate" onPress={handleGeolocate} />
        {showMap && (
          <MapView style={styles.map} region={region}>
            {nearbyParkings.map((parking, index) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: parseFloat(parking.xLocation),
                  longitude: parseFloat(parking.yLocation)
                }}
                title={parking.title}
                rating= {parking.rating}
                description={`Distance: ${parking.distance} miles`}
              />
            ))}
          </MapView>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title1: {
    fontSize: 40,
    fontWeight: "bold",
  },
  title2: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  input: {
    height: 50,
    width: 300,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  map: {
    width: width,
    height: 400,
    marginTop: 20,
  },
});
