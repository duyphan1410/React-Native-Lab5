import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Services from '../screens/Services';
import AddNewService from '../screens/AddNewService';
import ServiceDetail from '../screens/ServiceDetail';
import EditService from '../screens/EditService';

const Stack = createStackNavigator();

const RouterService = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="ServicesList" component={Services} />
      <Stack.Screen name="AddNewService" component={AddNewService} />
      <Stack.Screen name="ServiceDetail" component={ServiceDetail} />
      <Stack.Screen name="EditService" component={EditService} />
    </Stack.Navigator>
  );
};

export default RouterService;