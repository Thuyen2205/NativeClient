// CartContext.js
import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [menuCart, setMenuCart] = useState([]);

  const [nearbyStores, setNearbyStores] = useState([]);

  const addToCart = (productId, price, hinhAnh, tenMonAn, soLuong, storeId) => {
    const existingItem = cartItems.find(item => item.id === productId);

    if (existingItem) {
      const updatedCart = cartItems.map(item =>
        item.id === productId ? { ...item, quantity: item.quantity + soLuong } : item
      );
      setCartItems(updatedCart);
    } else {
      setCartItems([...cartItems, { id: productId, price, hinh_anh: hinhAnh, quantity: soLuong, ten_mon_an: tenMonAn, storeId: storeId }]);
    }
  };
  const updateDecreaseCartItem = (productId) => {
    const updatedCart = cartItems.map(item => {
      if (item.id === productId && item.quantity > 0) {
        return { ...item, quantity: item.quantity - 1 };
      } else {
        return item;
      }
    });
    setCartItems(updatedCart);
  };
  const addToCartMenu = (menuId, menuImage, menuName, quantity,storeId) => {
    const existingItem = menuCart.find(item => item.id === menuId);

    if (existingItem) {
      const updatedCart = menuCart.map(item =>
        item.id === menuId ? { ...item, quantity: item.quantity + quantity } : item
      );
      setMenuCart(updatedCart);
    } else {
      setMenuCart([...menuCart, { id: menuId, hinh_anh: menuImage, tieu_de: menuName ,quantity: quantity,storeId:storeId }]);
    }
  };

  const updateIncreaseCartItem = (productId) => {
    const updatedCart = cartItems.map(item =>
      item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCartItems(updatedCart);
  };

  const removeFromCart = (productId) => {
    const updatedCart = cartItems.filter(item => item.id !== productId);
    setCartItems(updatedCart);
  };


  const clearCart = () => {
  };

  const value = {
    cartItems,
    addToCart,
    menuCart,
    updateIncreaseCartItem,
    updateDecreaseCartItem,
    removeFromCart,
    clearCart,
    nearbyStores,
    setNearbyStores,
    addToCartMenu,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export { CartProvider, useCart };
