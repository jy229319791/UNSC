import React, { useState } from "react";
import {
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
// import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";
import * as Location from "expo-location";

// Import styles
import {
  scrollContainer,
  container,
  title,
  text,
  input,
  inlineContainer,
  iconButton,
  submitButton,
  submitButtonText,
  separator,
  tagContainer,
  tagText,
} from "../constants/Elements";

export default function TabTwoScreen({ navigation }) {
  const [formData, setFormData] = useState({
    address: "",
    title: "",
    author: "",
    rating: "",
    description: "",
    tags: [""],
  });

  const [tag, setTag] = useState("");
  const [tags, setTags] = useState([]);

  const addTag = () => {
    if (tag.trim() !== "") {
      const updatedTags = [...tags, tag.trim()];
      setTags(updatedTags);
      setFormData({ ...formData, tags: updatedTags });
      setTag("");
    }
  };

  const handleChangeText = (key) => (value) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleSubmit = () => {
    fetch("http://10.0.2.2:3000/setParking", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response not good");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Response from server:", data);
      })
      .catch((error) => {
        console.error("There was a problem with your fetch operation:", error);
      });
  };

  async function requestPermissions() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    return status;
  }

  const geoLocate = async () => {
    let status = await requestPermissions();
    if (status === "granted") {
      try {
        let loc = await Location.getCurrentPositionAsync({});
        setFormData({
          ...formData,
          x: loc.coords.latitude,
          y: loc.coords.longitude,
        });
      } catch (error) {
        console.error("Error getting location", error);
      }
    } else {
      console.error("Location permission not granted");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.inlineContainer}>
          <TextInput
            style={styles.input}
            onChangeText={handleChangeText("address")}
            placeholder="Address bike parking"
            value={formData.address}
          />
          <TouchableOpacity style={styles.iconButton} onPress={geoLocate}>
            <Ionicons name="location-sharp" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {formData.x && formData.y && (
          <>
            <Text style={styles.text}>Latitude: {formData.x}</Text>
            <Text style={styles.text}>Longitude: {formData.y}</Text>
          </>
        )}

        <Text style={styles.text}>Title</Text>
        <TextInput
          maxLength={30}
          style={styles.input}
          onChangeText={handleChangeText("title")}
          placeholder="Title name"
          value={formData.title}
        />

        <Text style={styles.text}>Author</Text>
        <TextInput
          maxLength={20}
          style={styles.input}
          onChangeText={handleChangeText("author")}
          placeholder="Your name"
          value={formData.author}
        />

        <Text style={styles.text}>Rating</Text>
        <TextInput
          maxLength={1}
          style={styles.input}
          keyboardType="numeric"
          onChangeText={handleChangeText("rating")}
          placeholder="1-5"
          value={formData.rating}
        />

        <Text style={styles.text}>Description</Text>
        <TextInput
          maxLength={50}
          multiline={true}
          style={styles.input}
          onChangeText={handleChangeText("description")}
          placeholder="Biking park description"
          value={formData.description}
        />
        <Text style={styles.text}>Tags</Text>

        <View style={styles.inlineContainer}>
          <TextInput
            maxLength={10}
            style={styles.input}
            onChangeText={setTag}
            placeholder="Add a tag"
            value={tag}
          />
          <TouchableOpacity style={styles.iconButton} onPress={addTag}>
            <Ionicons name="add-circle" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {tags.map((tag, index) => (
          <View key={index} style={styles.tagContainer}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>

        <View
          style={styles.separator}
          lightColor="#eee"
          darkColor="rgba(255,255,255,0.1)"
        />

        {/* <EditScreenInfo path="/screens/TabTwoScreen.tsx" /> */}
      </View>
    </ScrollView>
  );
}

// Hammaad
// Using imported styles from constants/Elements.js
const styles = StyleSheet.create({
  scrollContainer,
  container,
  title,
  text,
  input,
  inlineContainer,
  iconButton,
  submitButton,
  submitButtonText,
  separator,
  tagContainer,
  tagText,
});
