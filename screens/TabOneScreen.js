import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  ScrollView,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import * as Location from "expo-location";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";

export default function TabOneScreen() {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState("");
  const [nearest, setNearest] = useState([]);
  const [xLocation, setXLocation] = useState("");
  const [yLocation, setYLocation] = useState("");
  const [geoRequested, setGeoRequested] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const navigation = useNavigation();

  //ying working on geoloate button, bikeparkings list and styling
  // request location permissions
  async function requestPermissions() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.error("Location permission not granted");
      return false;
    }
    return true;
  }

  const handleGeolocatePress = async () => {
    try {
      const hasPermission = await requestPermissions();
      if (!hasPermission) return;
      setGeoRequested(true);

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
  };

  const findNearestParking = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `http://10.0.2.2:3000/findParking?x=${encodeURIComponent(
          latitude
        )}&y=${encodeURIComponent(longitude)}`
      );
      const data = await response.json();
      setNearest(data);
    } catch (error) {
      console.error("Error fetching parking data: ", error);
      Alert.alert("Network Error", "Unable to fetch parking details.");
    }
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
          // Hammaad - add error handling for invalid address
          Alert.alert(
            "Missing Data",
            "Please enter your city and state in the address, or try geolocating"
          );
          // End Hammaad
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
            x
          )}&y=${encodeURIComponent(y)}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );
      })
      .then((response) => {
        console.log(response);
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
    <View style={styles.outerContainer}>
      <Text style={styles.headerTitle}>FIND</Text>
      <Text style={styles.headerSubtitle}>Bike Parkings</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={handleChangeText}
          value={address}
          placeholder="Enter address"
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            Search();
            setGeoRequested(false);
            setShowDetails(true);
          }}
        >
          <Icon name="search" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <Text style={styles.orText}>or</Text>

      <TouchableOpacity
        style={styles.geoButton}
        onPress={() => {
          handleGeolocatePress();
          setShowDetails(true);
        }}
      >
        <Icon name="my-location" size={20} color="#fff" />
        <Text style={styles.geoButtonText}>Geolocate</Text>
      </TouchableOpacity>

      {geoRequested && (
        <>
          {location ? (
            <>
              <Text>
                Latitude: {location.latitude} , Longitude: {location.longitude}
              </Text>
            </>
          ) : (
            <Text>No location data available</Text>
          )}
        </>
      )}
      {showDetails && (
        <ScrollView style={styles.innercontainer}>
          <Text style={styles.title}>Bike Parkings Nearby </Text>
          {nearest.length > 0 ? (
            nearest.map((parking, index) => (
              <TouchableOpacity
                key={index}
                onPress={() =>
                  navigation.navigate("TabThreeScreen", {
                    parkingId: parking._id,
                  })
                }
                style={styles.parkingItem}
              >
                <View style={styles.titleAndRating}>
                  <Text style={styles.parkingTitle}>{parking.title}</Text>
                  <View style={styles.ratingContainer}>
                    <Text style={styles.ratingText}>{parking.rating}</Text>
                  </View>
                </View>
                <Text style={styles.parkingDescription}>
                  {parking.description}
                </Text>
                <View style={styles.tagsContainer}>
                  {parking.tags.map((tag, idx) => (
                    <View key={idx} style={styles.tag}>
                      <Text style={styles.tagText}>{tag}</Text>
                    </View>
                  ))}
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noParking}>No parking locations found.</Text>
          )}
        </ScrollView>
      )}
    </View>
  );
}

//assit from ai for styling
const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  headerTitle: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#3a50e0",
  },
  headerSubtitle: {
    fontSize: 18,
    color: "#666",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    marginLeft: -10,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginRight: 10,
    paddingLeft: 10,
  },
  button: {
    backgroundColor: "#3a50e0",
    padding: 10,
    borderRadius: 20,
  },
  buttonText: {
    color: "#fff",
  },
  orText: {
    fontSize: 16,
    color: "#grey",
    marginBottom: 10,
    textAlign: "center",
  },
  geoButton: {
    flexDirection: "row",
    backgroundColor: "#3a50e0",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 20,
  },
  geoButtonText: {
    marginLeft: 10,
    color: "#fff",
    fontSize: 16,
  },
  innercontainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#3a50e0",
    borderRadius: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#FFFFFF",
  },
  parkingItem: {
    backgroundColor: "#FFFFFF",
    borderColor: "#4285F4",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  titleAndRating: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  parkingTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#000",
  },
  ratingContainer: {
    backgroundColor: "#3a50e0",
    borderRadius: 5,
    paddingVertical: 2,
    paddingHorizontal: 5,
  },
  ratingText: {
    fontSize: 14,
    color: "#fff",
  },
  parkingDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 5,
  },
  tag: {
    backgroundColor: "#4285F4",
    borderRadius: 5,
    paddingVertical: 3,
    paddingHorizontal: 7,
    marginRight: 5,
    marginBottom: 5,
  },
  tagText: {
    color: "#FFFFFF",
    fontSize: 12,
  },
  noParking: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    marginTop: 20,
  },
});
