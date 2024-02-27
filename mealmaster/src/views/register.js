import React, { useState, useEffect } from "react";
import {
    Alert,
    SafeAreaView,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    Modal,
    ScrollView,
    Platform,
} from 'react-native';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';




const Register = () => {
    const options = ["Khách Hàng", "Cửa Hàng"];
    const genderOptions = ['Nam', 'Nữ'];
    const [avatar, setAvatar] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [tenNguoiDung, setTenNguoiDung] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [gender, setGender] = useState('');
    const [address, setAddress] = useState('');
    const [selectedGender, setSelectedGender] = useState('');
    const [chosenDateText, setChosenDateText] = useState('Chọn ngày');
    const [dob, setDob] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const [showGenderOptions, setShowGenderOptions] = useState(false);
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');

    const getLocation = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== 'granted') {
                console.log('Permission to access location was denied');
                return;
            }

            const location = await Location.getCurrentPositionAsync({});
            setLatitude(location.coords.latitude.toString());
            setLongitude(location.coords.longitude.toString());
        } catch (error) {
            console.error('Error getting location:', error);
        }
    };

    const showLocationAlert = () => {
        Alert.alert(
            'Yêu Cầu Vị Trí',
            'Ứng dụng cần biết vị trí của bạn để đăng ký. Cho phép truy cập vị trí?',
            [
                {
                    text: 'Từ Chối',
                    style: 'cancel',
                },
                {
                    text: 'Cho Phép',
                    onPress: () => getLocation(),
                },
            ]
        );
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
            setAvatar(localUri);
        } else {
            console.log("User canceled image picker");
        }
    };
    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || dob;
        setShowDatePicker(false);
        setDob(currentDate);
        setChosenDateText(format(currentDate, 'dd/MM/yyyy'));

    };
    const handleSelectGender = (gender) => {
        setSelectedGender(gender);
        setShowGenderOptions(false);
    };

    const handleSelectOption = (option) => {
        setSelectedOption(option);
        setShowOptions(false);
    };

    const handleRegister = async () => {
        try {
            if (!tenNguoiDung || !username || !password || !selectedOption) {
                alert('Vui lòng nhập đầy đủ thông tin bắt buộc.');
                return;
            }
            const formattedDate = format(dob, 'yyyy-MM-dd');
            const formData = new FormData();
            formData.append('ten_nguoi_dung', tenNguoiDung);
            formData.append('sdt', phoneNumber);
            formData.append('username', username);
            formData.append('password', password);
            formData.append('email', email);
            formData.append('dia_chi', address);
            formData.append('gioi_tinh', selectedGender === 'Nam' ? '1' : '0');
            formData.append('loai_tai_khoan', selectedOption === 'Khách Hàng' ? '1' : '2');
            formData.append('ngay_sinh', formattedDate);
            formData.append('avatar', {
                uri: avatar,
                name: 'avatar.jpg', 
                type: 'image/jpeg',
            });


            if (selectedOption === 'Cửa Hàng') {
                if (!address) {
                    alert('Vui lòng nhập địa chỉ.');
                    return;
                }
                const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=AIzaSyB-M500zF9hEI3OoOPyK_dVHfWDyZcx5fI`);
                const result = await response.json();

                if (result.results && result.results.length > 0) {
                    const location = result.results[0].geometry.location;
                    formData.append('kinh_do', location.lng);
                    formData.append('vi_do', location.lat);
                    console.log("cua hang")

                } else {
                    alert('Không thể xác định tọa độ từ địa chỉ.');
                    return;
                }
            } else {
                formData.append('kinh_do', longitude);
                formData.append('vi_do', latitude);
                console.log("Khach hang")
            }

            const response = await axios.post(
                "http://10.0.2.2:8000/taikhoans/",
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            alert('Đăng ký thành công!');
        } catch (error) {
            console.error("Đăng ký thất bại:", error);
            // Thêm xử lý lỗi và thông báo tùy ý
            alert('Có lỗi xảy ra trong quá trình đăng ký.');
        }
    };

    useEffect(() => {
        showLocationAlert();
    }, []);

    return (
        <ScrollView>
            <SafeAreaView style={styles.container}>
                <Text style={styles.brandText}>MealMaster</Text>

                <View style={styles.inputView}>
                    <View style={styles.alignIcon}>
                        <Image source={require('../img/hoTen.png')} style={styles.icon} />
                        <TextInput
                            style={styles.inputText}
                            placeholder="Họ và Tên"
                            onChangeText={(text) => setTenNguoiDung(text)}
                            value={tenNguoiDung}
                        />
                    </View>

                </View>
                <View style={styles.inputView}>
                    <View style={styles.alignIcon}>
                        <Image source={require('../img/ho_va_ten.jpg')} style={styles.icon} />
                        <TextInput
                            style={styles.inputText}
                            placeholder="Tên đăng nhập"
                            onChangeText={(text) => setUsername(text)}
                            value={username}
                        />
                    </View>

                </View>
                <View style={styles.inputView}>
                    <View style={styles.alignIcon}>
                        <Image source={require('../img/key.png')} style={styles.icon} />
                        <TextInput
                            style={styles.inputText}
                            placeholder="Mật khẩu"
                            onChangeText={(text) => setPassword(text)}
                            secureTextEntry={true}
                            value={password}
                        />
                    </View>

                </View>

                <View style={styles.genderStyle}>
                    <Image source={require('../img/gioiTinh.png')} style={[styles.icon, styles.inconGender]} />

                    <TouchableOpacity onPress={() => setShowGenderOptions(!showGenderOptions)}>
                        {showGenderOptions ? null : (
                            <Text>
                                {selectedGender ? selectedGender : "Giới tính"}
                            </Text>
                        )}
                    </TouchableOpacity>

                    {showGenderOptions && (
                        <View style={styles.optionsGender}>
                            {genderOptions.map((gender, index) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => handleSelectGender(gender)}
                                >
                                    <Text style={styles.optionText}>{gender}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>



                <View style={styles.inputView}>
                    <View style={styles.alignIcon}>
                        <Image source={require('../img/dien_thoai.jpg')} style={styles.icon} />
                        <TextInput
                            style={styles.inputText}
                            placeholder="Số điện thoại"
                            onChangeText={(text) => setPhoneNumber(text)}
                            value={phoneNumber}
                        />
                    </View>

                </View>
                <View style={styles.inputView}>

                    <View style={styles.alignIcon}>
                        <Image source={require('../img/email.jpg')} style={styles.icon} />
                        <TextInput
                            style={styles.inputText}
                            placeholder="Email"
                            onChangeText={(text) => setEmail(text)}
                            value={email}
                        />
                    </View>


                </View>


                <View style={styles.inputView}>
                    <View style={styles.alignIcon}>
                        <Image source={require('../img/pin.png')} style={styles.icon} />
                        <TextInput
                            style={styles.inputText}
                            placeholder="Địa chỉ"
                            onChangeText={(text) => setAddress(text)}
                            value={address}
                        />
                    </View>
                </View>

                <View style={styles.inputView}>


                    <View style={styles.alignIcon}>
                        <Image source={require('../img/lich.jpg')} style={styles.icon} />
                        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                            <Text>{chosenDateText}</Text>
                        </TouchableOpacity>

                        {showDatePicker && (
                            <DateTimePicker
                                value={dob}
                                mode="date"
                                display="spinner"
                                onChange={handleDateChange}
                            />
                        )}

                    </View>

                </View>

                <View style={styles.inputView}>
                    <TouchableOpacity onPress={() => setShowOptions(!showOptions)}>
                        {showOptions ? null : (
                            <Text>
                                {selectedOption ? selectedOption : "Chọn loại tài khoản"}
                            </Text>
                        )}
                    </TouchableOpacity>


                    {showOptions && (
                        <View style={styles.optionsContainer}>
                            {options.map((option, index) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => handleSelectOption(option)}
                                >
                                    <Text style={styles.optionText}>{option}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>
                <View style={styles.inputView}>
                    <View style={styles.alignIcon}>
                        <Image source={require('../img/avatar.png')} style={styles.icon} />

                        <TouchableOpacity style={styles.bgInputAVT} onPress={pickImage}>
                            {avatar ? (
                                <Image
                                    source={{ uri: avatar }}
                                    style={{
                                        width: 300,
                                        height: 110,
                                        // resizeMode: "contain",

                                        marginBottom: 10,
                                        borderRadius: 5,
                                        marginLeft: -70,
                                        marginTop: 30,
                                    }}
                                />
                            ) : (
                                <View
                                    style={{ alignItems: "center", justifyContent: "center" }}
                                >

                                    <Text >Tải ảnh đại diện</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>

                </View>



                <TouchableOpacity style={styles.registerBtn} onPress={handleRegister}>
                    <Text style={styles.registerText}>Đăng ký</Text>
                </TouchableOpacity>

                <View style={styles.lineContainer}>
                    <View style={styles.line} />
                    <Text style={styles.orText}>hoặc</Text>
                    <View style={styles.line} />
                </View>

                <TouchableOpacity style={styles.googleBtn}>
                    <Image source={require('../img/google.png')} style={styles.icon} />
                    <Text style={styles.loginText}>Đăng ký bằng Google</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.facebookBtn} >
                    <Image source={require('../img/facebook.png')} style={styles.icon} />
                    <Text style={styles.loginText}>Đăng ký bằng Facebook</Text>
                </TouchableOpacity>
            </SafeAreaView>
        </ScrollView>

    );
};

const styles = StyleSheet.create({
    textInputAVT: {
        marginBottom: 10,
    },
    avatarContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '80%',
        height: 150,
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 10,
        marginVertical: 20,
    },
    avatarImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        borderRadius: 10,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgb(0,177,79)',
        padding: 20,
    },
    inputView: {
        width: '80%',
        backgroundColor: '#rgb(255,255,255)',
        borderRadius: 25,
        height: 60,
        marginBottom: 20,
        justifyContent: 'center',
        padding: 20,
    },
    brandText: {
        fontSize: 40,
        fontWeight: 'bold',
        marginBottom: 20,
        color: 'rgb(18,18,18)',
        marginBottom: 60
    },
    inputText: {
        height: 50,
    },
    registerBtn: {
        width: '50%',
        backgroundColor: 'rgb(18,18,18)',
        borderRadius: 25,
        height: 50,
        alignItems: 'center',
        marginTop: 20,
        justifyContent: 'center',
    },
    registerText: {
        color: "white"
    },
    googleBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4285F4',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
        width: '60%',

        marginBottom: 20,
        marginTop: 20,
    },
    icon: {
        width: 30,
        height: 30,
        marginRight: 10,
    },
    inconGender: {
        width: 30,
        height: 30,
        marginLeft: 20,
    },
    facebookBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '60%',
        backgroundColor: '#3b5998',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,

    },

    line: {
        flex: 1,
        height: 1,
        backgroundColor: '#000', // Màu của line
    },
    lineContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20, // Khoảng cách từ line đến các button
    },
    orText: {
        marginHorizontal: 10,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
    registerLink: {
        color: 'rgb(24,119,242)'
    },
    alignIcon: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dropdown: {
        width: '80%',
        flex: 1,
        backgroundColor: '#FFF',
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderRadius: 25,
        borderColor: '#000',
        color: '#000',
    },
    dropdownText: {
        fontSize: 15,
        textAlign: 'left',
        marginLeft: -5,
        color: '#000',
    },
    modalContainer: {
        marginTop: 60,
        backgroundColor: '#FFF',
        width: '70%',
        alignSelf: 'center',
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 15,
        elevation: 5,
        position: 'relative',
        top: '19%'
    },
    optionText: {
        fontSize: 15,
        paddingVertical: 10,
    },
    genderStyle: {
        flexDirection: 'row', // Sắp xếp các phần tử theo hàng ngang
        alignItems: 'center',
        width: '80%',
        height: 50,
        marginBottom: 20,
        borderRadius: 15,
        backgroundColor: '#rgb(255,255,255)',
        position: 'relative',

    },
    datePickerStyle: {
        width: 100,
        top: '-50%',
    },
    optionsContainer: {
        marginTop: 10,
        backgroundColor: "#FFF",
        borderRadius: 10,
        elevation: 5,
        position: "relative",
        marginLeft: -20,
        height: 70,
        width: 290,
        paddingBottom: 5
    },
    optionText: {
        fontSize: 15,
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    optionsGender: {
        marginTop: 5,
        backgroundColor: "#FFF",
        borderRadius: 10,
        elevation: 5,
        position: "relative",
        marginLeft: -50,
        height: 75,
        width: 290,
    },
    loginText: {
        color: '#FFF',

    },


});

export default Register;
