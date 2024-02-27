import React, { useState } from "react";
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useAuth } from "./authContext";
import {
    SafeAreaView,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image
} from 'react-native';

const Login = () => {
    const { login } = useAuth();

    const navigation = useNavigation();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const response = await axios.post(
                "http://10.0.2.2:8000/o/token/",
                `grant_type=password&username=${username}&password=${password}&client_id=Us5JUNskwgNTtQZfw9xs0QmKEvb9trBS2HiKAuWS&client_secret=SO04G1ZefFdaunvBVj62L2gZt7ibZ6nc0GCUGAMJNPixuN1Bl1fwW8A8yGUjDwAyBiMBpzPvVDoE8IVtTOH7p6ZgxdfT3WhRSitsYKVdt5DhJ9f1Bm1RjY36mHz5gc0i`,
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                }
            );
            const accessToken = response.data.access_token;

            const accountResponse = await fetch("http://10.0.2.2:8000/taikhoandangnhap/", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const accountData = await accountResponse.json();
            login(accountData);

            if (accountData.filter(category => category.loai_tai_khoan === 2).length > 0) {
                navigation.navigate("Post");
            } else {
                axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
                navigation.navigate("Home");
            }

        } catch (error) {
            console.error("Đăng nhập thất bại:", error);
            console.log("Error details:", error.response.data);
        }
    };




    const handleRegister = () => {
        navigation.navigate('Register');
    };

    return (
        <View style={styles.container}>
            <View style={styles.alignIcon}>
                <Image source={require('../img/shopping.png')} style={styles.iconShopping} />

                <Text style={styles.brandText}>MealMaster</Text>

            </View>

            <View style={styles.inputView}>
                <View style={styles.alignIcon}>
                    <Image source={require('../img/user.png')} style={styles.icon} />

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
                    <Image source={require('../img/padlock.png')} style={styles.icon} />
                    <TextInput
                        style={styles.inputText}
                        placeholder="Mật khẩu"
                        onChangeText={(text) => setPassword(text)}
                        value={password}
                        secureTextEntry={true}
                    />
                </View>


            </View>
            <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
                <Text style={styles.loginText}>Đăng nhập</Text>
            </TouchableOpacity>

            <View style={styles.lineContainer}>
                <View style={styles.line} />
                <Text style={styles.orText}>hoặc</Text>
                <View style={styles.line} />
            </View>


            <TouchableOpacity style={styles.googleBtn}>
                <Image source={require('../img/google.png')} style={styles.icon} />
                <Text style={styles.loginTextGG}>Đăng nhập bằng Google</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.facebookBtn} >
                <Image source={require('../img/facebook.png')} style={styles.icon} />
                <Text style={styles.loginTextFB}>Đăng nhập bằng Facebook</Text>
            </TouchableOpacity>
            <View style={styles.registerContainer}>
                <Text style={styles.registerText}>
                    <Text style={styles.registerLink}> Nếu bạn chưa có tài khoản hãy </Text>
                </Text>
                <TouchableOpacity onPress={handleRegister} >
                    <Text style={styles.registerText2}>Đăng ký</Text>
                </TouchableOpacity>
            </View>




        </View>
    );
};

const styles = StyleSheet.create({
    registerContainer: {
        marginTop:20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    registerText2: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold"
    },
    loginTextFB: {
        color: "white",
        fontWeight: 'bold'
    },
    loginTextGG: {
        color: "white",
        fontWeight: 'bold'
    },
    iconShopping: {
        width: 60,
        height: 60,
        marginRight: 30,
        marginBottom: 40
    },
    alignIcon: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        width: 20,
        height: 20,
        marginRight: 10,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgb(0,177,79)',
        width: '100%',
        height: '100%',
    },
    inputView: {
        width: '80%',
        backgroundColor: '#rgb(255,255,255)',
        borderRadius: 25,
        height: 50,
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
    loginBtn: {
        width: '50%',
        backgroundColor: 'rgb(18,18,18)',
        borderRadius: 25,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loginText: {
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
        width: 20,
        height: 20,
        marginRight: 10,
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
        backgroundColor: '#000',
    },
    lineContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    orText: {
        marginHorizontal: 10,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
    registerText: {
        // marginTop: 20,
        fontSize: 16,
        color: '#fff',

    },
    registerLink: {
        color: 'black',
        fontSize: 18,

        // fontWeight:'bold'
    },
});

export default Login;
