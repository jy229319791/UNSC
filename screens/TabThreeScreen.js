import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, ActivityIndicator } from "react-native";
import MapView, { Marker } from 'react-native-maps';
import { Icon, Button } from 'react-native-elements';
import * as Linking from 'expo-linking';


//ying modified parkingdetail page with ai assistance
export default function TabThreeScreen({ route, navigation }) {
    const { parkingId } = route.params;
    const [parkingDetails, setParkingDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // get parking details from the server
                const response = await fetch(`http://10.0.2.2:3000/getParkings?id=${parkingId}`);
                const data = await response.json();
                if (!response.ok) throw new Error(data.message || "Error fetching data");
                setParkingDetails(data);
            } catch (error) {
                console.error("Failed to fetch parking details:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [parkingId]);

    // show loading spinner while fetching data
    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }
    // show error message if there was an error fetching data
    if (error) {
        return <Text style={styles.errorText}>Error: {error}</Text>;
    }
    // show message if no details are available
    if (!parkingDetails) {
        return <Text style={styles.noDetailsText}>No details available for this parking spot.</Text>;
    }

    // handle navigation with Google Maps
    const handleNavigation = () => {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${parkingDetails[0].x},${parkingDetails[0].y}`;
        Linking.openURL(url);
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>{parkingDetails[0].title}</Text>
            <Text style={styles.text}>Description: {parkingDetails[0].description}</Text>
            <Text style={styles.text}>Rating: {parkingDetails[0].rating}</Text>
            <Text style={styles.text}>Author: {parkingDetails[0].author}</Text>
            <Text style={styles.text}>Address: {parkingDetails[0].address}</Text>
            <Text style={styles.text}>Latitude: {parkingDetails[0].x}</Text>
            <Text style={styles.text}>Longitude: {parkingDetails[0].y}</Text>

            {parkingDetails[0].tags && (
                <View style={styles.tagContainer}>
                    {parkingDetails[0].tags.map((tag, index) => (
                        <Text key={index} style={styles.tag}>{tag}</Text>
                    ))}
                </View>
            )}

            <Button
                title="Navigate with Google Maps"
                onPress={handleNavigation}
                icon={
                    <Icon
                        name="navigation"
                        type="material"
                        size={20}
                        color="white"
                        iconStyle={{ marginRight: 10 }}
                    />
                }
                buttonStyle={styles.navButton}
            />
            {/* Show map with parking location */}
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: parseFloat(parkingDetails[0].x),
                    longitude: parseFloat(parkingDetails[0].y),
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}
            >
                <Marker
                    coordinate={{
                        latitude: parseFloat(parkingDetails[0].x),
                        longitude: parseFloat(parkingDetails[0].y),
                    }}
                    title={parkingDetails[0].title}
                    description={parkingDetails[0].description}
                />
            </MapView>

            
        </ScrollView>
    );
}


// Styling
const styles = StyleSheet.create({
    container: {
        padding: 5,
        flex: 1,
        backgroundColor: '#grey',
        marginTop: 20,
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
    },
    noDetailsText: {
        color: '#666',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
    },
    title: {
        fontSize: 35,
        fontWeight: 'bold',
        color: '#3a50e0',
        marginBottom: 20,
        marginLeft: 10,

    },
    text: {
        fontSize: 16,
        marginVertical: 10,
        color: '#555',
        marginLeft: 10,
    },
    tagContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 10,
        marginLeft: 10,
    },
    tag: {
        backgroundColor: '#4285F4',
        borderRadius: 5,
        paddingVertical: 3,
        paddingHorizontal: 7,
        marginRight: 5,
        marginBottom: 5,
    },
    map: {
        width: '100%',
        height: 300,
        marginTop: 20,
    },
    navButton: {
        backgroundColor: '#3a50e0',
        marginTop: 20,
    },
});
