import React, { useState } from "react";
import { StyleSheet, Button, TextInput, ScrollView } from "react-native";
import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";


let nextId = 0;

export default function TabTwoScreen({ navigation }) {
  // object might save in random order due to the ('...') by design
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
      const updatedTags = [...tags, tag.trim()]; // Add the new tag to the existing array
      setTags(updatedTags); // Update the tags state array
      setFormData({ ...formData, tags: updatedTags }); // Update the formData object with the new tags array
      setTag(""); // Clear the tag input field
    }
  };

  const handleChangeText = (key) => (value) => {
    setFormData({ ...formData, [key]: value });
  };

  // TODO: Have the form send a POST request to the "/setParking" endpoint
  const handleSubmit = () => {
    fetch('http://localhost:3000/setParking', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    .then(response => {
      if(!response.ok) {
        throw new Error('Network response not good')
      }
      return response.json();
    })
    .then(data => {
      console.log('Response from server:', data);
    })
    .catch(error => {
      console.error('There was a problem with your fetch operation:', error);
    });
    
    console.log("Form Data:", formData);
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>Create Entry</Text>
        {/** Make these buttons functional */}
        <Button onPress={navigation.openDrawer} title="Location" />

        <Button onPress={navigation.openDrawer} title="Image" />
        {/** Default values will be defined in the formData useState() */}
        <Text style={styles.text}>Address</Text>
        <TextInput
          style={styles.input}
          onChangeText={handleChangeText("address")}
          placeholder="Address bike parking"
          value={formData.address}
        />

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
        <TextInput
          maxLength={10}
          style={styles.input}
          onChangeText={setTag}
          placeholder="Add a tag"
          value={tag}
        />

        {/*This is for listing the tags below the TextInput*/}
        {tags.map((tag, index) => (
          <View key={index}>
            <Text>{tag}</Text>
          </View>
        ))}
        <Button title="add tag" onPress={addTag} />

        <Button title="Submit" onPress={handleSubmit} />

        <View
          style={styles.separator}
          lightColor="#eee"
          darkColor="rgba(255,255,255,0.1)"
        />

        <EditScreenInfo path="/screens/TabTwoScreen.tsx" />
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
  title: {
    fontSize: 40,
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
