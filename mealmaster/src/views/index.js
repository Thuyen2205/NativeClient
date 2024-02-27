import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from './login';
import Register from './register';
import Home from './home';
import Item from './item';
import Store from './store';
import Search from './search';
import Pay from './pay';
import Post from './post';
import PostMenu from './postMenu';
import Menu from './menu';
import { CartProvider } from './cartContext';
import { AuthProvider } from './authContext';

// import { AuthProvider } from './authContext';
import Cart from './cart'
import Map from './map'
import WebVnpay from './webvnpay';
const Stack = createNativeStackNavigator();

const RootComponent = function () {
    return (
        <AuthProvider>
            <CartProvider>

                <NavigationContainer>
                    <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
                        <Stack.Screen name="Login" component={Login} />
                        <Stack.Screen name="Register" component={Register} />
                        <Stack.Screen name="Home" component={Home} />
                        <Stack.Screen name="Item" component={Item} />
                        <Stack.Screen name="Store" component={Store} />
                        <Stack.Screen name="Search" component={Search} />
                        <Stack.Screen name="Pay" component={Pay} />
                        <Stack.Screen name="Post" component={Post} />
                        <Stack.Screen name="PostMenu" component={PostMenu} />
                        <Stack.Screen name="Menu" component={Menu} />
                        <Stack.Screen name="Cart" component={Cart} />
                        <Stack.Screen name="Map" component={Map} />
                        <Stack.Screen name="WebVnpay" component={WebVnpay} />
                    </Stack.Navigator>
                </NavigationContainer>
            </CartProvider>
        </AuthProvider>


    );
};

export default RootComponent;
