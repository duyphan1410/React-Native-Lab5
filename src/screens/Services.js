import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Card, FAB, ActivityIndicator, Menu, Searchbar } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import { useMyContext } from '../store';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Services = () => {
  const [controller, dispatch] = useMyContext();
  const { services } = controller;
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredServices, setFilteredServices] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    // Fetch services from Firestore
    const unsubscribe = firestore()
      .collection('SERVICES')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        const servicesList = snapshot.docs.map(doc => {
          return {
            id: doc.id,
            ...doc.data(),
          };
        });
        
        dispatch({ type: 'LOAD_SERVICES', value: servicesList });
        setLoading(false);
      }, error => {
        console.error('Services fetch error:', error);
        setLoading(false);
      });
      
    return () => unsubscribe();
  }, [dispatch]);

  useEffect(() => {
    // Filter services based on search query
    if (searchQuery) {
      const filtered = services.filter(service => 
        service.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredServices(filtered);
    } else {
      setFilteredServices(services);
    }
  }, [searchQuery, services]);

  const formatPrice = (price) => {
    return price ? price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') : '0';
  };

  const ServiceItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('ServiceDetail', { service: item })}
    >
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Text style={styles.cardPrice}>{formatPrice(item.price)} đ</Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#694fad" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Danh sách dịch vụ</Text>
      
      <Searchbar
        placeholder="Search services"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />
      
      <FlatList
        data={filteredServices}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <ServiceItem item={item} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
      
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('AddNewService')}
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
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  searchBar: {
    marginBottom: 16,
    elevation: 2,
  },
  list: {
    paddingBottom: 80,
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
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#694fad',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Services;