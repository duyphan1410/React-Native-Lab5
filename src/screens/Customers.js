import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Card, ActivityIndicator, FAB } from 'react-native-paper';
import { useMyContext } from '../store';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const Customer = () => {
  const [controller] = useMyContext();
  const { userLogin } = controller;
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    // Fetch services
    const unsubscribe = firestore()
      .collection('SERVICES')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        const servicesList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setServices(servicesList);
        setLoading(false);
      }, error => {
        console.error('Services fetch error:', error);
        setLoading(false);
      });
      
    return () => unsubscribe();
  }, []);

  const formatPrice = (price) => {
    return price ? price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') : '0';
  };

  const handleViewService = (service) => {
    navigation.navigate('ServiceDetail', { service });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#694fad" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome, {userLogin?.fullName || 'Customer'}</Text>
      <Text style={styles.sectionTitle}>Danh sách dịch vụ</Text>
      
      <FlatList
        data={services}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Card 
            style={styles.card}
            onPress={() => handleViewService(item)}
          >
            <Card.Content>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardPrice}>{formatPrice(item.price)} đ</Text>
            </Card.Content>
          </Card>
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    marginBottom: 12,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  cardPrice: {
    fontSize: 14,
    color: '#694fad',
    marginTop: 8,
  },
});

export default Customer;