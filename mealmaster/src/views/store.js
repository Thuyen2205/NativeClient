import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, ScrollView, TextInput, SafeAreaView, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import { useAuth } from './authContext';


const Store = ({ route }) => {
    const [follow, setFollow] = useState([]);
    const { isAuthenticated, userData } = useAuth();
    const [products, setProducts] = useState([]);
    const [store, setStore] = useState([]);

    const [menu, setMenu] = useState([]);
    const [isFollowing, setIsFollowing] = useState(false);
    const { categoryId } = route.params;
    // const { accountData } = route.params;
    // console.log(categoryId);
    const getStoreAPI = () => {
        fetch(`http://10.0.2.2:8000/taikhoans/${categoryId}/`)
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
    const getMenuAPI = () => {
        fetch(`http://10.0.2.2:8000/taikhoans/${categoryId}/menus/`)
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
        fetch(`http://10.0.2.2:8000/taikhoans/${categoryId}/monans/`)
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
    const getFollowAPI = () => {
        fetch("http://10.0.2.2:8000/follow/")
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                setFollow(data);
            })
            .catch((err) => {
                console.error('There was a problem with the fetch operation:', err);
            });
    };

    const voucherData = [
        { id: '1', ten_voucher: 'Giảm 100k, thêm nhiều ứu đãi khác', hinh_anh: require('../img/voucher6.png') },
        { id: '2', ten_voucher: 'Giảm 50k, giảm thẳng ngay và luôn', hinh_anh: require('../img/voucher5.png') },
        { id: '3', ten_voucher: 'Giảm 10k, từ đơn 0đ', hinh_anh: require('../img/voucher4.png') },
        { id: '4', ten_voucher: 'Giảm 10k, từ đơn 0đ', hinh_anh: require('../img/voucher3.png') },
        { id: '5', ten_voucher: 'Giảm 10k, từ đơn 0đ', hinh_anh: require('../img/voucher2.png') },
        { id: '6', ten_voucher: 'Giảm 10k, từ đơn 0đ', hinh_anh: require('../img/voucher1.png') },
    ];

    const navigation = useNavigation();
    const handleItem = (itemId) => {
        navigation.navigate('Item', { itemId: itemId });
    };
    const handleMenu = (itemId) => {
        navigation.navigate('Menu', { itemId: itemId });
    };

    const handleFollow = async () => {
        const isFollowing = follow.some(item => item.nguoi_dung_id === userData[0].id && item.cua_hang === categoryId);

        try {
            if (isFollowing) {
                const itemToDelete = follow.find(item => item.nguoi_dung_id === userData[0].id && item.cua_hang === categoryId);

                const response = await axios.delete(
                    `http://10.0.2.2:8000/follow/${itemToDelete.id}/`,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                );
                alert(" Hủy Follow thành công: ")

            } else {
                const response = await axios.post(
                    "http://10.0.2.2:8000/follow/",
                    {
                        cua_hang: categoryId,
                    },
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                );
                alert("Follow thành công: ")
            }

            getFollowAPI();

        } catch (error) {
            console.error('API error:', error);
        }
    };

    useEffect(() => {
        getFollowAPI();
        getStoreAPI();
        getProductsAPI();
        getMenuAPI();

    }, []);
    const textFollow = follow.some(item => item.nguoi_dung_id === userData[0].id && item.cua_hang === categoryId);

    return (
        <ScrollView>

            <View style={styles.container}>
                <Image
                    source={require('../img/lo_go_phuc_long.png')}
                    style={styles.itemImage}
                    resizeMode="cover"
                />

            </View>
            <>
                <View style={styles.container}>
                    <View style={styles.rowContainer}>
                        <Image style={styles.horizontalItemImage}
                            source={require('../img/9.png')} />
                        <Text style={styles.Text}>{store.ten_nguoi_dung}</Text>
                    </View>
                    <View style={styles.customRow}>
                        <View style={styles.rowContainer}>
                            <TouchableOpacity style={styles.customFollow} onPress={handleFollow}>
                                <Text style={styles.customFollowText}>
                                    {textFollow ? 'Hủy Follow' : 'Follow'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.rowContainer}>
                            <TouchableOpacity style={styles.customReview}>
                                <Text style={styles.customFollowText}>
                                    Đánh giá
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>
            </>




            <View style={styles.container}>
                <View style={styles.rowContainer}>
                    <View style={styles.rating}>
                        <Image source={require('../img/star.png')} style={[styles.binhLuanImg]} resizeMode="cover" />
                        <Text style={styles.danhGia}>4.6</Text>
                        <View style={styles.line}></View>
                        <Text style={styles.luotDanhGia}>448 <Text style={styles.danhGiaDivider}>Đánh giá</Text></Text>
                    </View>

                    <View style={styles.rating}>
                        <Image source={require('../img/point.png')} style={[styles.binhLuanImg]} resizeMode="cover" />
                        <View style={styles.line}></View>

                        <Text style={styles.khoangCach}>0.6 <Text>Km</Text></Text>
                    </View>

                </View>
            </View>

            <View style={styles.lineNgang}></View>


            <View style={styles.container}>
                <View style={styles.rowContainer}>
                    <Image source={require('../img/voucher.png')} style={[styles.voucherImg]} resizeMode="cover" />

                    <Text style={styles.Text}>Ưu đãi cho bạn</Text>

                </View>
            </View>


            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                {voucherData.map((category) => (
                    <View style={styles.voucherItem} key={category.id}>
                        <Image source={category.hinh_anh} style={[styles.monAnImg]} resizeMode="cover" />
                        <View>
                            <Text style={styles.categoryName}>{category.ten_voucher}</Text>
                        </View>
                        <View style={styles.line}></View>
                        <TouchableOpacity>
                            <Text style={styles.voucherThem}>Thêm</Text>
                        </TouchableOpacity>
                    </View>
                ))}


                {/* ... */}
            </ScrollView>

            <View style={styles.lineNgang}></View>

            <View style={styles.container}>
                <View style={styles.rowContainer}>
                    <Text style={styles.Text}>Thực đơn</Text>

                </View>
            </View>

            <View style={styles.imageContainer}>
                <View style={styles.searchBar}>
                    <Image
                        source={require('../img/magnifying_glass.png')}
                        style={styles.glassImg}
                        resizeMode="cover"
                    />
                    <TextInput
                        placeholder="Hòa nhịp giáng sinh, up to 50%..."
                        style={styles.searchInput}
                    />
                </View>
            </View>

            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                {menu.map(category => (

                    <TouchableOpacity style={styles.voucherItem} onPress={() => handleMenu(category.id)}>
                        <Image
                            style={styles.monAnImg}
                            source={{ uri: category.hinh_anh }}
                        />
                        {/* <Image source={category.hinh_anh} style={[styles.monAnImg]} resizeMode="cover" /> */}
                        <View>
                            <Text style={styles.categoryName}>{category.tieu_de}</Text>
                        </View>
                        <View style={styles.line}></View>

                        <TouchableOpacity>
                            <Text style={styles.voucherThem}>Thêm</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>

                    // </View>
                ))}

            </ScrollView>



            <ScrollView contentContainerStyle={styles.monAnList}>
                {products.map(category => (
                    <View style={styles.monAnItem} key={category.id}>
                        {category.hinh_anh !== '' && (
                            
                            // <Image source={category.hinh_anh} style={[styles.monAnImg]} resizeMode="cover" />
                            <Image
                            style={styles.monAnImg}
                            source={{ uri: category.hinh_anh }}
                        />
                        )}
                        <TouchableOpacity onPress={() => handleItem(category.id)}>
                            <View style={styles.textContainerTenMonAn}>
                                <Text style={styles.categoryName}>{category.ten_mon_an}</Text>
                                <Text style={styles.categoryPrice}>{category.gia_mon_an}</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity  onPress={() => handleItem(category.id)}>
                            <Text style={styles.plus}>+</Text>

                        </TouchableOpacity>


                    </View>
                ))}
            </ScrollView>
        </ScrollView>


    );
};
const styles = StyleSheet.create({
    customReview: {
        backgroundColor: '#FF483D',
        marginLeft: 120,
        width: 120,
        paddingLeft: 34,
        padding: 10,
        borderRadius: 10,
    },
    customRow: {
        display: 'flex',
        flexDirection: 'row',
        // justifyContent:'space-between'
    },
    customFollowText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    customFollow: {
        backgroundColor: '#FF483D',
        marginLeft: 20,
        width: 140,
        // height:20
        paddingLeft: 40,
        // color:'#fff',
        padding: 10,
        borderRadius: 10,
    },
    horizontalItemImage: {
        width: 50,
        height: 50,
        borderRadius: 10,
        borderWidth: 2,
        marginLeft: 16,

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
    textContainer: {
        flex: 1,
        flexDirection: 'column',
    },
    monAnItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        backgroundColor: '#f0f0f0',
        padding: 10,
        marginLeft:-10,
        borderRadius: 8,
    },
    monAnList: {
        flexGrow: 1,
        flexDirection: 'column',
        padding: 10,
    },
    scrollLoaiThucAn: {
        borderWidth: 1,
        borderColor: '#ccc',
    },
    textContainer: {
        textAlign: "center",
        paddingLeft: 80,
        paddingTop: 6,

    },
    textContainerTenMonAn: {
        textAlign: "center",
        paddingLeft: 20,
        paddingTop: 6,

    },
    loaiThucAnItem: {
        width: 170,
        height: 30,
        fontSize: 24,
        // marginLeft: 20,
        borderWidth: 0.3,
        borderColor: '#ccc',
        // backgroundColor:'#444',
        // borderRadius: 10,
        alignItems: "center",
    },
    searchInput: {
        fontSize: 16,
        paddingHorizontal: 10,
    },
    glassImg: {
        width: 20,
        height: 20,
        marginRight: 10,
    },
    searchBar: {
        position: 'absolute',
        top: -40,
        left: 2,
        right: 10,
        backgroundColor: 'rgba(255, 255, 255, 1.1)',
        borderRadius: 5,
        padding: 5,
        flexDirection: 'row',
        alignItems: "center",
        marginLeft: -3,
        width: '100%',

    },
    imageContainer: {
        marginBottom: 2,
        position: 'relative',
        marginTop: 40,
    },
    voucherThem: {
        padding: 10,
        marginRight: 10,
        fontWeight: 'bold',

    },
    categoryName: {
        width: 120,
        fontWeight: 'bold',

    },
    lineNgang: {
        borderBottomColor: 'gray',
        marginBottom: 8,
    },

    monAnImg: {
        width: 100,
        height: 90,
        borderRadius: 9,
        marginRight: 0,
        // marginLeft
    },
    voucherItem: {
        flexDirection: 'row',
        alignItems: "center",
        marginRight: 15,
        marginLeft: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 9
    },
    voucherImg: {
        width: 40,
        height: 20,
        borderRadius: 40,
        marginLeft: 12
    },
    luotDanhGia: {
        paddingLeft: 5,
    },
    line: {
        height: 15,
        width: 1,
        backgroundColor: 'gray',
        marginHorizontal: 2,
    },

    danhGiaDivider: {
        fontSize: 12,
        color: 'gray',
        paddingHorizontal: 5,
        paddingLeft: 4,
    },
    rating: {
        marginLeft: 30,
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 5,
        paddingLeft: 2,
        marginLeft: 14
        // width:120,
        // padding:20
    },
    binhLuanImg: {

        width: 20,
        height: 20,
        borderRadius: 40,
        marginRight: 5,
        // marginLeft:30,

    },
    danhGia: {
        paddingRight: 5,

    },
    khoangCach: {
        paddingLeft: 15,
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,

    },
    Text: {
        fontSize: 20,
        fontWeight: 'bold',
        paddingLeft: 15,
        paddingTop: 10,
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    itemImage: {
        width: 400,
        height: 300,
        marginRight: 10,
    }

});

export default Store;
