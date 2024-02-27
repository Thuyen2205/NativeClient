import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, Image, ScrollView, TextInput, SafeAreaView, TouchableOpacity } from "react-native";
import { useCart } from './cartContext';
import { useNavigation } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import { useAuth } from './authContext';
import axios from 'axios';

const WebVnpay = ({ route }) => {
    const { total } = route.params;
    const navigation = useNavigation();
    const { isAuthenticated, userData } = useAuth();
    const { cartItems, updateDecreaseCartItem, updateIncreaseCartItem, removeFromCart, menuCart } = useCart();

    // console.log(userData[0].id)
    const vnpayData = {
        amount: total,
        bank_code: "NCB",
        language: "vn",
        userId: userData[0].id,

    };
    const cartItemIds = cartItems.map(item => item.id).join(',');

    // console.log(cartItems.id)
    const dataVNPAY = `
  document.getElementById("amount").value = "${vnpayData.amount}";
  document.getElementById("bank_code").value = "${vnpayData.bank_code}";
  document.getElementById("language").value = "${vnpayData.language}";
  document.getElementById("userId").value = "${vnpayData.userId}"; 
  document.getElementById("cartItemIds").value = "${cartItemIds}";


  `;

    return (
        <>
            <WebView
                source={{ uri: `http://10.0.2.2:8000/payment` }}
                injectedJavaScript={dataVNPAY}
            />
            <TouchableOpacity onPress={() => navigation.navigate('Cart')} style={{ padding: 17, borderRadius: 10, backgroundColor: '#1DB954', margin: 10 }}>
                <Text style={{ color: 'Black', fontSize: 16, paddingLeft: 130, }}>Quay lại giỏ hàng</Text>
            </TouchableOpacity>
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
        padding: 5,
        paddingLeft: 13,
        marginBottom: 20,
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
        flex: 1,
        backgroundColor: '#fff',
    },
});

export default WebVnpay;
