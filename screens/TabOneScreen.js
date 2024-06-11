import { StyleSheet, Button, TextInput } from "react-native";
import React from 'react';
import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";
import { ScrollView } from "react-native-gesture-handler";

export default function TabOneScreen({ navigation }) {

  const [text1, onChangeText] = React.useState('');
  const bikeParkings = [{
    title: "Bellevue College Bike Parking",
    rating: "3.9",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    tags: ["Clean","Camaras nearby"]
  },
  {
    title: "My Garage Bike Parking",
    rating: "1.7",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    tags: ["High theft"]
  },
  {
    title: "Crossroads Bike Parking",
    rating: "4",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    tags: ["Clean","Low crime"]
  },
  ];
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
        <Button onPress={Geolocation} title="Geolocate" />
        <Text style={styles.Text}></Text>
        <Text style={styles.Text}>Bike parkings near you</Text>
        <Text style={styles.Text}></Text>
        {bikeParkings.map((parking, index) => (
          <View key={index}>
            <Text style={styles.title2}>Title: {parking.title}</Text>
            <Text>Rating: {parking.rating}</Text>
            <Text>Description: {parking.description}</Text>
            <Text>Tags: {parking.tags.join(', ')}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const Search = () => {
  fetch('http://localhost:3000/getParking', {
    method: 'Get'
  });
};
const Geolocation = () => {

};

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
  }
});
