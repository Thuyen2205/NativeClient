import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Platform, TextInput, TouchableOpacity, FlatList } from "react-native";
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from './authContext';

import axios from 'axios';

const Post = ({ route }) => {
    const voucherData = [
        { id: '1', ten_voucher: 'Giảm 100k, thêm nhiều ứu đãi khác', hinh_anh: require('../img/voucher6.png') },
        { id: '2', ten_voucher: 'Giảm 50k, giảm thẳng ngay và luôn', hinh_anh: require('../img/voucher5.png') },
        { id: '3', ten_voucher: 'Giảm 10k, từ đơn 0đ', hinh_anh: require('../img/voucher4.png') },
        { id: '4', ten_voucher: 'Giảm 10k, từ đơn 0đ', hinh_anh: require('../img/voucher3.png') },
        { id: '5', ten_voucher: 'Giảm 10k, từ đơn 0đ', hinh_anh: require('../img/voucher2.png') },
        { id: '6', ten_voucher: 'Giảm 10k, từ đơn 0đ', hinh_anh: require('../img/voucher1.png') },
    ];

    const navigation = useNavigation();
    const { isAuthenticated, userData } = useAuth();
    const [follow, setFollow] = useState([]);
    const [cuahang, setCuaHang] = useState([]);
    const [isPostingFood, setIsPostingFood] = useState(false);
    const [tenMonAn, setTenMonAn] = useState('');
    const [giaMonAn, setGiaMonAn] = useState('');
    const [moTa, setMoTa] = useState('');
    const [soLuong, setSoLuong] = useState('');
    const [selectedLoaiThucAn, setSelectedLoaiThucAn] = useState(null);
    const [showLoaiThucAnOptions, setShowLoaiThucAnOptions] = useState(false);
    const [loaithucan, setLoaiThucAn] = useState([]);
    const [idLoaiThucAn, setIdLoaiThucAn] = useState(null);

    const [tenMenu, setTenMenu] = useState('');
    const [isPostingMenu, setIsPostingMenu] = useState(false);
    const [products, setProducts] = useState([]);
    const [menu, setMenu] = useState([]);

    const [thoidiem, setThoiDiem] = useState([]);
    const [showThoiDiemOptions, setShowThoiDiemOptions] = useState(false);
    const [selectedThoiDiem, setSelectedThoiDiem] = useState(null);
    const [categoryBeingSelected, setCategoryBeingSelected] = useState(null);

    const [selectedThoiDiemByCategory, setSelectedThoiDiemByCategory] = useState({});
    const [thoigianban, setThoiGianBan] = useState([]);
    const [hinhanh, setHinhAnh] = useState(null);

    // const { accountData } = route.params;
    const userId = userData[0].id;

    const getCuaHangAPI = () => {
        fetch("http://10.0.2.2:8000/taikhoans/loai-tai-khoan-1/")
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
                console.error('There was a problem with the fetch operation cuahang:', err);
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
                console.error('There was a problem with the fetch operation follow:', err);
            });
    };

    const postThoiGianBanAPI = async (categoryId, thoiDiemId) => {
        try {
            const response = await axios.post(
                "http://10.0.2.2:8000/thoigianban/",
                {
                    mon_an: categoryId,
                    thoi_diem: thoiDiemId,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            alert('Thêm thời gian thành công!');
            setThoiGianBan((prev) => [...prev, response.data]);

        } catch (error) {
            console.error('Lỗi khi tạo mới ThoiGianBan:', error.response.data);
        }
    };

    const putThoiGianBanAPI = async (categoryId, thoiDiemId) => {
        try {
            const thoigianbanId = thoigianban.find(item => item.mon_an === categoryId).id;

            const response = await axios.put(
                `http://10.0.2.2:8000/thoigianban/${thoigianbanId}/`,
                {
                    thoi_diem: thoiDiemId,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            alert('Cập nhật thời gian thành công!');
            setThoiGianBan((prev) => prev.map(item => (item.id === thoigianbanId ? response.data : item)));

        } catch (error) {
            console.error('Lỗi khi cập nhật ThoiGianBan:', error.response.data);
        }
    };

    const checkThoiGianBanExistence = (categoryId) => {

        const isExist = thoigianban.some(item => item.mon_an === categoryId);
        return isExist;
    };


    const handleSelectThoiDiem = async (thoiDiemItem) => {
        const isExist = checkThoiGianBanExistence(categoryBeingSelected);
        if (isExist) {
            await putThoiGianBanAPI(categoryBeingSelected, thoiDiemItem.id);

        } else {
            await postThoiGianBanAPI(categoryBeingSelected, thoiDiemItem.id);
        }

        setSelectedThoiDiemByCategory((prev) => ({
            ...prev,
            [categoryBeingSelected]: thoiDiemItem,
        }));
        setShowThoiDiemOptions(false);
    };


    const handleThoiGianBanClick = (categoryId) => {
        setShowThoiDiemOptions(!showThoiDiemOptions);
        setCategoryBeingSelected(categoryId);
    };
    const renderThoiDiemOptions = (categoryId) => {
        if (showThoiDiemOptions && categoryBeingSelected === categoryId) {
            return (
                <ScrollView style={styles.scrollView}>
                    {thoidiem.map((thoiDiemItem) => (
                        <TouchableOpacity
                            style={styles.setThoiDiem}
                            key={thoiDiemItem.id}
                            onPress={() => handleSelectThoiDiem(thoiDiemItem)}
                        >
                            <Text style={styles.thoiDiemItem}>{thoiDiemItem.ten_buoi}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            );
        }
        return null;
    };

    const handleSoLuongChange = (text) => {
        const sanitizedText = text.replace(/[^0-9]/g, '');
        setSoLuong(sanitizedText);
    };
    const handleGiaMonAnChange = (text) => {
        const sanitizedText = text.replace(/[^0-9.]/g, '');
        setGiaMonAn(sanitizedText);
    };
    const handleSelectLoaiThucAn = (thucAn) => {
        setSelectedLoaiThucAn(thucAn);
        setIdLoaiThucAn(thucAn.id);
        setShowLoaiThucAnOptions(false);
    };

    const handleLoaiThucAnPress = () => {
        setShowLoaiThucAnOptions(!showLoaiThucAnOptions);
    };
    const handleLoaiThucAnSelect = (itemValue) => {
        setSelectedLoaiThucAn(itemValue);
        setShowLoaiThucAnOptions(false);
    };
    const handleItem = (itemId) => {
        navigation.navigate('Item', { itemId: itemId });
    };
    const handleEditMenu = (itemId) => {
        navigation.navigate('PostMenu', { menuId: itemId, userId, thoidiem });
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
                console.error('There was a problem with the fetch operation thoigianban:', err);
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
                console.error('There was a problem with the fetch operation thoidiem:', err);
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
                console.error('There was a problem with the fetch operation loaithucan:', err);
            });
    };
    const getProductsAPI = () => {
        fetch(`http://10.0.2.2:8000/taikhoans/${userId}/monanAll/`)
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
                console.error('There was a problem with the fetch operation produc:', err);
            });
    };

    const getMenuAPI = () => {
        fetch(`http://10.0.2.2:8000/taikhoans/${userId}/menus/`)
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
                console.error('There was a problem with the fetch operation menu:', err);
            });
    };


    const handleSearch = () => {

        navigation.navigate('Search');
    };


    const handlePostFood = () => {
        setIsPostingFood(prevState => !prevState);
        setIsPostingMenu(false);

        if (!isPostingFood) {
            setTenMonAn('');
            setGiaMonAn('');
            setMoTa('');
            setSoLuong('');
            // setLoaiThucAn('');

        }
    };

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            console.log("Permission not granted");
            return;
        }
        const options = {
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        };
        let result;
        if (Platform.OS !== "web") {
            result = await ImagePicker.launchImageLibraryAsync(options);
        } else {
            result = await ImagePicker.launchImageLibraryAsync();
        }
        if (!result.canceled) {
            const localUri = result.assets[0].uri;
            setHinhAnh(localUri);
        } else {
            console.log("User canceled image picker");
        }
    };
    const handlePostMenu = () => {
        setIsPostingMenu((prevState) => !prevState);
        setIsPostingFood(false);

    };


    const handleconfirm = async () => {
        try {
            if (tenMonAn === '') {
                alert('Vui lòng điền đầy đủ thông tin đăng ký');
            } else {
                const formData = new FormData();
                formData.append('ten_mon_an', tenMonAn);
                formData.append('gia_mon_an', giaMonAn);
                formData.append('mo_ta', moTa);

                formData.append('so_luong', soLuong);
                formData.append('loai_thuc_an', idLoaiThucAn);
                formData.append('nguoi_dung', userData[0].id);

                formData.append('hinh_anh', {
                    uri: hinhanh,
                    name: 'hinhanh.jpg',
                    type: 'hinhanh/jpeg',
                });
                const response = await axios.post(
                    "http://10.0.2.2:8000/monan/", formData
                    ,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                );
                const nguoiDungCuahangArray = filteredFollow.map(followItem => {
                    const nguoiDungCuahang = cuahang.find(item => item.id === followItem.nguoi_dung_id);
                    return nguoiDungCuahang;
                });

                nguoiDungCuahangArray.forEach(async nguoiDungCuahang => {
                    if (nguoiDungCuahang) {
                        console.log('Tên người dùng của người dùng trong danh sách cuahang:', nguoiDungCuahang.ten_nguoi_dung);

                        // Gửi thông tin người dùng đến server để gửi email
                        await axios.post("http://10.0.2.2:8000/monan/send_email_to_nguoi_dung_cuahang/", {
                            nguoi_dung_cuahang_id: nguoiDungCuahang.id,
                            id_cua_hang:userId,
                        });
                    } else {
                        console.log('Không tìm thấy người dùng trong danh sách cuahang');
                    }
                });
                alert('Thêm món ăn thành công!');


            }
        } catch (error) {
            console.error("Thêm món ăn thất bại:", error);
            console.log("Error details:", error.response.data);
        }
    };

    const handleconfirmMenu = async () => {
        try {
            if (tenMenu === '') {
                alert('Vui lòng điền đầy đủ thông tin đăng ký');
            } else {
                const formData = new FormData();
                formData.append('tieu_de', tenMenu);
                formData.append('nguoi_dung', userData[0].id);
                formData.append('hinh_anh', {
                    uri: hinhanh,
                    name: 'hinhanh.jpg',
                    type: 'hinhanh/jpeg',
                });
                const response = await axios.post(
                    "http://10.0.2.2:8000/menu/",
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                );
                const menuId = response.data.id;

                alert('Thêm menu thành công!');
                navigation.navigate('PostMenu', { products, menuId, userId, thoidiem });

            }
        } catch (error) {
            console.error("Thêm menu thất bại:", error);
            console.log("Error details:", error.response.data);
        }

    };

    const renderFoodForm = () => {
        return (
            <>
                <View style={styles.inputContainer}>
                    <View style={styles.inputView}>
                        <View style={styles.alignIcon}>
                            <Image source={require('../img/hamburger.png')} style={styles.icon} />
                            <TextInput
                                style={styles.inputText}
                                placeholder="Tên Món Ăn"
                                onChangeText={(text) => setTenMonAn(text)}
                                value={tenMonAn}
                            />
                        </View>
                    </View>
                    <View style={styles.inputView}>
                        <View style={styles.alignIcon}>
                            <Image source={require('../img/dollar.png')} style={styles.icon} />
                            <TextInput
                                style={styles.inputText}
                                placeholder="Giá Món Ăn"
                                keyboardType="numeric"  // Chỉ cho phép bàn phím số
                                onChangeText={handleGiaMonAnChange}
                                value={giaMonAn}
                            />
                        </View>
                    </View>
                    <View style={styles.inputView}>
                        <View style={styles.alignIcon}>
                            <Image source={require('../img/note.png')} style={styles.icon} />
                            <TextInput
                                style={styles.inputText}
                                placeholder="Mô tả"
                                onChangeText={(text) => setMoTa(text)}
                                value={moTa}
                            />
                        </View>
                    </View>
                    <View style={styles.inputView}>
                        <View style={styles.alignIcon}>
                            <Image source={require('../img/dish.png')} style={styles.icon} />

                            <TouchableOpacity onPress={pickImage}>
                                {hinhanh ? (
                                    <Image
                                        source={{ uri: hinhanh }}
                                        style={{
                                            width: 390,
                                            height: 120,
                                            resizeMode: "contain",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            marginBottom: 10,
                                            borderRadius: 20,
                                            marginLeft: -60
                                        }}
                                    />
                                ) : (

                                    <Text style={styles.customAvatar}>Tải ảnh món ăn</Text>
                                )}
                            </TouchableOpacity>
                        </View>

                    </View>


                    <View style={styles.inputView}>
                        <View style={styles.alignIcon}>

                            <Image source={require('../img/loaithucAn.png')} style={styles.icon} />

                            <TouchableOpacity onPress={() => setShowLoaiThucAnOptions(!showLoaiThucAnOptions)}>
                                {showLoaiThucAnOptions ? null : (
                                    <Text>
                                        {selectedLoaiThucAn ? selectedLoaiThucAn.ten_loai_thuc_an : "Chọn loại thực phẩm"}
                                    </Text>
                                )}
                            </TouchableOpacity>

                            {showLoaiThucAnOptions && (
                                <View style={styles.optionsContainer}>
                                    {loaithucan.map((thucAn) => (
                                        <TouchableOpacity
                                            key={thucAn.id}
                                            onPress={() => handleSelectLoaiThucAn(thucAn)}
                                        >
                                            <Text style={styles.optionText}>{thucAn.ten_loai_thuc_an}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </View>

                    </View>

                    <View style={styles.inputView}>
                        <View style={styles.alignIcon}>
                            <Image source={require('../img/soLuong.png')} style={styles.icon} />
                            <TextInput
                                style={styles.inputText}
                                placeholder="Số lượng"
                                keyboardType="numeric"  // Chỉ cho phép bàn phím số
                                onChangeText={handleSoLuongChange}
                                value={soLuong}
                            />
                        </View>
                    </View>
                    <TouchableOpacity style={styles.postConfirm} onPress={handleconfirm}>
                        <Text style={styles.buttonText}>Đăng</Text>
                    </TouchableOpacity>

                </View >

            </>



        );

    };

    const renderMenuForm = () => {
        return (
            <>
                <View style={styles.inputContainerMenu}>
                    <View style={styles.inputView}>
                        <View style={styles.alignIcon}>
                            <Image source={require('../img/menu.png')} style={styles.icon} />
                            <TextInput
                                style={styles.inputText}
                                placeholder="Tên Menu"
                                onChangeText={(text) => setTenMenu(text)}
                                value={tenMenu}
                            />
                        </View>

                    </View>
                    <View style={styles.inputView}>
                        <View style={styles.alignIcon}>
                            <Image source={require('../img/dish.png')} style={styles.icon} />

                            <TouchableOpacity onPress={pickImage}>
                                {hinhanh ? (
                                    <Image
                                        source={{ uri: hinhanh }}
                                        style={{
                                            width: 400,
                                            height: 150,
                                            // resizeMode: "contain",
                                            // justifyContent: "center",
                                            // alignItems: "center",
                                            marginBottom: 10,
                                            borderRadius: 20,
                                            marginLeft: -60
                                        }}
                                    />
                                ) : (

                                    <Text style={styles.customAvatar}>Tải ảnh Menu</Text>
                                )}
                            </TouchableOpacity>
                        </View>

                    </View>

                    <TouchableOpacity style={styles.postConfirm} onPress={handleconfirmMenu}>
                        <Text style={styles.buttonText}>Xác nhận</Text>
                    </TouchableOpacity>
                </View >

            </>

        );
    };

    const filteredFollow = Object.values(follow).filter(item => item.cua_hang === userId);


    filteredFollow.forEach(async (followItem) => {
        const nguoiDungCuahang = cuahang.find(item => item.id === followItem.nguoi_dung_id);

        if (nguoiDungCuahang) {
            console.log('Tên người dùng của người dùng trong danh sách cuahang:', nguoiDungCuahang.ten_nguoi_dung);
        } else {
            console.log('Không tìm thấy người dùng trong danh sách cuahang');
        }
    });

    const urlImg = 'https://res.cloudinary.com/dpp5kyfae/';
    useEffect(() => {
        getProductsAPI();
        getLoaiThucAnAPI();
        getMenuAPI();
        getThoiDiemAPI();
        getThoiGianBanAPI();
        getFollowAPI();
        getCuaHangAPI();

    }, []);



    const handleIncreaseQuantity = async (categoryId) => {
        const updatedCategories = products.map((category) => {
            if (category.id === categoryId) {
                category.so_luong += 1;

                updateCategoryAPI(category.id, category.so_luong);

                return category;
            }
            return category;
        });

        setProducts(updatedCategories);
    };
    const handlereduceQuantity = async (categoryId) => {
        const updatedCategories = products.map((category) => {
            if (category.id === categoryId) {

                if (category.so_luong > 1) {
                    category.so_luong -= 1;
                    updateCategoryAPI(category.id, category.so_luong);
                } else {
                    console.warn("Cannot reduce quantity below 1.");
                }
                return category;
            }
            return category;
        });

        setProducts(updatedCategories);
    };

    const updateCategoryAPI = async (categoryId, newSoLuong) => {
        try {
            await axios.put(
                `http://10.0.2.2:8000/monan/${categoryId}/`,
                { so_luong: newSoLuong }
            );
            alert(`Đã cập nhật so_luong cho món ăn có ID ${categoryId}`)
        } catch (error) {
            console.error('Lỗi khi cập nhật thông tin:', error.response.data);
        }

    };
    const handleHideMenu = async (categoryId) => {
        try {
            const response = await axios.post(`http://10.0.2.2:8000/menu/${categoryId}/active-menu/`);

            getMenuAPI();
            if (response.data.trang_thai === true) {
                alert("Bật thành công menu")
            } else {
                alert("Tắt thành công menu")

            }
            console.log();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <View style={styles.fixed}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>MealMaster</Text>
                    <Text style={styles.headerText}>{userData[0].ten_nguoi_dung}</Text>
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

            <ScrollView>

                <View style={styles.boxTitle}>
                    {/* <Image
                        source={{ uri: urlImg + accountData[0].avatar }}
                        style={styles.avatarImage}
                    /> */}
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



                <View style={styles.boxContent}>
                    <TouchableOpacity style={styles.postButton} onPress={handlePostFood}>
                        <Text style={styles.buttonText}>Đăng món ăn</Text>
                    </TouchableOpacity>
                    {isPostingFood && renderFoodForm()}
                </View>

                <View style={styles.customBoxProducts}>
                    <ScrollView horizontalScrollView={true} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.monAnList}>
                        {products.map((category) => (
                            <View style={styles.monAnItem}>
                                {/* <Image style={styles.monAnImg}
                                    source={require('../img/matcha_da_xay.jpg')} /> */}
                                <Image
                                    style={styles.monAnImg}
                                    source={{ uri: category.hinh_anh }}
                                />
                                <TouchableOpacity onPress={() => handleItem(category.id, products)}>
                                    <View style={styles.textContainerTenMonAn}>
                                        <Text style={styles.categoryName}>{category.ten_mon_an}</Text>
                                        <Text style={styles.categoryPrice}>{category.gia_mon_an}<Text>VND</Text></Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleIncreaseQuantity(category.id)}>
                                    <Text style={styles.plus}>+</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handlereduceQuantity(category.id)}>
                                    <Text style={styles.minus} >-</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => handleThoiGianBanClick(category.id)} >
                                    <Text style={styles.time}>
                                        {selectedThoiDiemByCategory[category.id] && selectedThoiDiemByCategory[category.id].ten_buoi
                                            ? selectedThoiDiemByCategory[category.id].ten_buoi
                                            : "Thời gián bán"
                                        }
                                    </Text>

                                </TouchableOpacity>
                                <View style={styles.scrollViewContainer}>
                                    {renderThoiDiemOptions(category.id)}
                                </View>

                            </View>
                        ))}
                    </ScrollView>
                </View>


                <View style={styles.boxContentMenu}>
                    <TouchableOpacity style={styles.postButtonMenu} onPress={handlePostMenu}>
                        <Text style={styles.buttonText}>Đăng Menu</Text>
                    </TouchableOpacity>

                    {isPostingMenu && renderMenuForm()}

                </View>

                <View style={styles.customBoxProducts}>

                    <ScrollView horizontal={true} contentContainerStyle={styles.monAnList}>
                        {menu.map((category) => (
                            <View style={styles.monAnItem}>
                                <Image
                                    style={styles.monAnImg}
                                    source={{ uri: category.hinh_anh }}
                                />

                                <TouchableOpacity onPress={() => handleEditMenu(category.id, products)}>
                                    <View style={styles.textContainerTenMonAn}>
                                        <Text style={styles.categoryName}>{category.tieu_de}</Text>
                                    </View>

                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleHideMenu(category.id)}>
                                    {category.trang_thai === true ? (
                                        <Image key={`${category.id}_on`} style={styles.rightImg} source={require('../img/switch_on.png')} />
                                    ) : (
                                        <Image key={`${category.id}_off`} style={styles.rightImg} source={require('../img/switch_off.png')} />
                                    )}
                                </TouchableOpacity>



                            </View>
                        ))}
                    </ScrollView>
                </View>
            </ScrollView >




        </>

    );
};
const styles = StyleSheet.create({
    customBoxProducts: {
        backgroundColor: '#D0CBDC',
        // padding:10,
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
        // marginLeft: 10,
        borderWidth: 1,
        borderColor: '#1DB954',
        borderRadius: 9,
        marginTop: 13,
    },
    customAvatar: {
        // marginBottom:0,
    },
    textInputAVT: {
        marginBottom: 10,
    },
    avatarImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    rightImg: {
        width: 50,
        height: 50,
        marginLeft: 60,
    },
    textContainerTenMonAn: {
        // marginRight:10,
        width: 150
    },
    scrollViewContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: -210,
        marginTop: 20,
        height: 150,
        // borderRadius:10
    },
    scrollView: {
        maxHeight: 200,
    },

    thoiDiemItem: {
        color: 'white',
        backgroundColor: '#1DB954',
        width: 90,
        padding: 10,
        borderRadius: 6,
        marginRight: 50,
        // borderRadius:10,
        // color:"#000",
        // marginLeft:
    },
    time: {
        fontSize: 16,
        paddingTop: 3,
        borderRadius: 5,
        color: '#FFF',
        backgroundColor: 'rgb(247,71,46)',
        marginRight: 2,
        // fontWeight:'bold',
        // width: 83,
        height: 20,
        textAlign: "center",
        marginLeft: -170,
        height: 40,
        width: 70,
    },
    optionText: {
        fontSize: 16,
        padding: 10,
        paddingLeft: 20,
        width: 80,
        height: 45,
        color: '#fff',
        margin: 0,
    },
    optionsContainer: {
        marginBottom: 40,
        marginLeft: 130,
        borderRadius: 10,
        width: 80,
        backgroundColor: '#1DB954',

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
        // color:'#FFF'
        // marginLeft:20
    },
    minus: {
        fontSize: 20,
        paddingTop: 3,
        borderRadius: 5,
        color: 'white',
        backgroundColor: 'rgb(247,71,46)',
        marginRight: 2,
        width: 33,
        height: 33,
        textAlign: "center",
        // margin: 10,
        marginLeft: 10,
        // marginRight:80
    },

    plus: {
        fontSize: 20,
        paddingTop: 3,
        borderRadius: 5,
        color: 'white',
        backgroundColor: 'rgb(247,71,46)',
        marginRight: 2,
        width: 33,
        height: 33,
        textAlign: "center",
        margin: 10,
        marginLeft: 50,
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
        backgroundColor: '#f0f0f0',

        // backgroundColor: '#0BB0DB',
        padding: 10,
        borderRadius: 8,
        // width:30,
        height: 100,
        // width:250,
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
        marginTop: 100,
        marginBottom: -20,
    },
    boxContent: {
        display: 'flex',
        flexDirection: 'row',
        marginLeft: '50',
        backgroundColor: '#FFFFF6',
        width: 390,

        marginLeft: 2,
        borderRadius: 10,
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
        marginBottom: 40,
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
        // width
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
        width: 390,
        backgroundColor: '#rgb(255,255,255)',
        borderRadius: 25,
        height: 90,
        marginBottom: 20,
        marginLeft: -80,
        marginTop: 20,
        justifyContent: 'center',
        padding: 20,
    },
    postButtonMenu: {
        backgroundColor: '#92B0DB',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: -90,
        width: 200,
        height: 50,
        marginLeft: 100,
        paddingBottom: 10,
        // marginBottom:10,
        // marginBottom:-60
    },

    postButton: {
        backgroundColor: '#92B0DB',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        width: 200,
        height: 50,
        marginLeft: 100,
        marginBottom: 20,
        // padding:40,

    },

    buttonText: {
        color: '#000',
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

});

export default Post;
