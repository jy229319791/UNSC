/*AIzaSyAFcBA5PGa8mPKp9WZqs23rtDYsN4F4Uwo*/
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
      const { data } = await axios.post('https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyAFcBA5PGa8mPKp9WZqs23rtDYsN4F4Uwo');
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
        <Button title="Search" onPress={() => console.log('Searching for:', text1)} />
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
    padding: 20,
  },
  title1: {
    fontSize: 40,
    fontWeight: "bold",
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: '100%',
  },
  map: {
    width: width,
    height: 400,
    marginTop: 20,
  },
});
