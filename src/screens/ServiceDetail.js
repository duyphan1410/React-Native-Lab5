import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, IconButton, Button, Menu, Divider } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { useMyContext } from '../store';

const ServiceDetail = ({ route }) => {
  const { service } = route.params;
  const navigation = useNavigation();
  const [controller] = useMyContext();
  const { userLogin } = controller;
  const [visible, setVisible] = useState(false);
  
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  
  const formatPrice = (price) => {
    return price ? price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') : '0';
  };
  
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    if (timestamp.toDate) {
      return new Date(timestamp.toDate()).toLocaleString();
    }
    return new Date(timestamp).toLocaleString();
  };
  
  const handleDelete = () => {
    Alert.alert(
      'Warning',
      'Are you sure you want to remove this service? This operation cannot be returned',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'DELETE',
          onPress: async () => {
            try {
              await firestore().collection('SERVICES').doc(service.id).delete();
              navigation.goBack();
            } catch (error) {
              console.error('Delete error:', error);
              Alert.alert('Error', 'Failed to delete service');
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };
  
  const isAdmin = userLogin?.role === 'admin';
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerText}>Service Details</Text>
        
        {isAdmin && (
          <Menu
            visible={visible}
            onDismiss={closeMenu}
            anchor={
              <IconButton
                icon="dots-vertical"
                size={24}
                onPress={openMenu}
                style={styles.menuIcon}
              />
            }
          >
            <Menu.Item
              onPress={() => {
                closeMenu();
                navigation.navigate('EditService', { service });
              }}
              title="Edit"
              leadingIcon="pencil"
            />
            <Divider />
            <Menu.Item
              onPress={() => {
                closeMenu();
                handleDelete();
              }}
              title="Delete"
              leadingIcon="delete"
            />
          </Menu>
        )}
      </View>
      
      <View style={styles.content}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Service name:</Text>
          <Text style={styles.value}>{service.name}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.label}>Price:</Text>
          <Text style={[styles.value, styles.priceValue]}>{formatPrice(service.price)} đ</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.label}>Creator:</Text>
          <Text style={styles.value}>{service.creator || 'Unknown'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.label}>Time:</Text>
          <Text style={styles.value}>{formatDate(service.createdAt)}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.label}>Final update:</Text>
          <Text style={styles.value}>{formatDate(service.updatedAt)}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
    elevation: 2,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    marginLeft: 8,
  },
  menuIcon: {
    marginLeft: 'auto',
  },
  content: {
    padding: 16,
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 8,
    elevation: 2,
  },
  infoRow: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#333',
  },
  priceValue: {
    fontWeight: 'bold',
    color: '#694fad',
  },
});

export default ServiceDetail;