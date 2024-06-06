import React from 'react';
import { StyleSheet, Button, TextInput, ScrollView, Image } from "react-native";

import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View} from "../components/Themed";

export default function TabThreeScreen({ navigation }) {

    const [text1, text2, onChangeText] = React.useState('');

    return (

    <ScrollView>
      <View style={styles.container}>

        <Text style={styles.title}>Crossroad Parking</Text>
        
        <Image
          style={{ width:100, height: 300, postition:'relative', right:5, top:5,
          marginBottom: 15}}
          source= { require('../assets/images/crossroadMall.jpg')}
        />

        

      </View>

        <Text style={styles.text}>A perfect place to park your bike.</Text>

        <View style = {styles.columnView}>
            <View style = {styles.rowView}>
                <TextInput
                style={styles.reviewInput}
                onChangeText={onChangeText}
                placeholder="Leave a review"
                value={text1}
                />   
                <TextInput
                style={styles.ratingInput}
                onChangeText={onChangeText}
                keyboardType='numeric'
                placeholder="1-5"
                value={text2}
                />
                <Button onPress={() => {
            
                }} title="Send"/>               
            </View>
        </View>

        <View style = {styles.flexBox}>
            
            <View style = {styles.columnView}>
                <View style = {styles.rowView2}>
                    <Text style={styles.text}>Author Review</Text>
                    <View style = {styles.flexBox2}>       
                        <Text style={styles.text}>4</Text>
                    </View>                 
                </View>
            </View>
            
            <Text style={styles.text}>This is a good place to park your bike.</Text>
        </View>

        <View style = {styles.flexBox3}>
            <Text style={styles.text}>Address...</Text>
                <Button onPress={() => {
                    
                }} title="Get Directions"/>  
        </View>

        <EditScreenInfo path="/screens/TabThreeScreen.tsx" />
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
    reviewInput: {
      height: 50,
      width: 250,
      margin: 12,
      borderWidth: 1,
      padding: 10,
    },
    ratingInput: {
        height: 50,
        width: 50,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
    columnView: {
        flexDirection: 'column',
    },
    rowView: {
        flexDirection: 'row',
    },
    flexBox: {
        backgroundColor: 'lightblue',
        width: 400,
        borderWidth: 1,
        margin: 8,
        padding: 10,
    },
    flexBox2: {
        backgroundColor: 'green',
        padding: 10,
        justifyContent: 'space-between',

    },
    rowView2: {
        flexDirection: 'row',
        backgroundColor: 'lightblue',
    },
    flexBox3: {
        backgroundColor: 'lightgreen',
        borderWidth: 1,
        margin: 8,
        padding: 10,
    }
    
  });
  