import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, Image, ScrollView, TextInput, SafeAreaView, TouchableOpacity, Linking } from "react-native";
import { useCart } from './cartContext';
import { useNavigation } from '@react-navigation/native';
// import { Linking } from 'react-native';
import WebView from 'react-native-webview';
import axios from 'axios';

const Cart = ({ route }) => {
    const navigation = useNavigation();
    const { cartItems, updateDecreaseCartItem, updateIncreaseCartItem, removeFromCart, menuCart } = useCart();
    const [soluong, setSoLuong] = useState(1);
    const [total, setToTal] = useState(1);
    const [ship, setShip] = useState(1);

    const [cuahang, setCuaHang] = useState([]);
    const { nearbyStores, setNearbyStores } = useCart();

    const handlePayment = async () => {
        navigation.navigate('WebVnpay', { total: total });
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


    const handleDecreaseQuantity = (item) => {
        updateDecreaseCartItem(item);
    };
    const handleIncreaseQuantity = (item) => {
        updateIncreaseCartItem(item);

    };
    const handleDalete = (item) => {
        removeFromCart(item);

    };
    const calculateTotal = () => {
        let totalPrice = 0;
        groupedItemsArray.forEach(group => {
            const storeId = group[0].storeId;

            nearbyStores.forEach(category => {
                if (category.id === storeId) {
                    const distance = parseInt(category.distance, 10);
                    if (distance > 10) {
                        totalPrice += 50000;
                    } else if (distance > 1) {
                        totalPrice += distance * 5000;
                    }
                }
            });
            setShip(totalPrice);
        });
        for (const item of cartItems) {
            totalPrice += item.price * item.quantity;
        }
        return totalPrice;
    };


    const groupedCartItems = cartItems.reduce((groups, item) => {
        const storeId = item.storeId;
        if (!groups[storeId]) {
            groups[storeId] = [];
        }
        groups[storeId].push(item);
        return groups;
    }, {});

    const groupedItemsArray = Object.values(groupedCartItems);

    useEffect(() => {
        getCuaHangAPI();
        const calculatedTotal = calculateTotal();
        setToTal(calculatedTotal);
    }, [cartItems]);
    return (
        <>

            <View style={styles.container}>
                <Image
                    source={require('../img/banner_food.jpg')}
                    style={styles.itemImage}
                    resizeMode="cover"
                />
            </View>
            <ScrollView>
                <ScrollView contentContainerStyle={styles.monAnList}>

                </ScrollView>
                <View style={styles.container}>
                    {groupedItemsArray.map((group, index) => (
                        <>
                            <View key={index} style={styles.cartItem}>
                                {cuahang.map((cuahangItem) => {
                                    if (group[0].storeId === cuahangItem.id) {
                                        return (
                                            <>
                                                <View style={styles.boxRow}>
                                                    <Image source={require('../img/store.png')} style={styles.icon} />
                                                    <Text key={cuahangItem.id} style={styles.storeTitle}>
                                                        {cuahangItem.ten_nguoi_dung}
                                                    </Text>
                                                </View >

                                            </>


                                        );
                                    }
                                    return null;
                                })}
                                {group.map((item) => (
                                    <>
                                        <View style={styles.boxRow}>

                                            <Image
                                                style={styles.monAnImg}
                                                source={{ uri: item.hinh_anh }}
                                            />
                                            <View style={styles.rowBox}>
                                                <Text style={styles.monAnText}>{item.ten_mon_an}</Text>
                                                <Text style={styles.textPrice}>{item.price} VND</Text>
                                                <Text style={styles.textPrice}>Phí ship  {ship} VND</Text>

                                                <View style={styles.numberPlus}>
                                                    <TouchableOpacity onPress={() => handleDecreaseQuantity(item.id)} >
                                                        <Text style={styles.plusGioHang}>-</Text>
                                                    </TouchableOpacity>
                                                    <Text style={styles.Text}>{item.quantity}</Text>
                                                    <TouchableOpacity onPress={() => handleIncreaseQuantity(item.id)} >
                                                        <Text style={styles.plusGioHang}>+</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity style={styles.boxDelete} onPress={() => handleDalete(item.id)} >
                                                        <Text style={styles.deleteItem}>Xóa</Text>
                                                    </TouchableOpacity>
                                                    <View style={styles.line}></View>
                                                </View>
                                            </View>


                                        </View>
                                        <View style={styles.lineNgang}></View>



                                    </>
                                ))}
                            </View>
                        </>

                    ))}
                </View>

            </ScrollView>

            <View style={styles.fixed}>
                
                <TouchableOpacity style={styles.rowBoxPay} onPress={handlePayment} >
                    <Text style={styles.fixedTextPay}>Mua hàng</Text>
                </TouchableOpacity>
             
                <View style={styles.boxToTal}>
                    <Text style={styles.fixedTextToTal} >Tổng tiền: {total} VND</Text>
                </View>


            </View>

        </>


    );
};
const styles = StyleSheet.create({
    itemImage: {
        width: 400,
        height: 200,
        marginRight: 10,
    },
    line: {
        borderBottomColor: 'gray',
        borderBottomWidth: 3,
    },
    lineNgang: {
        borderBottomColor: 'gray',
        marginBottom: 15,
    },
    storeTitle: {
        fontSize: 23,
        fontWeight: 'bold',
    },
    boxRow: {
        display: 'flex',
        flexDirection: 'row'
    },
    boxDelete: {
        // width:200,
        // backgroundColor
    },
    deleteItem: {
        fontSize: 20,
        padding: 5,
        borderRadius: 5,
        color: 'white',
        backgroundColor: 'red',
        width: 80,
        height: 34,
        marginLeft: 30,
        textAlign: "center",
    },
    boxToTal: {
        width: 200,
        height: 30,
        marginLeft: 30,
        marginTop: 50,
    },
    fixedTextToTal: {
        color: 'black',
        fontSize: 19,
    },
    rowBoxPay: {
        marginLeft: 10,
        marginTop: 20,
        marginBottom: 20,
        height: 70,
        borderRadius: 8,
        width: 140,
        backgroundColor: 'black'
    },
    icon: {
        marginLeft: 7,
        width: 30,
        marginBottom: 10,
        height: 30,
        marginRight: 10,
    },
    textPrice: {
        color: 'red',
        fontWeight: 'bold'
    },
    monAnText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    Text: {
        fontSize: 20,
        fontWeight: 'bold',
        // paddingLeft: 12,
        margin: 4
    },
    plusGioHang: {
        fontSize: 20,
        padding: 5,
        borderRadius: 5,
        color: 'white',
        backgroundColor: 'red',
        width: 30,
        height: 34,
        textAlign: "center",
        // marginLeft: 20,
        // margin: 5,

    },
    numberPlus: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cartItem: {
        // marginLeft: 10,
        // marginRight: 10,
        borderRadius: 3,
        // padding: 5,
        paddingLeft: 13,
        // marginBottom: 0,
        flexDirection: 'column',
        backgroundColor: '#EBEDF9'
    },
    monAnImg: {
        width: 110,
        height: 100,
        borderRadius: 9,
        marginRight: 20,
    },

    fixedTextEdit: {
        fontSize: 24,
        marginLeft: 120,
        marginTop: 5,
    },
    fixedTextPay: {
        fontSize: 16,
        paddingLeft: 30,
        paddingTop: 25,
        color: 'white',
    },
    fixedText: {
        fontSize: 24,
        marginLeft: 20,
        color: 'black',
        padding: 5,
    },
    fixedTitle: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: 40,
        // borderRadius: 8,
        // marginLeft: 20,
        backgroundColor: '#1DB954',

    },
    fixed: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: 40,
        // borderRadius: 8,
        backgroundColor: '#1DB954',


    },
    container: {
        // flex: 1,
        backgroundColor: '#fff',
    },
});

export default Cart;
