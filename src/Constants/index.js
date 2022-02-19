import React, { useState } from 'react';
import { ToastAndroid, Platform } from 'react-native';
import { Store } from "pullstate";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const _Toast = (msg) => {
  if (Platform.OS === 'android') {
    ToastAndroid.show(msg, ToastAndroid.SHORT);
  } else {
    AlertIOS.alert(msg);
  }
};

export const localImages = {
  "logo": require('../assets/images/logo.png'),
  "productNotFound": require('../assets/images/notfound.png'),
  "banner": require('../assets/images/banner.png'),
};
export const localBannerImages = [
  require('../assets/banner/banner_2.jpg'),
  require('../assets/banner/banner_5.png'),
  require('../assets/banner/banner_11.png')
];
export const localCategoryImages = [
  require('../assets/categories/fruit_4.jpg'),
  require('../assets/categories/fruit_6.jpg'),
  require('../assets/categories/fruit_7.jpg'),
  require('../assets/categories/fruit_8.jpg')
];
export const localFruitsImages = [
  require('../assets/fruits/fruit_11.png'),
  require('../assets/fruits/fruit_12.jpg'),
  require('../assets/fruits/fruit_13.jpg'),
  require('../assets/fruits/fruit_9.jpg'),
  require('../assets/fruits/fruit_10.jpg'),
  require('../assets/fruits/fruit_11.png'),
  require('../assets/fruits/fruit_12.jpg'),
  require('../assets/fruits/fruit_13.jpg'),
  require('../assets/fruits/fruit_14.jpg'),
  require('../assets/fruits/fruit_15.jpg'),
  require('../assets/fruits/fruit_22.png'),
];
export const colorCode = {
  "black": "#000000",
  "white": "#ffffff",
  "liteGray": "#cccccc",
  "liteGray2": "#847d7d",
  "liteGray3":"#c8c4c4",
  "orange1": "#f4bc0f",
};
export const _uc_png = require('../assets/uc.jpg');

export const route = { senderRoute: '', params: {} };

export const StateStore = new Store({
  cartIndicator: false,
  wishlistIndicator: false,
  cartCount: 0,
  updateUI: 0,
  products: [],
  categories: [],
  units: [],
  coupons: [],
  wisthlist: [],
  cartlist: [],
  banners: []
});
export const AppData = {
  products: [],
  categories: [],
  banners: [],
  units: [],
  users: [],
  customers:[],
  vendorCustomers:[],
  user:{
    userid:"",
    phone: "",
    name: "",
    email: "",
    landmark: "",
    pincode: "",
    address: "",
    isVerified: false,
    isBlocked: false,
    isProfileComplete: false
  },
  coupons: [],
  wisthlist: [],
  cartlist: [],
  selectedProduct: {},
  finalProductList: [],
  order:{},
  selectedOrder:{},
  selectedVendorOrder:{}
}
export const dbpath = {
  category: "/customerapp/categories",
  unit: "/customerapp/units",
  product: "/customerapp/products",
  coupon: "/customerapp/coupons",
  user: "/customerapp/delivery/users",
  customers: "/customerapp/users",
  order: "/customerapp/orders",
  banners: "/customerapp/banners",
}
export const getCategory = (categories, catid) => {
  return categories[catid];
};
export const getUnit = (units, unitid) => {
  return units[unitid];
};
export const getCurrentPrice = (priceObj = []) => {
  let lastObj = {};
  priceObj.forEach(element => {
    lastObj = element
  });
  return lastObj;
};
export var getImages = (imgObj) => {
  let obj = [];
  imgObj.forEach(element => {
    obj.push(element)
  });
  return obj ? obj.sort((a, b) => b.isDefault - a.isDefault) : undefined;
}



export const saveUser = async (userObj) => {
  AppData.user = {...userObj}
  try {
    const jsonValue = JSON.stringify(userObj)
    await AsyncStorage.setItem('user', jsonValue)
  } catch (e) {
    // saving error
  }
}
export const getUser = async () => {
  try {
    let profieObj = {
      phone: "",
      name: "",
      email: "",
      landmark: "",
      pincode: "",
      address: "",
      isVerified: false,
      isBlocked: false,
      isProfileComplete: false
    }
    const jsonValue = await AsyncStorage.getItem('user')
    let user = jsonValue != null ? JSON.parse(jsonValue) : profieObj;
    AppData.user = {...user}
  } catch (e) {
    // error reading value
  }
  return true;
};
export const clearStorageOnLogout = async()=>{
  let profieObj = {
    phone: "",
    name: "",
    email: "",
    landmark: "",
    pincode: "",
    address: "",
    isVerified: false,
    isBlocked: false,
    isProfileComplete: false
  };
  AppData.user = {...profieObj}
  try {
    const jsonValue = JSON.stringify(userObj)
    await AsyncStorage.setItem('user', jsonValue)
  } catch (e) {
    // saving error
  }
}

export const getTimeStr = (timeStr) => {
  var datestring = "";
  if (timeStr) {
      var dt = new Date(timeStr);
      datestring = ("0" + dt.getDate()).slice(-2) + "-" + ("0" + (dt.getMonth() + 1)).slice(-2) + "-" +
          dt.getFullYear() + " " + ("0" + dt.getHours()).slice(-2) + ":" + ("0" + dt.getMinutes()).slice(-2);
  }
  return datestring;
}
export const getCusomerUser = (userlist,searchStr)=>{
  let res={name:"",address:"",phone:"",landmark:"",pincode:""};
  Object.keys(userlist).map((uid) => {
      if (userlist[uid].phone.toString() === searchStr.toString()) {
        res = userlist[uid];
      }
  });
  return res;
}
