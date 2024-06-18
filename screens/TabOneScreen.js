import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  ScrollView,
  TextInput,
  StyleSheet,
} from "react-native";
import * as Location from "expo-location";

export default function TabOneScreen() {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState("");
  const [nearest, setNearest] = useState([]);
  const [xLocation, setXLocation] = useState("");
  const [yLocation, setYLocation] = useState("");

  // Request location permissions
  async function requestPermissions() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    return status;
  }

  // Get the current location and find the nearest parking locations
  useEffect(() => {
    (async () => {
      let status = await requestPermissions();
      if (status === "granted") {
        try {
          let loc = await Location.getCurrentPositionAsync({});
          setLocation(loc.coords);
          findNearestParking(loc.coords.latitude, loc.coords.longitude);
        } catch (error) {
          console.error("Error getting location", error);
        }
      } else {
        console.error("Location permission not granted");
      }
    })();
  }, []);

  // Find the nearest parking locations based on the latitude and longitude
  const findNearestParking = (latitude, longitude) => {
    fetch(
      `http://10.0.2.2:3000/findParking?x=${encodeURIComponent(
        latitude
      )}&y=${encodeURIComponent(longitude)}`
    )
      .then((response) => response.json())
      .then((data) => setNearest(data))
      .catch((error) => console.error("Error fetching parking data: ", error));
  };

  // Handle the text input change
  const handleChangeText = (text) => setAddress(text);

  //Oscar
  // http request, use coordinates to find parking locations nearby
  const Search = () => {
    if (!address.trim()) {
      console.log("invalid address or empty string");
      return;
    }
    console.log("searching", address);
    fetch(
      `http://10.0.2.2:3000/getCoordinates?address=${encodeURIComponent(
        address
      )}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    )
      .then((response) => {
        console.log(response);
        // network error handling
        if (!response.ok) {
          throw new Error("Network response was not good for getParking");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        const { x, y } = data;
        setXLocation(x);
        setYLocation(y);

        // Second fetch finds nearest parking locations based on x and y locations
        return fetch(
          `http://10.0.2.2:3000/findParking?x=${encodeURIComponent(
            xLocation
          )}&y=${encodeURIComponent(yLocation)}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );
      })
      .then((response) => {
        // network error handling
        if (!response.ok) {
          throw new Error("Network response was not good for findParking");
        }
        return response.json();
      })
      .then((data) => {
        setNearest(data);
        // console.log("Parking Locations: ", JSON.stringify(data));
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
        <Button
          title="Geolocate"
          onPress={() => {
            (async () => {
              try {
                let loc = await Location.getCurrentPositionAsync({});
                if (loc) {
                  setLocation(loc.coords);
                  findNearestParking(loc.coords.latitude, loc.coords.longitude);
                } else {
                  console.error("Location object is null");
                }
              } catch (error) {
                console.error("Error getting location", error);
              }
            })();
          }}
        />
        {location ? (
          <>
            <Text>Latitude: {location.latitude}</Text>
            <Text>Longitude: {location.longitude}</Text>
          </>
        ) : (
          <Text>No location data available</Text>
        )}
        <Text style={styles.title2}>Nearest Parking Locations:</Text>

        {nearest.length > 0 ? (
          nearest.map((parking, index) => (
            <View key={index}>
              <Text style={styles.title2}>Title: {parking.title}</Text>
              <Text>Rating: {parking.rating}</Text>
              <Text>Description: {parking.description}</Text>
              <Text>Tags: {parking.tags.join(", ")}</Text>
            </View>
          ))
        ) : (
          <Text>No parking locations found.</Text>
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
});
