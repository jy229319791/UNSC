import { StyleSheet, Button, TextInput } from "react-native";
import React from 'react';
import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";
import { ScrollView } from "react-native-gesture-handler";

export default function TabOneScreen({ navigation }) {

  const [text1, onChangeText] = React.useState('');

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>Find</Text>
        
        <Text style={styles.Text}>Bike Parking</Text>
        <TextInput
          style={styles.input}
          onChangeText={onChangeText}
          value={text1}
        />
        <Button onPress={navigation.openDrawer} title="Search"/>
        <Text style={styles.Text}></Text>
        <View
          style={styles.separator}
          lightColor="#eee"
          darkColor="rgba(255,255,255,0.1)"
        />
        <Button onPress={navigation.openDrawer} title="Geolocate"/>
        <EditScreenInfo path="/screens/TabOneScreen.tsx" />        
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
