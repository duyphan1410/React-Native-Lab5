import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text, IconButton } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const EditService = ({ route }) => {
  const { service } = route.params;
  const navigation = useNavigation();
  
  const [name, setName] = useState(service.name);
  const [price, setPrice] = useState(service.price.toString());
  const [loading, setLoading] = useState(false);
  
  const handleUpdate = async () => {
    // Validation
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
      await firestore().collection('SERVICES').doc(service.id).update({
        name: name.trim(),
        price: Number(price),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
      
      alert('Service updated successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Update service error:', error);
      alert('Failed to update service: ' + error.message);
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
        <Text style={styles.headerText}>Edit Service</Text>
      </View>
      
      <View style={styles.formContainer}>
        <TextInput
          label="Service name *"
          value={name}
          onChangeText={setName}
          mode="outlined"
          style={styles.input}
        />
        
        <TextInput
          label="Price *"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
          mode="outlined"
          style={styles.input}
          right={<TextInput.Affix text="đ" />}
        />
        
        <Button
          mode="contained"
          onPress={handleUpdate}
          style={styles.button}
          loading={loading}
          disabled={loading}
        >
          Update Service
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

export default EditService;