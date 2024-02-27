import React, { useState, useEffect } from "react";
import { View, StyleSheet, Touchable, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import MapView, { Marker } from 'react-native-maps';
import { useCart } from './cartContext';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from './authContext';

const Map = ({ route }) => {
    const [mapLayout, setMapLayout] = useState(false);
    const [cuahang, setCuaHang] = useState([]);
    const navigation = useNavigation();
    const [searchNearby, setSearchNearby] = useState(false);
    const { nearbyStores, setNearbyStores } = useCart();
    const { isAuthenticated, userData } = useAuth();

    function haversine(lat1, lon1, lat2, lon2) {
        const R = 6371;
        function toRad(degrees) {
            return (degrees * Math.PI) / 180;
        }
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        return distance;
    }
    const haversineDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371;

        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);

        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        const distance = R * c;

        return distance;
    };
   
    const handleStore = (categoryId) => {
        navigation.navigate('Store', { categoryId });
    };

    const getCuaHangAPI = () => {
        fetch("http://10.0.2.2:8000/taikhoans/loai-tai-khoan-2/")
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                setCuaHang(data);
            })
            .catch((err) => {
                console.error('There was a problem with the fetch operation:', err);
            });
    };
    const [mapRegion, setMapRegion] = useState({
        latitude: userData[0].vi_do,
        longitude: userData[0].kinh_do,
        latitudeDelta: 0.42,
        longitudeDelta: 0.42,
    });

    const handleMapLayout = () => {
        setMapLayout(true);
    };
    const lat = parseFloat(userData[0].vi_do)
    const long = parseFloat(userData[0].kinh_do)
    useEffect(() => {
        getCuaHangAPI();
        if (mapLayout ) {
            const nearbyStoresWithDistance = cuahang.map((store) => {
                const storeLat = parseFloat(store.vi_do);
                const storeLong = parseFloat(store.kinh_do);
                const distance = haversine(lat, long, storeLat, storeLong).toFixed(1);

                return {
                    ...store,
                    distance: parseFloat(distance)                
                };
            }).filter((store) => store.distance <= 10);
            setNearbyStores(nearbyStoresWithDistance);
        }
    }, [mapLayout, cuahang, lat, long]);



    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={mapRegion}
                onLayout={handleMapLayout}
            >
                <Marker
                    coordinate={{
                        latitude: lat,
                        longitude: long
                    }}
                    title="Vị Trí Của Bạn"
                    pinColor="green"
                />
                {cuahang.map((cuaHangItem) => {
                    const latitude = parseFloat(cuaHangItem.kinh_do);
                    const longitude = parseFloat(cuaHangItem.vi_do);

                    return (
                        <Marker
                            key={cuaHangItem.id}
                            coordinate={{
                                latitude,
                                longitude,
                            }}
                            title={cuaHangItem.username}
                            description={cuaHangItem.dia_chi}
                        />
                    );
                })}
            </MapView>

            <TouchableOpacity >
                <Text style={styles.textTitile}>Những cửa hàng gần nhất</Text>
            </TouchableOpacity>
            <View style={styles.line}></View>
            <ScrollView contentContainerStyle={styles.monAnList}>
                {nearbyStores.map(category => (
                    <View style={styles.monAnItem} key={category.id}>

                        <Image
                            style={styles.monAnImg}
                            source={{ uri: category.avatar }}
                        />
                        <TouchableOpacity onPress={() =>  handleStore(category.id)}>
                            <View style={styles.textContainerTenMonAn}>
                                <Text style={styles.categoryName}>{category.ten_nguoi_dung}</Text>
                                <Text style={styles.categoryName}>{category.distance} Km</Text>

                                <Text style={styles.categoryPrice}>{category.dia_chi}</Text>
                            </View>
                        </TouchableOpacity>



                    </View>
                ))}
            </ScrollView>


        </View>
    );
};

const styles = StyleSheet.create({
    textContainerTenMonAn: {
        width: 250,
    },
    categoryName: {
        fontWeight: 'bold',
        fontSize: 18,
    },

    monAnImg: {
        width: 100,
        height: 100,
        borderRadius: 9,
        marginRight: 0,
        marginRight: 14,
    },
    monAnItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        backgroundColor: '#f0f0f0',
        padding: 10,
        borderRadius: 8,
    },
    monAnList: {
        flexGrow: 1,
        flexDirection: 'column',
        padding: 10,
    },
    line: {
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
    },
    textTitile: {
        fontSize: 24,
        fontWeight: 'bold',
        marginLeft: 50,
        marginTop: 10,
        marginBottom: 10
    },
    container: {
        flex: 1,
    },
    map: {
        // flex: 1,
        height: 500,
    },
});

export default Map;
