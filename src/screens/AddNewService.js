import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text, IconButton } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import { useMyContext } from '../store';
import { useNavigation } from '@react-navigation/native';

const AddNewService = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [controller] = useMyContext();
  const { userLogin } = controller;
  const navigation = useNavigation();

  const handleAddService = async () => {
    // Validate input
    if (!name.trim()) {
      alert('Please enter a service name');
      return;
    }
    
    if (!price.trim() || isNaN(Number(price))) {
      alert('Please enter a valid price');
      return;
    }
    
    setLoading(true);
    try {
      const now = new Date();
      const serviceData = {
        name: name.trim(),
        price: Number(price),
        creator: userLogin?.fullName || 'Unknown',
        creatorEmail: userLogin?.email || 'unknown@example.com',
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      };
      
      await firestore().collection('SERVICES').add(serviceData);
      
      alert('Service added successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Add service error:', error);
      alert('Failed to add service: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerText}>Add New Service</Text>
      </View>
      
      <View style={styles.formContainer}>
        <TextInput
          label="Service name *"
          placeholder="Input a service name"
          value={name}
          onChangeText={setName}
          mode="outlined"
          style={styles.input}
        />
        
        <TextInput
          label="Price *"
          placeholder="Enter price"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
          mode="outlined"
          style={styles.input}
          right={<TextInput.Affix text="đ" />}
        />
        
        <Button
          mode="contained"
          onPress={handleAddService}
          style={styles.button}
          loading={loading}
          disabled={loading}
        >
          Add Service
        </Button>
        
        <Button
          mode="outlined"
          onPress={() => navigation.goBack()}
          style={styles.cancelButton}
        >
          Cancel
        </Button>
      </View>
    </ScrollView>
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
    marginLeft: 8,
  },
  formContainer: {
    padding: 16,
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  button: {
    marginTop: 16,
    paddingVertical: 6,
  },
  cancelButton: {
    marginTop: 12,
    paddingVertical: 6,
  },
});

export default AddNewService;