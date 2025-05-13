import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { useMyContext } from '../store';
import { ActivityIndicator, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Screens
import Login from '../screens/Login';
import Register from '../screens/Register';
import Services from '../screens/Services';
import Transaction from '../screens/Transaction';
import Setting from '../screens/Setting';
import Admin from '../screens/Admin';
import Customer from '../screens/Customers';
import RouterService from './RouterService';

const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();

// Customer Tab Navigator
const CustomerTabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      activeColor="#fff"
      barStyle={{ backgroundColor: '#694fad' }}
    >
      <Tab.Screen
        name="Home"
        component={Customer}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <Icon name="home" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Transaction"
        component={Transaction}
        options={{
          tabBarLabel: 'Transactions',
          tabBarIcon: ({ color }) => (
            <Icon name="swap-horizontal" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Setting"
        component={Setting}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color }) => (
            <Icon name="cog" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Admin Tab Navigator
const AdminTabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      activeColor="#fff"
      barStyle={{ backgroundColor: '#694fad' }}
    >
      <Tab.Screen
        name="Home"
        component={Admin}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <Icon name="home" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Services"
        component={RouterService}
        options={{
          tabBarLabel: 'Services',
          tabBarIcon: ({ color }) => (
            <Icon name="clipboard-list" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Setting"
        component={Setting}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color }) => (
            <Icon name="cog" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const Router = () => {
  const [controller, dispatch] = useMyContext();
  const { userLogin } = controller;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for stored credentials
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#694fad" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {userLogin ? (
        // User is signed in
        userLogin.role === 'admin' ? (
          // Admin routes
          <Stack.Screen name="AdminHome" component={AdminTabNavigator} />
        ) : (
          // Customer routes
          <Stack.Screen name="CustomerHome" component={CustomerTabNavigator} />
        )
      ) : (
        // Auth routes
        <>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default Router;