import React, { useState } from 'react';
import { StyleSheet, Button, TextInput, ScrollView, Text, View, Dimensions } from "react-native";
//import MapView, { Marker } from 'react-native-maps';
import axios from 'axios';

// Get the window dimensions
const { width, height } = Dimensions.get('window'); 


export default function TabOneScreen({ navigation }) {
  const [address, setAddress] = useState("");
  const [xLocation, setXLocation] = useState('');
  const [yLocation, setYLocation] = useState('');
  const [nearest, setNearest] = useState([]);

  const [nearbyParkings, setNearbyParkings] = useState([]);
  const [region, setRegion] = useState({
    latitude: 47.5851,  // Default location: Bellevue College
    longitude: -122.1481,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [showMap, setShowMap] = useState(false);  // Hide map by default

  const handleChangeText = (value) => {
    setAddress(value);
  };


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
    if(!address.trim()){
      console.log("invalid address or empty string");
      return;
    }
    fetch(`http://10.0.2.2:3000/getParkings?address=${encodeURIComponent(address)}` , {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        // network error handling
        if(!response.ok) {
          throw new Error("Network response was not good for getParking");
        }
          return response.json();
      })
      .then((data) => {
        const {xLocation, yLocation} = data[0];
        setXLocation(xLocation);
        setYLocation(yLocation);
        
        // Second fetch finds nearest parking locations based on x and y locations
        return fetch(`http://10.0.2.2:3000/findParking?x=${encodeURIComponent(xLocation)}&y=${encodeURIComponent(yLocation)}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      })
      .then((response) => {
        // network error handling
        if(!response.ok) {
          throw new Error("Network response was not good for findParking");
        }
          return response.json();
      })
      .then((data) => {
        setNearest(data)
        console.log("Parking Locations: ", JSON.stringify(data))
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title1}>Find</Text>

        <Text style={styles.Text}>Bike Parking</Text>
        <TextInput
          style={styles.input}
          onChangeText={handleChangeText}
          value={address}
        />
        <Button onPress={Search} title="Search" />
        <Text style={styles.Text}></Text>
        <View
          style={styles.separator}
          lightColor="#eee"
          darkColor="rgba(255,255,255,0.1)"
        />
        {/* <Button title="Geolocate" onPress={handleGeolocate} />
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
        )} */}

        {nearest.map((parking, index) => (
          <View key={index}>
            <Text style={styles.title2}>Title: {parking.title}</Text>
            <Text>Rating: {parking.rating}</Text>
            <Text>Description: {parking.description}</Text>
            <Text>Tags: {parking.tags.join(", ")}</Text>
          </View>
        ))}
        
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
