import React, { useState } from "react";
import { useNavigation } from '@react-navigation/native';


import {
    SafeAreaView,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    ScrollView
} from 'react-native';

const Pay = () => {
    const navigation = useNavigation();

    const handleSearch = () => {
        navigation.navigate('Search');
    };
    const handleItem = () => {
        navigation.navigate('Item');
    };
    const MonAn = [
        { id: 1, name: 'Bún đậu Hot 79 - Bún đậu chả cốm', hinh_anh: require('../img/bun_dau.jpg'), gia: '20.000 vnd' },
        { id: 2, name: 'Bún Bò Tâm - Giò Tái', hinh_anh: require('../img/bun2.jpg'), gia: '35.000 vnd' },
        { id: 3, name: 'Mì Cay SaSin - Mì cay Hải Sản   ', hinh_anh: require('../img/mi_cay.png'), gia: '59.000 vnd' },
        { id: 4, name: 'Bò Né 3 Ngon - Phần Đặc Biệt', hinh_anh: require('../img/bo_ne.jpg'), gia: '30.000 vnd' },
    ];
    return (
        <>
            <View style={styles.fixed}>
                <Text style={styles.content}> Thanh Toán</Text>
            </View>
            <ScrollView>

                <View style={styles.line}>
                    <Text style={styles.textFixed}>Giao tới</Text>
                </View>
                <View style={styles.boxContent}>
                    <Image
                        source={require('../img/house.png')}
                        style={styles.itemImage}
                        resizeMode="cover"
                    />
                    <View style={styles.information}>
                        <Text style={styles.text}>609 Nguyễn Kiệm</Text>
                        <Text>Phường 9, Phú Nhuận, Hồ Chí Minh</Text>

                    </View>
                </View>
                <View style={styles.boxContent}>
                    <Image
                        source={require('../img/house.png')}
                        style={styles.itemImage}
                        resizeMode="cover"
                    />
                    <View style={styles.information}>
                        <Text style={styles.text}>Giao hàng nhanh</Text>
                        <Text>Phường 9, Phú Nhuận, Hồ Chí Minh</Text>
                    </View>
                </View>
                <View style={styles.boxContent}>
                    <Image
                        source={require('../img/house.png')}
                        style={styles.itemImage}
                        resizeMode="cover"
                    />
                    <View style={styles.information}>
                        <Text style={styles.text}>Thêm voucher</Text>
                        <Text>Phường 9, Phú Nhuận, Hồ Chí Minh</Text>

                    </View>
                </View>
            
                <View style={styles.line}>
                    <Text style={styles.textFixed}>Đơn hàng </Text>
                </View>
                <ScrollView contentContainerStyle={styles.monAnList}>
                    {MonAn.map((category) => (
                        <View style={styles.monAnItem} key={category.id}>
                            {category.hinh_anh !== '' && (
                                <Image source={category.hinh_anh} style={[styles.monAnImg]} resizeMode="cover" />
                            )}
                            <TouchableOpacity onPress={handleItem}>
                                <View style={styles.textContainerTenMonAn}>
                                    <Text style={styles.categoryName}>{category.name}</Text>
                                    <Text style={styles.categoryPrice}>{category.gia}</Text>
                                </View>
                            </TouchableOpacity>
                            {/* <TouchableOpacity>
                            <Text style={styles.plus}>+</Text>
                        </TouchableOpacity> */}
                        </View>
                    ))}
                </ScrollView>

                <View style={styles.boxPay}>
                    <Text style={styles.content}>Thanh Toán</Text>

                    <View style={styles.styleRow}>
                        <Text style={styles.styleText}>Tạm tính</Text>
                        <Text style={styles.styleText}>130.000đ</Text>
                    </View>
                    <View style={styles.styleRow}>
                        <Text style={styles.styleText}>Phí vận chuyển</Text>
                        <Text style={styles.styleText}>21.000đ</Text>
                    </View>
                    <View style={styles.styleRow}>
                        <Text style={styles.styleText}>Giảm giá</Text>
                        <Text style={styles.styleText}>-55.000đ</Text>
                    </View>
                </View>

            </ScrollView>
            <View style={styles.total}>
                <View style={styles.line}>
                    <Text style={styles.textFixed}>Tổng thanh toán</Text>
                </View>
                <View style={styles.totalRow}>
                    <Text style={styles.styleText}>Tổng số tiền</Text>
                    <Text style={styles.styleText}>-55.000đ</Text>
                </View>
                <View style={styles.totalRow}>
                    <Text style={styles.styleText}>Tổng số tiền</Text>
                    <Text style={styles.styleText}>-55.000đ</Text>
                </View>
                <View style={styles.submit}>
                    <TouchableOpacity>
                        <Text style={styles.textSubmit}>Đặt món</Text>
                    </TouchableOpacity>
                </View>
            </View>


        </>



    );
};

const styles = StyleSheet.create({
    textSubmit: {
        fontSize: 26,
        width: 110,
        padding: 4
    },
    submit: {
        backgroundColor: 'yellow',
        flexDirection: 'row',
        justifyContent: 'center',
        width: 396,
        padding: 3,
        // borderRadius: 15
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: 20,
        marginRight: 20
    },
    styleText: {
        fontSize: 16,
        margin: 7
    },
    styleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    boxPay: {
        backgroundColor: '#f0f0f0',
        marginLeft: 20,
        width: 350
    },
    categoryName: {
        fontWeight: 'bold'
    },
    monAnImg: {
        width: 50,
        height: 50,
        borderRadius: 9,
        marginRight: 20,
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
    text: {
        fontSize: 16,
        fontWeight: 'bold',
        padding: 7
    },
    itemImage: {
        width: 30,
        height: 30,
        margin: 10
    },
    information: {
        flexDirection: 'column',
        padding: 10
    },
    boxContent: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 20

    },
    textFixed: {
        marginLeft: 20,
        fontSize: 18,
        color: 'gray',

    },
    content: {
        fontWeight: "bold",
        fontSize: 20

    },
    fixed: {
        marginTop: 50,
        marginLeft: 30,

    },

    line: {
        backgroundColor: '#fff',
        color: 'gray',
        height: 40,
        display: 'flex',
        justifyContent: 'center',
        padding: 10,
        marginTop: 10

    }
});

export default Pay;
