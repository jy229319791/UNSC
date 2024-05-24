
import React from 'react';
import { StyleSheet, Button, TextInput } from "react-native";

import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View} from "../components/Themed";

export default function TabTwoScreen({ navigation }) {

  const [text, onChangeText] = React.useState('');
  
  return (
    <View style={styles.container}>

      
      <Text style={styles.title}>Create Entry</Text>
      
      <Button onPress={navigation.openDrawer} title="Location"/>

      <Button onPress={navigation.openDrawer} title="Image"/>

      <TextInput
        style={styles.input}
        onChangeText={onChangeText}
        value={text}
      />

      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      
      <EditScreenInfo path="/screens/TabTwoScreen.tsx" />
    </View>
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
