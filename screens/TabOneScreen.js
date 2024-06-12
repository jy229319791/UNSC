import { StyleSheet, Button, TextInput } from "react-native";
import {React, useState} from "react";
import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";
import { ScrollView } from "react-native-gesture-handler";

export default function TabOneScreen({ navigation }) {
  const [address, setAddress] = useState("");
  const [xLocation, setXLocation] = useState('');
  const [yLocation, setYLocation] = useState('');
  const [nearest, setNearest] = useState([]);

  const handleChangeText = (value) => {
    setAddress(value);
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

  const Geolocation = () => {};

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
        <Button onPress={Geolocation} title="Geolocate" />
        <Text style={styles.Text}></Text>
        <Text style={styles.Text}>Bike parkings near you</Text>
        <Text style={styles.Text}></Text>

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

/* const bikeParkings = [
  {
    title: "Bellevue College Bike Parking",
    rating: "3.9",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    tags: ["Clean", "Camaras nearby"],
  },
  {
    title: "My Garage Bike Parking",
    rating: "1.7",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    tags: ["High theft"],
  },
  {
    title: "Crossroads Bike Parking",
    rating: "4",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    tags: ["Clean", "Low crime"],
  },
]; */
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
