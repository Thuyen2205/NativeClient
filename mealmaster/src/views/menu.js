import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, ScrollView, TextInput, SafeAreaView, TouchableOpacity } from "react-native";
import { useCart } from './cartContext';
import { useNavigation } from '@react-navigation/native';


const Item = ({ route }) => {
    const [tongTien, setTongTien] = useState(0);
    const [soluong, setSoLuong] = useState(1);
    const [menu, setMenu] = useState([]);
    const [monan, setMonAn] = useState([]);
    const { addToCartMenu, menuCart } = useCart();
    const { addToCart, cartItems } = useCart();
    const navigation = useNavigation();

    const { itemId } = route.params;

    // const handleAddToCart = () => {
    //     const existingItem = menuCart.find(item => item.id === menu.id);

    //     if (existingItem) {
    //         const updatedCart = menuCart.map(item =>
    //             item.id === menu.id ? { ...item, quantity: item.quantity + soluong } : item
    //         );
    //         if (soluong > 0) {
    //             addToCartMenu(menu.id, menu.hinh_anh, menu.tieu_de, soluong, menu.nguoi_dung);
    //             alert("Thêm giỏ hàng thành công")
    //         } else {
    //             alert("Vui lòng chọn số lượng sản phẩm để thêm vào giỏ")
    //         }
    //     } else {
    //         if (soluong > 0) {
    //             addToCartMenu(menu.id, menu.hinh_anh, menu.tieu_de, soluong, menu.nguoi_dung);
    //             alert("Thêm giỏ hàng thành công")
    //         } else {
    //             alert("Vui lòng chọn số lượng sản phẩm để thêm vào giỏ")
    //         }
    //     }
    // };
    const handleCart = () => {
        navigation.navigate('Cart');
    }
    const handleAddToCart = () => {
        const existingItem = cartItems.find(item => item.id === menu.id);

        if (existingItem) {
            const updatedCart = cartItems.map(item =>
                item.id === menu.id ? { ...item, quantity: item.quantity + soluong } : item
            );
            if (soluong > 0) {
                addToCart(menu.id, tongTien, menu.hinh_anh, menu.tieu_de, soluong, menu.nguoi_dung);
                alert("Thêm giỏ hàng thành công")
            } else {
                alert("Vui lòng chọn số lượng sản phẩm để thêm vào giỏ")
            }
        } else {
            if (soluong > 0) {
                addToCart(menu.id, tongTien, menu.hinh_anh, menu.tieu_de, soluong, menu.nguoi_dung);
                alert("Thêm giỏ hàng thành công")
            } else {
                alert("Vui lòng chọn số lượng sản phẩm để thêm vào giỏ")
            }
        }
    };
    const getMenuAPI = () => {
        fetch(`http://10.0.2.2:8000/menu/${itemId}/`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                setMenu(data);
            })
            .catch((err) => {
                console.error('There was a problem with the fetch operation:', err);
            });
    };
    const getMonAnAPI = () => {
        fetch(`http://10.0.2.2:8000/menu/${itemId}/list-monan/`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {

                setMonAn(data);
                const totalAmount = data.reduce((total, item) => total + item.gia_mon_an, 0);
                setTongTien(totalAmount);
            })
            .catch((err) => {
                console.error('There was a problem with the fetch operation:', err);
            });
    };
    const handlePlusClick = () => {
        setSoLuong(soluong + 1);
        const giaMonAn = monan.reduce((total, item) => total + item.gia_mon_an, 0);
        setTongTien(tongTien + giaMonAn);
    };

    const handleMinusClick = () => {
        if (soluong > 1) {
            setSoLuong(soluong - 1);
            const giaMonAn = monan.reduce((total, item) => total + item.gia_mon_an, 0);
            setTongTien(tongTien - giaMonAn);
        }
    };
    useEffect(() => {
        getMenuAPI();
        getMonAnAPI();


    }, []);

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
                <View style={styles.container}>
                    <View style={styles.rowContainer}>
                        <Text style={styles.Text}>{menu.tieu_de}</Text>
                        <View style={styles.discountBanner}>
                            <Text style={styles.discountText}>11%</Text>
                            <Text style={styles.discountText}>OFF</Text>
                        </View>
                    </View>
                </View>
                {monan.map((category) => (
                    <View style={styles.monAnItem}>
                        <Image style={styles.monAnImg}
                            source={require('../img/matcha_da_xay.jpg')} />
                        <TouchableOpacity onPress={() => handleItem(category.id, products)}>
                            <View style={styles.textContainerTenMonAn}>
                                <Text style={styles.categoryName}>{category.ten_mon_an}</Text>
                                <Text style={styles.categoryPrice}>{category.gia_mon_an}<Text>VND</Text></Text>
                            </View>
                        </TouchableOpacity>

                    </View>
                ))}

            </ScrollView>


            <View style={styles.fixed}>
                <View style={styles.fixedPrice}>
                    <Text style={[styles.Text, styles.tongTien]}>{tongTien} VND</Text>
                    <View style={styles.numberPlus}>
                        <TouchableOpacity onPress={() => handleMinusClick()} >
                            <Text style={styles.plusGioHang}>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.Text}>{soluong}</Text>
                        <TouchableOpacity onPress={() => handlePlusClick()}>
                            <Text style={styles.plusGioHang}>+</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.rowBox}>
                <TouchableOpacity onPress={handleAddToCart}>
                    <Text style={styles.fixedText}>Thêm vào giỏ</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleCart}>
                        <Image source={require('../img/shoppingCart.png')} style={styles.icon} />
                    </TouchableOpacity>
                </View>

               
            </View>



        </>

    );
};
const styles = StyleSheet.create({
    rowBox: {
        display: 'flex',
        flexDirection: 'row'
    },
    icon: {
        marginLeft: 20,
        width: 40,
        height: 40,
        marginRight: 10,
    },
    categoryPrice: {
        fontSize: 14,
        color: 'gray',
    },
    categoryName: {
        fontSize: 16,
        fontWeight: 'bold',
        width: 130,
        // marginLeft:20
    },
    monAnItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        backgroundColor: '#CAD7D6',
        padding: 10,
        borderRadius: 8,
    },
    monAnImg: {
        width: 70,
        height: 70,
        borderRadius: 9,
        marginRight: 20,
    },
    discountBanner: {
        backgroundColor: 'red',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
        marginRight: 10,
        margin: 10,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    itemImage: {
        width: 400,
        height: 300,
        marginRight: 10,
    },
    numberPlus: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 90,
    },

    plusGioHang: {
        fontSize: 20,
        padding: 5,
        borderRadius: 5,
        color: 'white',
        backgroundColor: 'red',
        width: 40,
        height: 40,
        textAlign: "center",
        marginLeft: 20,
        margin: 5,

    },
    tongTien: {
        paddingRight: 20
    },
    Text: {
        fontSize: 20,
        fontWeight: 'bold',
        paddingLeft: 12,
    },
    fixedPrice: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 15
    },

    fixed: {
        backgroundColor: '#fff',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: 'lightgray',
        alignItems: 'center',
        position: 'sticky',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 999,
    },
    fixedText: {
        fontSize: 18,
        width: 300,
        height: 40,
        paddingTop: 10,
        textAlign: 'center',
        borderRadius: 10,
        fontWeight: 'bold',
        backgroundColor: 'red',
    },
});

export default Item;
