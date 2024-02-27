import React, { useRef, useEffect, useState, createContext } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TextInput, TouchableOpacity, FlatList, Button } from "react-native";
import { useNavigation } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import { useAuth } from './authContext';
import { useCart } from './cartContext';


import axios from 'axios';
import Item from './item';
// export const MyContext = createContext()

const Home = ({ route }) => {
    const navigation = useNavigation();
    const { logout } = useAuth();
    const [mapLayout, setMapLayout] = useState(true);
    const { nearbyStores, setNearbyStores } = useCart();
    const [timkiem, setTenMonAn] = useState('');
    const [monan, setMonAn] = useState([]);
    const { isAuthenticated, userData } = useAuth();
    const [products, setProducts] = useState([]);
    const [loaithucan, setLoaiThucAn] = useState([]);
    const [cuahang, setCuaHang] = useState([]);
    const [menu, setMenu] = useState([]);
    const [thoigianban, setThoiGianBan] = useState([]);
    const [thoidiem, setThoiDiem] = useState([]);
    const [monanhientai, setMonAnHienTai] = useState([]);
    const [menuhientai, setMenuHienTai] = useState([]);
    const [store, setStore] = useState([]);

    const getStoreNearAPI = () => {
        fetch("http://10.0.2.2:8000/taikhoans/loai-tai-khoan-2/")
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                setStore(data);
            })
            .catch((err) => {
                console.error('There was a problem with the fetch operation:', err);
            });
    };
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
    const handleMenu = (itemId) => {
        navigation.navigate('Menu', { itemId: itemId });
    };
    const handleLogout = () => {
        logout();
        navigation.navigate('Login');
    };
    const getMenuHienTaiAPI = () => {
        fetch("http://10.0.2.2:8000/menuhientai/")
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                setMenuHienTai(data);
            })
            .catch((err) => {
                console.error('There was a problem with the fetch operation:', err);
            });
    };


    const getMonAnHienTaiAPI = () => {
        fetch("http://10.0.2.2:8000/monanhientai/")
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                setMonAnHienTai(data);
            })
            .catch((err) => {
                console.error('There was a problem with the fetch operation:', err);
            });
    };



    const getThoiDiemAPI = () => {
        fetch("http://10.0.2.2:8000/thoidiem/")
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                setThoiDiem(data);
            })
            .catch((err) => {
                console.error('There was a problem with the fetch operation:', err);
            });
    };

    const getThoiGianBanAPI = () => {
        fetch("http://10.0.2.2:8000/thoigianban/")
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                setThoiGianBan(data);
            })
            .catch((err) => {
                console.error('There was a problem with the fetch operation:', err);
            });
    };

    const getMenuAPI = () => {
        fetch("http://10.0.2.2:8000/menu/")
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

    const getProductsAPI = () => {
        fetch("http://10.0.2.2:8000/monan/")
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                setProducts(data);
            })
            .catch((err) => {
                console.error('There was a problem with the fetch operation:', err);
            });
    };
    const getLoaiThucAnAPI = () => {
        fetch("http://10.0.2.2:8000/loaithucan/")
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                setLoaiThucAn(data);
            })
            .catch((err) => {
                console.error('There was a problem with the fetch operation:', err);
            });
    };
    const getCuaHangAPI = () => {
        fetch("http://10.0.2.2:8000/taikhoans/")
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
    const lat = parseFloat(userData[0].vi_do)
    const long = parseFloat(userData[0].kinh_do)

    useEffect(() => {
        getLoaiThucAnAPI();
        getProductsAPI();
        getCuaHangAPI();
        getMenuAPI();
        getThoiGianBanAPI();
        getMonAnHienTaiAPI();
        getMenuHienTaiAPI();
        getStoreNearAPI();
        if (mapLayout ) {
            const nearbyStoresWithDistance = store.map((store) => {
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

    }, [mapLayout, store,lat, long]);


    const handleItem = (itemId) => {
        navigation.navigate('Item', { itemId: itemId });
    };

    const handleStore = (categoryId) => {
        navigation.navigate('Store', { categoryId });
    };
    const handleSearch = () => {
        navigation.navigate('Search', { timkiem });
        setTenMonAn('');

    };

    const handleMap = () => {
        navigation.navigate('Map');

    }

    const scrollViewRef = useRef(null);


    return (
        <>
            <ScrollView>
                <View style={styles.fixed}>
                    <View style={styles.header}>
                        <View style={styles.btnDangXuat}>
                            <TouchableOpacity style={styles.boxDangXuat} onPress={handleLogout}>
                                <Text style={styles.textDangXuat}>Đăng xuất</Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.headerText}>MealMaster</Text>
                        <Text>{userData[0].ten_nguoi_dung}</Text>


                    </View>


                    <View style={styles.imageContainer}>
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
                                value={timkiem}
                                onChangeText={(text) => setTenMonAn(text)}
                            />
                        </View>
                    </View>
                </View>

                <View>
                    <ScrollView>
                        <View style={styles.container}>
                            <Image
                                source={require('../img/banner_food.jpg')}
                                style={styles.itemImageBanner}
                                resizeMode="cover"
                            />

                            <TouchableOpacity style={styles.boxMap} onPress={handleMap}>
                                <Text style={styles.boxMapText}>Tìm xung quanh</Text>
                            </TouchableOpacity>
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Món Ăn Phổ Biến </Text>

                                
                                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                                    {loaithucan.map((product) => (
                                        <View style={styles.horizontalPopularItem}>
                                            <View key={product.id}>
                                                
                                                <Image
                                                    style={styles.horizontalItemImage}
                                                    source={{ uri: product.hinh_anh }}
                                                />
                                                <Text style={styles.itemName}>{product.ten_loai_thuc_an}</Text>
                                            </View>
                                        </View>
                                    ))}

                                </ScrollView>
                            </View>

                            <View style={styles.lineNgang}></View>

                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Cửa Hàng Pổ Biến </Text>

                                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>

                                    {cuahang.filter(category => category.loai_tai_khoan === 2)
                                        .map(category => (
                                            <TouchableOpacity onPress={() => handleStore(category.id)} style={[styles.horizontalPopularItem, styles.horizontalPopularBrand]} key={category.id}>

                                                <Image
                                                    style={styles.horizontalItemImageBrand}
                                                    source={{ uri: category.avatar }}
                                                />
                                                <View style={styles.categoryTextContainer}>
                                                    <Text style={styles.categoryNameBrand}>{category.ten_nguoi_dung}</Text>
                                                    <View style={styles.container}>
                                                        <View style={styles.rowContainer}>
                                                            <View style={styles.rating}>
                                                                <Image source={require('../img/star.png')} style={[styles.binhLuanImg]} resizeMode="cover" />
                                                                <Text style={styles.danhGia}>4.6</Text>
                                                                <View style={styles.line}></View>
                                                                <Text style={styles.luotDanhGia}>448 <Text style={styles.danhGiaDivider}>Đánh giá</Text></Text>
                                                            </View>


                                                        </View>
                                                    </View>
                                                </View>


                                            </TouchableOpacity>


                                        ))}

                                    {/* ... */}
                                </ScrollView>
                            </View>
                            {/* <View style={styles.lineNgang}></View> */}



                            <View style={styles.containerScroll}>
                                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollViewContent} ref={scrollViewRef}
                                >
                                    <View style={[styles.imageContainer, styles.imageContainerSecond]}>
                                        <Image
                                            source={require('../img/banner_food5.jpg')}
                                            style={styles.itemImageBanner}
                                            resizeMode="cover"
                                        />
                                    </View>
                                    <View style={[styles.imageContainer, styles.imageContainerSecond]}>
                                        <Image
                                            source={require('../img/banner_food2.jpg')}
                                            style={styles.itemImageBanner}
                                            resizeMode="cover"
                                        />
                                    </View>
                                    <View style={[styles.imageContainer, styles.imageContainerSecond]}>
                                        <Image
                                            source={require('../img/banner_food.jpg')}
                                            style={styles.itemImageBanner}
                                            resizeMode="cover"
                                        />
                                    </View>
                                    <View style={[styles.imageContainer, styles.imageContainerSecond]}>
                                        <Image
                                            source={require('../img/banner_food3.jpg')}
                                            style={styles.itemImageBanner}
                                            resizeMode="cover"
                                        />
                                    </View>
                                    <View style={[styles.imageContainer, styles.imageContainerSecond]}>
                                        <Image
                                            source={require('../img/banner_food4.jpg')}
                                            style={styles.itemImageBanner}
                                            resizeMode="cover"
                                        />
                                    </View>

                                </ScrollView>

                                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                                    {menuhientai.map(category => (
                                        <TouchableOpacity onPress={() => handleMenu(category.id)}>

                                            <View style={styles.voucherItem} key={category.id}>
                                                <Image
                                                    style={styles.monAnImg}
                                                    resizeMode="cover"
                                                    source={{ uri: category.hinh_anh }}
                                                />
                                                <View>
                                                    <Text style={styles.categoryName}>{category.tieu_de}</Text>
                                                </View>
                                                <View style={styles.line}></View>

                                                <TouchableOpacity>
                                                    <Text style={styles.voucherThem}>Thêm</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </TouchableOpacity>

                                    ))}


                                    {/* ... */}
                                </ScrollView>

                                <ScrollView contentContainerStyle={styles.monAnList}>
                                    {monanhientai.map((category) => {
                                        return (
                                            <View key={category.id} style={styles.monAnItem}>
                                                <Image
                                                    style={styles.monAnImg}
                                                    resizeMode="cover"
                                                    source={{ uri: category.hinh_anh }}
                                                />
                                                <TouchableOpacity onPress={() => handleItem(category.id)}>
                                                    <View style={styles.textContainerTenMonAn}>
                                                        <Text style={styles.categoryName}>{category.ten_mon_an}</Text>
                                                        <Text style={styles.categoryPrice}>{category.gia_mon_an}<Text>VND</Text></Text>
                                                    </View>
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={() => handleItem(category.id)} >
                                                    <Text style={styles.plus}>+</Text>
                                                </TouchableOpacity>
                                            </View>
                                        );
                                    })}
                                </ScrollView>

                            </View>





                        </View >
                    </ScrollView >
                </View>

            </ScrollView >


        </>

    );
};
const styles = StyleSheet.create({
    textDangXuat: {
        color: 'white'
    },
    btnDangXuat: {
        backgroundColor: 'red',
        borderRadius: 10,
        height: 30,
        width: 90,
        marginLeft: 300,
        position: 'relative',
        justifyContent: 'center',
        textAlign: 'center',
        alignItems: 'center',
        display: 'flex'
        // marginBottom:200,
        // marginBottom:-100,

    },
    boxMap: {
        backgroundColor: '#1DB954',
        width: '100%',
        height: 50,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5,
        marginTop: 5,
        // borderRadius: 10,
        // marginLeft: 30,
    },
    boxMapText: {
        fontSize: 25,
        fontWeight: 'bold',
    },
    voucherThem: {
        padding: 10,
        marginRight: 10,
        fontWeight: 'bold',

    },
    monAnImg: {
        width: 100,
        height: 90,
        borderRadius: 9,
        marginRight: 0,
    },
    voucherItem: {
        flexDirection: 'row',
        alignItems: "center",
        marginRight: 15,
        marginLeft: 12,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 9
    },
    ratingKhoangCach: {
        width: 90
    },

    danhGiaDivider: {
        fontSize: 12,
        color: 'gray',
        paddingHorizontal: 5,
        paddingLeft: 4,
    },
    line: {
        height: 15,
        width: 1,
        backgroundColor: 'gray',
        marginHorizontal: 2,
    },
    luotDanhGia: {
        paddingLeft: 5,
    },
    danhGia: {
        paddingRight: 5,

    },
    khoangCach: {
        paddingLeft: 5,
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
        flexDirection: 'column',
        marginBottom: 10,
        backgroundColor: '#f0f0f0'

    },


    categoryTextContainer: {
        flex: 1,
        alignItems: 'center',
        marginTop: 5,
    },
    lineNgang: {
        borderBottomColor: 'gray',
        marginBottom: 8,
    },
    plus: {
        fontSize: 20,
        paddingTop: 3,
        borderRadius: 5,
        color: 'white',
        backgroundColor: 'red',
        marginRight: 2,
        width: 33,
        height: 33,
        textAlign: "center",
        margin: 10,
        marginLeft: 50,
        // marginRight:20
    },

    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    searchIcon: {
        marginRight: 5,
    },
    header: {
        paddingTop: 40,
        paddingBottom: 20,
        backgroundColor: '#1DB954',
        alignItems: 'center',
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'rgb(18,18,18)',
    },
    imageContainer: {

        marginBottom: 2,
        position: 'relative',
        marginTop: 40
    },
    bannerImage: {
        width: '100%',
        height: 200,
    },
    horizontalPopularItem: {
        flexDirection: 'column',
        marginRight: 40,
        width: 100,
        // paddingTop: 2,
    },
    horizontalPopularBrand: {
        flexDirection: 'column',
        alignItems: "center",
        textAlign: "center",
        justifyContent: 'flex-start',
        marginRight: 30,
        width: 130,
        height: 200,
        paddingTop: 2,
        marginBottom: 20,
    },
    horizontalItemImageBrand: {
        width: '110%',
        height: 140,
        borderRadius: 10,
        borderWidth: 2,
        marginLeft: 12

    },
    horizontalItemImage: {
        width: 120,
        height: 100,
        borderRadius: 10,
        borderWidth: 2,
        // marginRight:10,
        // marginLeft:8

    },
    searchBar: {
        position: 'absolute',
        top: -40,
        left: 1,
        right: 10,
        backgroundColor: 'rgba(255, 255, 255, 1.1)',
        borderRadius: 5,
        padding: 5,
        flexDirection: 'row',

    },
    searchInput: {
        fontSize: 16,
        paddingHorizontal: 10,
    },
    section: {
        paddingHorizontal: 20,
        marginBottom: 2,
        backgroundColor: '#f0f0f0',
        marginTop: 0


    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: 'rgb(18,18,18)',
        textAlign: 'center',
        padding: 10,

    },
    popularItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    itemImage: {
        width: 400,
        height: 80,
        marginRight: 10,
    },
    itemImageBanner: {
        width: 400,
        height: 200,
        marginRight: 10,
    },
    itemName: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 10,
        padding: 10,
        color: 'rgb(18,18,18)',


    },
    imageContainerSecond: {
        marginTop: 2,
        height: 200
    },
    categoryList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    categoryItem: {
        width: '45%',
        marginVertical: 10,
        marginHorizontal: '2.5%',
        backgroundColor: '#f0f0f0',
        padding: 35,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    categoryNameBrand: {
        fontSize: 16,
        fontWeight: 'bold',
        width: 150,
        marginLeft: 20
    },
    categoryName: {
        fontSize: 16,
        fontWeight: 'bold',
        width: 130,
        // marginLeft:20
    },
    logoImg: {
        width: '100%',
        height: 120,
        margin: 5,
        borderRadius: 5,
        borderWidth: 2,
    },
    glassImg: {
        width: 20,
        height: 20,
        marginRight: 10,
    },
    monAnList: {
        flexGrow: 1,
        flexDirection: 'column',
        padding: 10,
    },
    monAnItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        backgroundColor: '#f0f0f0',
        padding: 10,
        borderRadius: 8,
    },
    monAnImg: {
        width: 110,
        height: 100,
        borderRadius: 9,
        marginRight: 20,
    },
    textContainer: {
        flex: 1,
        flexDirection: 'column',
    },
    categoryPrice: {
        fontSize: 14,
        color: 'gray',
    },
});

export default Home;
