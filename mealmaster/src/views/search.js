import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, ScrollView, TextInput, SafeAreaView, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';
// import React, { useState } from 'react';



const Search = ({ route }) => {
    const navigation = useNavigation();
    const { timkiem } = route.params;
    const [monan, setMonAn] = useState([]);
    const [tenMonAn, setTenMonAn] = useState('');
    const [isColorChanged, setIsColorChanged] = useState(false);
    const [isColorChangedCuaHang, setIsColorChangedCuaHang] = useState(true);
    const [thongBao, setThongBao] = useState(false);
    const [cuahang, setCuaHang] = useState([]);

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
    const handleNavigateToHome = () => {
        navigation.navigate('Home');
    };
    const handleNavigateToCart = () => {
        navigation.navigate('Cart');
    };
    const handleSearch = () => {
        fetch(`http://10.0.2.2:8000/api/search-mon-an/${encodeURIComponent(tenMonAn)}/`)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    setMonAn(data);
                    setThongBao(false);
                } else {
                    setMonAn([]);
                    setThongBao(true);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            })
            .finally(() => {
                // Đặt lại giá trị của tenMonAn thành rỗng sau khi hoàn thành tìm kiếm
                setTenMonAn('');
            });
    };

    const CuaHang = [
        { id: 2, name: 'Trà sữa Koi Thé ', hinh_anh: require('../img/lo_go_koi.jpg') },
        { id: 3, name: 'BurgerKing', hinh_anh: require('../img/lo_go_burgerking.png') },
        { id: 4, name: 'Macdonal', hinh_anh: require('../img/lo_go_macdonald.png') },

    ];

    const handleItem = () => {
        navigation.navigate('Item');
    };
    const handleStore = (categoryId) => {
        navigation.navigate('Store', { categoryId });
    };




    const handleScroll = (event) => {
        const scrollPosition = event.nativeEvent.contentOffset.x; // Đối với scroll ngang, lấy giá trị x
        if (scrollPosition > 100 && !isColorChanged) {
            setIsColorChanged(true);
            setIsColorChangedCuaHang(false);
        }
        if (scrollPosition == 0 && isColorChanged) {
            setIsColorChanged(false);
            setIsColorChangedCuaHang(true);
        }
    };
    useEffect(() => {
        fetch(`http://10.0.2.2:8000/api/search-mon-an/${encodeURIComponent(timkiem)}/`)
            .then(response => response.json())
            .then(data => {
                setMonAn(data)
            })
            .catch(error => {
                console.error('Error:', error);
            });
        getCuaHangAPI();

    }, []);
    return (
        <>


            <ScrollView>
                <View style={styles.containerSearch}>
                    <View style={styles.searchBar}>
                        <TouchableOpacity onPress={handleSearch}>
                            <Image
                                source={require('../img/magnifying_glass.png')}
                                style={styles.glassImg}
                                resizeMode="cover"
                            />
                        </TouchableOpacity>

                        <TextInput
                            placeholder="Hòa nhịp giáng sinh, up to 50%..."
                            style={styles.searchInput}
                            value={tenMonAn}
                            onChangeText={(text) => setTenMonAn(text)}
                        />
                    </View>
                </View>

                <View style={styles.titles}>
                    <Text style={[styles.textTitleMonAn, isColorChanged && styles.colorChanged]}>
                        Món Ăn
                    </Text>
                    <Text style={[styles.textTitleCuaHang, isColorChangedCuaHang && styles.colorChanged]}>Cửa Hàng</Text>
                </View>
                <View style={styles.lineNgang}></View>
                {thongBao && (
                    <Text style={styles.textThongBao}>Không có dữ liệu</Text>
                )}


                <ScrollView horizontal={true} pagingEnabled={true} onScroll={handleScroll}
                    scrollEventThrottle={16} showsHorizontalScrollIndicator={false} >

                    <ScrollView contentContainerStyle={styles.monAnList}>

                        {monan.map((category) => (
                            <View style={styles.monAnItem} key={category.id}>
                                {category.hinh_anh !== '' && (
                                    <Image
                                        style={styles.monAnImg}
                                        resizeMode="cover"
                                        source={{ uri: category.hinh_anh }}
                                    />)}
                                <TouchableOpacity onPress={handleItem}>
                                    <View style={styles.textContainerTenMonAn}>
                                        <Text style={styles.categoryName}>{category.ten_mon_an}</Text>
                                        <Text style={styles.categoryPrice}>{category.gia_mon_an}<Text>VND</Text></Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity>
                                    <Text style={styles.plus}>+</Text>

                                </TouchableOpacity>


                            </View>
                        ))}
                    </ScrollView>




                    <ScrollView showsHorizontalScrollIndicator={false} style={styles.cuaHangList}>

                        {cuahang.map((category) => (
                            <TouchableOpacity onPress={() => handleStore(category.id)} style={[styles.monAnItem]}>

                                {/* <Image source={category.hinh_anh} style={[styles.monAnImg]} resizeMode="cover" /> */}
                                <Image
                                    resizeMode="cover"
                                    style={styles.monAnImg}
                                    source={{ uri: category.avatar }}
                                />
                                <View style={styles.categoryTextContainer} >
                                    <Text style={styles.categoryName}>{category.ten_nguoi_dung}</Text>
                                    <View style={styles.container}>
                                        <View style={styles.rowContainer}>
                                            <View style={styles.rating}>
                                                <Image source={require('../img/star.png')} style={[styles.binhLuanImg]} resizeMode="cover" />
                                                <Text style={styles.danhGia}>4.6</Text>
                                                <View style={styles.line}></View>
                                                <Text style={styles.luotDanhGia}>448 <Text style={styles.danhGiaDivider}>Đánh giá</Text></Text>
                                            </View>

                                            <View style={[styles.rating, styles.ratingKhoangCach]}>
                                                <Image source={require('../img/point.png')} style={[styles.binhLuanImg]} resizeMode="cover" />
                                                <View style={styles.line}></View>

                                                <Text style={styles.khoangCach}>0.6 <Text>Km</Text></Text>
                                            </View>



                                        </View>
                                    </View>
                                </View>

                            </TouchableOpacity>


                        ))}

                        {/* ... */}
                    </ScrollView>


                </ScrollView>



            </ScrollView >

            <View style={styles.fixed}>
                <View style={styles.bottomFixed}>
                    <TouchableOpacity style={styles.items} onPress={handleNavigateToHome}>
                        <Image
                            source={require('../img/house.png')}
                            style={styles.itemImage}
                            resizeMode="cover"
                        />
                        <Text>Trang chủ</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.items}>
                        <Image
                            source={require('../img/kinh_lup.png')}
                            style={styles.itemImage}
                            resizeMode="cover"
                        />
                        <Text>Tìm kiếm</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.items}>
                        <Image
                            source={require('../img/trai_dat.png')}
                            style={styles.itemImage}
                            resizeMode="cover"
                        />
                        <Text>Gần đây</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.items} onPress={handleNavigateToCart}>
                        <Image
                            source={require('../img/don_hang.png')}
                            style={styles.itemImage}
                            resizeMode="cover"
                        />
                        <Text>Đơn hàng</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.items}>
                        <Image
                            source={require('../img/gio_hang.png')}
                            style={styles.itemImage}
                            resizeMode="cover"
                        />
                        <Text>Giỏ hàng</Text>
                    </TouchableOpacity>

                </View>
            </View>
        </>



    );
};
const styles = StyleSheet.create({
    textThongBao: {
        width: 300,
        fontSize: 25,
        color: 'gray',
        marginLeft: 130,
        marginTop: 100,
    },
    categoryTextContainer: {
        flex: 1,
        // alignItems: 'center',
        height: 50,
        flexDirection: "column",
        justifyContent: "flex-start",
        // marginTop: 5,
    },
    ratingKhoangCach: {
        width: 83
    },
    line: {
        height: 15,
        width: 1,
        backgroundColor: 'gray',
        marginHorizontal: 2,
    },
    khoangCach: {
        paddingLeft: 5,
    },
    danhGia: {
        paddingRight: 5,

    },
    binhLuanImg: {

        width: 20,
        height: 20,
        borderRadius: 40,
        marginRight: 5,
        // marginLeft:30,

    },
    rating: {
        marginLeft: 30,
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 5,
        paddingLeft: 2,
        marginLeft: 14,
        margin: 2

    },
    rowContainer: {
        flexDirection: 'row',
        // marginBottom: 10,
        backgroundColor: '#f0f0f0',


    },

    itemImage: {
        width: 30,
        height: 30,
    },
    items: {
        flexDirection: 'column',
        justifyContent: "center",
        alignItems: "center",
        margin: 10
    },
    bottomFixed: {
        flexDirection: "row",
    },
    fixed: {
        backgroundColor: '#fff',
        padding: 10,
        borderTopWidth: 2,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderTopColor: 'lightgray',
        alignItems: 'center',
        position: 'sticky',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 999,

    },
    colorChanged: {
        fontSize: 20,
        color: 'rgb(0,8,53)',
        fontWeight: '',
        textShadowColor: 'rgba(0, 0, 0, 0.0)',


    },

    plus: {
        fontSize: 20,
        paddingTop: 3,
        borderRadius: 5,
        color: 'white',
        backgroundColor: 'red',
        marginRight: 2,
        width: 30,
        height: 30,
        textAlign: "center",
        margin: 10,
        marginLeft: 70
    },

    cuaHangList: {
        flexGrow: 1,
        flexDirection: 'column',
        width: 440,
        marginLeft: -70
    },
    monAnList: {
        flexGrow: 1,
        flexDirection: 'column',
        width: 479,
        marginLeft:-10

    },
    monAnItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        backgroundColor: '#f0f0f0',
        paddingTop: 10,
        borderRadius: 8,
        marginLeft: 18
    },
    logoImg: {
        width: '100%',
        height: 100,
        margin: 5,
        borderRadius: 5,
        borderWidth: 2,
    },
    horizontalPopularBrand: {
        flexDirection: 'row',
        alignItems: "center",
        textAlign: "center",
        marginRight: 30,
        width: 130,
        height: 180,
        paddingTop: 2,
    },
    horizontalPopularItem: {
        flexDirection: 'column',
        // borderWidth: 1,
        // borderColor: '#ccc',
        // borderRadius:9,
        marginRight: 30,
        width: 700,
        paddingTop: 2,
    },
    categoryPrice: {
        fontSize: 14,
        paddingLeft: 12,
        color: 'gray',
    },
    categoryName: {
        fontSize: 16,
        fontWeight: 'bold',
        width: 130,
        paddingLeft: 12
    },
    monAnImg: {
        width: 100,
        height: 100,
        borderRadius: 10,
        marginRight: 10,
    },
    textTitleMonAn: {
        fontSize: 20,
        marginLeft: 10,
        padding: 13,
        color: "rgb(0,128,208)",
        fontWeight: 'bold',
        textShadowColor: 'rgba(0, 0, 0, 0.1)',
        textShadowOffset: { width: 4, height: 1 },
        textShadowRadius: 2


    },
    textTitleCuaHang: {
        fontSize: 20,
        marginLeft: 10,
        padding: 13,
        color: "rgb(0,128,208)",
        fontWeight: 'bold',
        textShadowColor: 'rgba(0, 0, 0, 0.1)',
        textShadowOffset: { width: 4, height: 1 },
        textShadowRadius: 2


    },
    titles: {
        marginLeft: 20,
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 10,
    },
    searchInput: {
        fontSize: 16,
        paddingHorizontal: 10,
    },
    glassImg: {
        width: 30,
        height: 30,
        marginRight: 10,
    },
    searchBar: {
        position: 'absolute',
        top: -40,
        left: 10,
        right: 10,
        backgroundColor: 'rgba(255, 255, 255, 1.1)',
        borderRadius: 5,
        padding: 5,
        flexDirection: 'row',

    },
    imageContainerSecond: {
        marginTop: 2,
        height: 600
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        // marginTop: 90,
    },
    containerSearch: {
        flex: 1,
        backgroundColor: '#fff',
        marginTop: 90,
    }


});

export default Search;
