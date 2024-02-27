import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, Image, ScrollView, TextInput, SafeAreaView, TouchableOpacity } from "react-native";
import { useCart } from './cartContext';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from './authContext';
import axios from 'axios';

const Item = ({ route }) => {
    const navigation = useNavigation();

    const [soluong, setSoLuong] = useState(1);
    const [products, setProducts] = useState([]);
    const [tongTien, setTongTien] = useState();
    const [chitiethoadon, setchitiethoadon] = useState([]);
    const [hoadon, setHoaDon] = useState([]);
    const [binhluan, setBinhLuan] = useState([]);
    const [khachhang, setKhachHang] = useState([]);

    const [noiDung, setNoiDung] = useState('');
    const { itemId } = route.params;
    const { isAuthenticated, userData } = useAuth();
    const { addToCart, cartItems } = useCart();
    // const nguoidungbinhluan = binhluan.map((category) => {
    //     const khachHang = khachhang.find((kh) => kh.id === category.nguoi_dung_id);

    //     return khachHang ;
    // });
    const getKhachHangAPI = () => {
        fetch(`http://10.0.2.2:8000/taikhoans/loai-tai-khoan-1/`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                setKhachHang(data)
            })
            .catch((err) => {
                console.error('There was a problem with the fetch operation:', err);
            });
    };
    const handleBinhLuan = async () => {
        try {
            const response = await axios.post(
                "http://10.0.2.2:8000/binhluan/",
                {
                    noi_dung: noiDung,
                    mon_an_binh_luan: itemId
                }
            );
            alert("Bình luận thành công: ");
        } catch (error) {
            console.error('There was a problem with the Axios request:', error);
        }
    };

    const getBinhLuanAPI = () => {
        fetch(`http://10.0.2.2:8000/binhluan/`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                setBinhLuan(data)
            })
            .catch((err) => {
                console.error('There was a problem with the fetch operation:', err);
            });
    };
    const getHoaDonAPI = () => {
        fetch(`http://10.0.2.2:8000/payment_vnpay/`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                setHoaDon(data)
            })
            .catch((err) => {
                console.error('There was a problem with the fetch operation:', err);
            });
    };
    const getChiTietHoaDonAPI = () => {
        fetch(`http://10.0.2.2:8000/chitiethoadonvnpay/`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                setchitiethoadon(data)
            })
            .catch((err) => {
                console.error('There was a problem with the fetch operation:', err);
            });
    };
    const handleAddToCart = () => {
        const existingItem = cartItems.find(item => item.id === products.id);

        if (existingItem) {
            const updatedCart = cartItems.map(item =>
                item.id === products.id ? { ...item, quantity: item.quantity + soluong } : item
            );
            if (soluong > 0) {
                addToCart(products.id, products.gia_mon_an, products.hinh_anh, products.ten_mon_an, soluong, products.nguoi_dung);
                alert("Thêm giỏ hàng thành công")
            } else {
                alert("Vui lòng chọn số lượng sản phẩm để thêm vào giỏ")
            }
        } else {
            if (soluong > 0) {
                addToCart(products.id, products.gia_mon_an, products.hinh_anh, products.ten_mon_an, soluong, products.nguoi_dung);
                alert("Thêm giỏ hàng thành công")
            } else {
                alert("Vui lòng chọn số lượng sản phẩm để thêm vào giỏ")
            }
        }
    };

    const getProductsAPI = () => {
        fetch(`http://10.0.2.2:8000/monan/${itemId}/`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                setTongTien(data.gia_mon_an)
                setProducts(data);
            })
            .catch((err) => {
                console.error('There was a problem with the fetch operation:', err);
            });
    };
    
    const handlePlusClick = (giaMonAn) => {
        const giaMonAnNumber = giaMonAn;
        if (soluong < 50) {
            const newTongTien = tongTien + giaMonAnNumber;
            setTongTien(newTongTien);
            setSoLuong(soluong + 1);
        }

    };
    const handleMinusClick = (giaMonAn) => {
        const giaMonAnNumber = giaMonAn;
        if (soluong >= 1) {
            const newTongTien = tongTien - giaMonAnNumber;
            setTongTien(newTongTien);
            setSoLuong(soluong - 1);
        }


    };
    const handleCart = () => {
        navigation.navigate('Cart');
    }

    userData[0].id
    const hoadonthanhtoan = chitiethoadon.map((chitiet) => {
        const filteredHoadon = hoadon.filter((hoadonItem) => hoadonItem.id === chitiet.hoa_don);

        return filteredHoadon;
    });
    const chitiethoadonthanhtoan = chitiethoadon.filter((chitiet) => chitiet.mon_an === itemId);


    const nguoiDungHoaDonFiltered = hoadonthanhtoan
        .filter((nguoiDungHoaDonItem) => {
            const hoadonId = nguoiDungHoaDonItem.id;
            return chitiethoadonthanhtoan.some((chitiet) => chitiet.hoadon === hoadonId);
        })
        .flat();
    // console.log(khachhang)
    useEffect(() => {
        getProductsAPI();
        getChiTietHoaDonAPI();
        getHoaDonAPI();
        getBinhLuanAPI();
        getKhachHangAPI();

    }, []);
    return (
        <>

            <ScrollView>
                <View style={styles.container}>
                    <Image
                        source={require('../img/banner_food.jpg')}
                        style={styles.itemImage}
                        resizeMode="cover"
                    />
                </View>
                <>
                    <View style={styles.container}>
                        <Text style={styles.Text}>{products.ten_mon_an}</Text>
                    </View>
                    <View style={styles.container}>
                        <Text style={styles.Describe}>{products.mo_ta}</Text>
                    </View>

                    <View style={styles.container}>
                        <Text style={styles.Describe}>3,4k <Text style={styles.Describe}>đã bán</Text></Text>
                    </View>


                    <View style={[styles.container, styles.priceContainer]}>
                        <Text style={styles.Price}>{products.gia_mon_an}</Text>
                        <TouchableOpacity onPress={() => handlePlusClick(products.gia_mon_an)}>
                            <Text style={styles.plus}>+</Text>

                        </TouchableOpacity>

                    </View>

                    <View style={styles.line}></View>

                    <View style={styles.container}>
                        {userData[0].id === nguoiDungHoaDonFiltered[0]?.khach_hang && (
                            <>
                                <Text style={styles.Text}>Ghi chú cho chủ quán</Text>
                                <TextInput
                                    style={styles.inputText}
                                    placeholder="Cho quán biết thêm yêu cầu của bạn"
                                    value={noiDung}
                                    onChangeText={(text) => setNoiDung(text)}
                                />
                                <TouchableOpacity style={styles.boxBinhLuan} onPress={handleBinhLuan}
                                >
                                    <Text style={styles.textBinhLuan}>Bình luận </Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>



                    <View style={styles.container}>
                        <Text style={styles.Text}>Đánh giá món ăn</Text>

                        <ScrollView contentContainerStyle={styles.binhLuanList}>
                            {binhluan.map((category) => {
                                // console.log(nguoidungbinhluan[0].avatar)
                                if (category.mon_an_binh_luan === itemId) {
                                    return (
                                        <View style={styles.binhLuanItem} key={category.id}>
                                            <View style={styles.textContainer}>

                                                
                                                <View style={styles.infoContainer}>
                                                    <Text style={styles.categoryName}></Text>
                                                    <View style={styles.ngayBinhLuanContainer}>
                                                        <Text style={styles.ngayBinhLuan}>{category.ngay_binh_luan}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                            <Text style={styles.categoryPrice}>{category.noi_dung}</Text>
                                        </View>
                                    );
                                }
                            })}

                        </ScrollView>

                    </View>
                </>
            </ScrollView>

            <View style={styles.fixed}>
                <View style={styles.fixedPrice}>
                    <Text style={[styles.Text, styles.tongTien]}>{tongTien} VND</Text>
                    <View style={styles.numberPlus}>
                        <TouchableOpacity onPress={() => handleMinusClick(products.gia_mon_an)} >
                            <Text style={styles.plusGioHang}>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.Text}>{soluong}</Text>
                        <TouchableOpacity onPress={() => handlePlusClick(products.gia_mon_an)}>
                            <Text style={styles.plusGioHang}>+</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.rowBox}>
                    <TouchableOpacity onPress={handleAddToCart} style={styles.rowBox} >
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
    categoryPrice:{
        marginLeft:60,
    },
    horizontalItemImageBrand: {
        width: 50,
        height: 50,
        borderRadius: 10,
        borderWidth: 2,
        marginRight: 12,
        marginTop:14,

    },
    textBinhLuan: {
        fontWeight: 'bold',

    },
    boxBinhLuan: {
        backgroundColor: '#1DB954',
        width: 120,
        height: 30,
        borderRadius: 8,
        display: 'flex',
        justifyContent: 'center',
        textAlign: 'center',
        alignItems: 'center',
        marginLeft: 140,
    },
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
    tongTien: {
        paddingRight: 20
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
    numberPlus: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 90,
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
    ngayBinhLuanContainer: {
        alignItems: 'flex-end',
    },
    infoContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    categoryName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    ngayBinhLuan: {
        fontSize: 16,
        color: 'gray',
        marginLeft: 30

    },
    textContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    binhLuanList: {
        flexGrow: 1,
        flexDirection: 'column',
        padding: 10,
    },
    binhLuanItem: {
        flexDirection: 'column',
        marginBottom: 10,
        backgroundColor: '#f0f0f0',
        justifyContent: 'flex-start',
        padding: 10,
        borderRadius: 8,
    },
    binhLuanImg: {
        width: 40,
        height: 40,
        borderRadius: 40,
        marginRight: 20,
    },
    inputText: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginTop: 10,
        margin: 14
    },
    line: {
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
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
    discountText: {
        color: 'white',
    },
    itemImage: {
        width: 400,
        height: 300,
        marginRight: 10,
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    Text: {
        fontSize: 20,
        fontWeight: 'bold',
        paddingLeft: 12,
    },
    Price: {
        fontSize: 20,
        // color: 'red',
        // marginLeft:30,
        paddingBottom: 7,
        paddingLeft: 12,
        fontWeight: 'bold',

    },
    Describe: {
        fontSize: 16,
        color: 'gray',
        paddingBottom: 7,
        paddingLeft: 12,

    },
    plus: {
        fontSize: 20,
        padding: 5,
        borderRadius: 5,
        color: 'white',
        backgroundColor: 'red',
        marginRight: 20,
        width: 40,
        height: 40,
        textAlign: "center",
        margin: 10,

    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

    },
});

export default Item;
