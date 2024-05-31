
import React from 'react';
import { StyleSheet, Button, TextInput, ScrollView, useState } from "react-native";

import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View} from "../components/Themed";

let nextId = 0;

export default function TabTwoScreen({ navigation }) {

  const [text1, text2, text3, text4, text5, onChangeText] = React.useState('');
  const [name, setName] = React.useState('');
  const [tags, setTags] = React.useState([]);


  const showAlert = () =>
    Alert.alert(
      'Tag Title',
      [
        {
          text: 'Ask me later',
          onPress: () => console.log('Ask me later pressed'),
        },
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ],
      { cancelable: false }
  );

  const handleKeyPress = e => {
    if (e.key === 'Enter') {
      AsyncStorage.setItem('any_key_here', value);
      showAlert();
      setValue('');
      alert(`Tag saved: ${value}`);
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>

        <Text style={styles.title}>Create Entry</Text>
        
        <Button onPress={navigation.openDrawer} title="Location"/>

        <Button onPress={navigation.openDrawer} title="Image"/>


        <Text style={styles.text}>Address</Text>
        <TextInput
          style={styles.input}
          onChangeText={onChangeText}
          value={text1}
        />
        
        <Text style={styles.text}>Title</Text>
        <TextInput
          style={styles.input}
          onChangeText={onChangeText}
          value={text2}
        />     

        <Text style={styles.text}>Author</Text>
        <TextInput
          style={styles.input}
          onChangeText={onChangeText}
          value={text3}
        />

        <Text style={styles.text}>Rating</Text>
        <TextInput
          style={styles.input}
          keyboardType='numeric'
          onChangeText={onChangeText}
          value={text4}
        />

        <Text style={styles.text}>Description</Text>
        <TextInput
          style={styles.input}
          onChangeText={onChangeText}
          onKeyPress={e => handleKeyPress(e)}
          value={text5}
        />
        
        <Text style={styles.text}>Tags</Text>
        <TextInput
          style={styles.input}
          onChange={e => setName(e.target.value)}
          value={name}   
        />   
        

        <Button onPress={() => {
          setTags([
            ...tags,
            { id: nextId++, name: name }
          ]);
        }} title="click"/>

  

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
  }
});
