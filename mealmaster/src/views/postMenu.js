import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TextInput, TouchableOpacity, FlatList } from "react-native";
import { useNavigation } from '@react-navigation/native';

import axios from 'axios';

const PostMenu = ({ route }) => {
    const {  menuId, userId, thoidiem } = route.params;
    const [soLuong, setSoLuong] = useState(0);
    const [addedCategories, setAddedCategories] = useState([]);
    const [products, setProducts] = useState([]);

    const [isThoiDiemVisible, setThoiDiemVisible] = useState(false);
    const [selectedThoiDiem, setSelectedThoiDiem] = useState(null);
    const [thoigianban, setThoiGianBan] = useState([]);
    const [chitietmenu, setChiTietMenu] = useState([]);

    const getProductsAPI = () => {
        fetch(`http://10.0.2.2:8000/taikhoans/${userId}/monans/`)
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
    const getChiTietMenuAPI = () => {
        fetch("http://10.0.2.2:8000/chitietmenu/")
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                setChiTietMenu(data);

            })
            .catch((err) => {
                console.error('There was a problem with the fetch operation:', err);
            });
    };
    // console.log(thoigianban);
    const openThoiDiem = () => {
        // console.log('Thoi diem khi click:', thoidiem);
        setThoiDiemVisible(true);
    };


    const closeThoiDiem = () => {
        setThoiDiemVisible(false);
    };

    const handleSearch = () => {
        navigation.navigate('Search');
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
    const handleSoLuong = (categoryId, action) => {
        setSoLuong(prevState => {
            const currentSoLuong = prevState[categoryId] || 0;

            if (action === 'increase') {
                return { ...prevState, [categoryId]: currentSoLuong + 1 };
            } else if (action === 'decrease' && currentSoLuong > 0) {
                return { ...prevState, [categoryId]: currentSoLuong - 1 };
            }

            return prevState;
        });
    };


    const handleAddMonAn = async (categoryId) => {
        try {
            if (menuId === '') {
                alert('Vui lòng điền đầy đủ thông tin đăng ký');
            } else {
                const response = await axios.post(
                    "http://10.0.2.2:8000/chitietmenu/",
                    {
                        menu: menuId,
                        so_luong: soLuong[categoryId],
                        mon_an: categoryId, // Lưu categoryId vào mon_an
                    },
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                );
                setAddedCategories(prevAddedCategories => [...prevAddedCategories, categoryId]);

                alert('Thêm món ăn thành công!');
            }
        } catch (error) {
            console.error("Thêm món ăn thất bại:", error);
            console.log("Error details:", error.response.data);
        }
    };
    const createChiTietMenu = async (thoiDiemId) => {
        try {
            const response = await axios.post(
                "http://10.0.2.2:8000/thoigianban/",
                {
                    thoi_diem: thoiDiemId,
                    menu: menuId
                },
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        // Các header khác nếu cần
                    },
                }
            );

            console.log('API Post thành công:', response.data);
        } catch (error) {
            console.error('API Post thất bại:', error);
            console.log('Error details:', error.response.data);
        }
    };

    useEffect(() => {
        getThoiGianBanAPI();
        getProductsAPI();
        getChiTietMenuAPI();
    }, []);
    const isMenuInThoigianban = (menuId, thoigianban) => {
        return thoigianban.some(item => item.menu === menuId);
    };
    const updateThoigianban = async (menuId, thoiDiemId) => {
        try {
            const thoigianbanId = thoigianban.find(item => item.menu === menuId).id;

            const response = await axios.put(
                `http://10.0.2.2:8000/thoigianban/${thoigianbanId}/`,
                {
                    thoi_diem: thoiDiemId,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        // Các headers khác nếu cần
                    },
                }
            );

            alert("Cập nhật thời gian bán thành công");
            setThoiGianBan((prev) => prev.map(item => (item.id === thoigianbanId ? response.data : item)));

        } catch (error) {
            console.error('UPDATE FAILED:', error);
        }
    };
    const createThoigianban = async (menuId, thoiDiemId) => {
        try {

            const response = await axios.post(
                'http://10.0.2.2:8000/thoigianban/',
                {
                    menu: menuId,
                    thoi_diem: thoiDiemId,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            alert("Khởi tạo thời gian bán thành công");
            setThoiGianBan((prev) => [...prev, response.data]);

        } catch (error) {
            console.error('CREATE FAILED:', error);
        }
    };

    const handleSelectThoiDiem = async (item) => {
        // console.log('Chọn thời điểm:', item.ten_buoi);
        setSelectedThoiDiem(item.ten_buoi);

        if (isMenuInThoigianban(menuId, thoigianban)) {
            await updateThoigianban(menuId, item.id);
        } else {
            await createThoigianban(menuId, item.id);
        }

        closeThoiDiem();
    };


    return (
        <>

            <View style={styles.fixed}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>MealMaster</Text>
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
                        />
                    </View>
                </View>
            </View>
            <View style={styles.headerHeld}>
                <Text style={styles.headerText}>Thêm món ăn vào menu</Text>
            </View>

            <ScrollView horizontalScrollView={true} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.monAnList}>
                {products.filter(category => !addedCategories.includes(category.id))
                    .filter(category => !chitietmenu.some(item => item.mon_an === category.id && item.menu ===  menuId))
                    .map((category) => (
                        <View style={styles.monAnItem}>
                             <Image
                                    style={styles.monAnImg}
                                    source={{ uri: category.hinh_anh }}
                                />
                            {/* <Image style={styles.monAnImg}
                                source={require('../img/matcha_da_xay.jpg')} /> */}
                            <TouchableOpacity onPress={() => handleItem(category.id, products)}>
                                <View style={styles.textContainerTenMonAn}>
                                    <Text style={styles.categoryName}>{category.ten_mon_an}</Text>
                                    <Text style={styles.categoryPrice}>{category.gia_mon_an}<Text>VND</Text></Text>
                                </View>
                            </TouchableOpacity>
                            <Text style={styles.customSoLuong}>{soLuong[category.id] || 0}</Text>

                            <TouchableOpacity onPress={() => handleSoLuong(category.id, 'increase')}>
                                <Text style={styles.plus}>+</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => handleSoLuong(category.id, 'decrease')}>
                                <Text style={styles.minus}>-</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleAddMonAn(category.id)}>
                                <Text style={styles.add}>Add</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                <TouchableOpacity onPress={openThoiDiem}>
                    <Text style={styles.customThoiGianBan}>
                        {selectedThoiDiem ? selectedThoiDiem : 'Thời gian bán'}
                    </Text>
                </TouchableOpacity>

                {isThoiDiemVisible && (
                    <View style={styles.customBoxItems}>
                        <ScrollView>
                            {thoidiem.map((item) => (
                                <TouchableOpacity
                                    key={item.id}
                                    onPress={() => handleSelectThoiDiem(item)}
                                    style={styles.customItem}
                                >
                                    <Text style={styles.customTextItem}>{item.ten_buoi}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                )}
            </ScrollView>



        </>

    );
};
const styles = StyleSheet.create({
    customSoLuong: {
        fontWeight: 'bold'
    },
    customTextItem: {
        color: '#fff',
        alignItems: 'center',
        marginLeft: 74,
        fontWeight: 'bold',
    },
    customBoxItems: {
        marginLeft: 100,
        // marginBottom:90,
        marginTop: -70,
        borderRadius: 10,
        backgroundColor: '#1DB954',
        width: 200,
        borderRadius: 6,

    },
    customItem: {
        // backgroundColor: '#1DB954',
        width: 200,
        height: 40,
        paddingTop: 14,

    },
    customThoiGianBan: {
        marginLeft: 100,
        marginTop: 50,
        width: 200,
        height: 50,
        textAlign: 'center',
        // justifyContent:'center',
        // alignItems:'center',
        paddingTop: 15,
        color: "#fff",
        borderRadius: 10,
        backgroundColor: '#1DB954',
        fontWeight: 'bold',

    },
    minus: {
        fontSize: 20,
        paddingTop: 3,
        borderRadius: 5,
        color: 'white',
        backgroundColor: '#6B9389',
        marginRight: 2,
        width: 33,
        height: 33,
        textAlign: "center",
        margin: 10,
        // marginLeft: -60,
    },
    add: {
        fontSize: 20,
        paddingTop: 3,
        borderRadius: 5,
        color: 'white',
        fontWeight: 'bold',
        backgroundColor: '#6B9389',
        marginRight: 2,
        width: 53,
        height: 33,
        textAlign: "center",
        margin: 10,

        marginLeft: 20,
        // marginRight:20
    },
    optionText: {
        fontSize: 16,
        padding: 0,
        margin: 0,
    },
    optionsContainer: {
        // marginLeft:30,
        // margin:0,
        padding: 0,
    },
    boxTitle: {
        marginLeft: 100,
    },
    titleText: {
        fontSize: 26,
        fontWeight: 'bold',
        color: 'rgb(105,155,189)'
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
    plus: {
        fontSize: 20,
        paddingTop: 3,
        borderRadius: 5,
        color: 'white',
        backgroundColor: '#6B9389',
        marginRight: 2,
        width: 33,
        height: 33,
        textAlign: "center",
        margin: 10,
        marginLeft: -50,
        // marginRight:20
    },
    monAnImg: {
        width: 70,
        height: 70,
        borderRadius: 9,
        marginRight: 20,
    },
    monAnItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        backgroundColor: '#CAD7D6',
        padding: 10,
        borderRadius: 8,
    },
    monAnList: {
        flexGrow: 1,
        flexDirection: 'column',
        padding: 10,
    },
    return: {
        backgroundColor: '#1DB954',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: -40,
        width: 150,
        height: 50,
        marginLeft: 20,
    },
    inputContainerMenu: {
        display: 'flex',
        flexDirection: 'column',
        marginLeft: -220,
        // marginTop: 50,
    },
    inputContainer: {
        display: 'flex',
        flexDirection: 'column',
        marginLeft: -220,
        marginTop: 100,
    },
    boxContentMenu: {
        display: 'flex',
        flexDirection: 'row',
        marginLeft: '50',
        marginTop: 90,
    },
    boxContent: {
        display: 'flex',
        flexDirection: 'row',
        marginLeft: '50'
    },
    postConfirm: {
        backgroundColor: '#1DB954',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        width: 150,
        height: 50,
        marginLeft: 50,
    },
    iconLoaiThucAn: {
        width: 30,
        height: 30,
        marginRight: 10,
        marginLeft: -130,
    },
    icon: {
        width: 30,
        height: 30,
        marginRight: 10,
    },
    inputText: {
        height: 50,
    },
    alignIcon: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    inputViewLoaiThucAn: {
        width: 240,
        backgroundColor: '#rgb(255,255,255)',
        borderRadius: 25,
        height: 60,
        marginBottom: 20,
        marginLeft: 10,
        marginTop: 20,
        justifyContent: 'center',
        padding: 20,
        display: 'flex',
        flexDirection: 'row',
    },
    inputView: {
        width: 240,
        backgroundColor: '#rgb(255,255,255)',
        borderRadius: 25,
        height: 60,
        marginBottom: 20,
        marginLeft: 10,
        marginTop: 20,
        justifyContent: 'center',
        padding: 20,
    },
    postButtonMenu: {
        backgroundColor: 'rgb(209,87,29)',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: -90,
        width: 200,
        height: 50,
        marginLeft: 100,
    },

    postButton: {
        backgroundColor: 'rgb(209,87,29)',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        width: 200,
        height: 50,
        marginLeft: 100,
    },

    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
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
        left: 1,
        right: 10,
        backgroundColor: 'rgba(255, 255, 255, 1.1)',
        borderRadius: 5,
        padding: 5,
        flexDirection: 'row',

    },
    headerHeld: {
        // paddingTop: 40,
        paddingBottom: 20,
        backgroundColor: '#00BA22',
        alignItems: 'center',
        // height
    },
    header: {
        paddingTop: 40,
        paddingBottom: 20,
        backgroundColor: '#00BA22',
        alignItems: 'center',
        // height
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'rgb(0,30,58)',
        marginTop: 20,
        // marginBottom:20,
    },
    imageContainer: {
        marginBottom: 2,
        position: 'relative',
        marginTop: 40
    },

});

export default PostMenu;
