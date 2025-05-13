import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Card, ActivityIndicator } from 'react-native-paper';
import { useMyContext } from '../store';
import firestore from '@react-native-firebase/firestore';

const Admin = () => {
  const [controller] = useMyContext();
  const { userLogin } = controller;
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalServices: 0,
    totalCustomers: 0,
    recentServices: []
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get total services
        const servicesSnapshot = await firestore().collection('SERVICES').get();
        const totalServices = servicesSnapshot.size;
        
        // Get recent services
        const recentServicesSnapshot = await firestore()
          .collection('SERVICES')
          .orderBy('createdAt', 'desc')
          .limit(5)
          .get();
          
        const recentServices = recentServicesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Get total customers (users with role 'customer')
        const customersSnapshot = await firestore()
          .collection('USERS')
          .where('role', '==', 'customer')
          .get();
          
        const totalCustomers = customersSnapshot.size;
        
        setStats({ totalServices, totalCustomers, recentServices });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching stats:', error);
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#694fad" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome, {userLogin?.fullName || 'Admin'}</Text>
      
      <View style={styles.statsContainer}>
        <Card style={styles.statCard}>
          <Card.Content>
            <Text style={styles.statTitle}>Total Services</Text>
            <Text style={styles.statValue}>{stats.totalServices}</Text>
          </Card.Content>
        </Card>
        
        <Card style={styles.statCard}>
          <Card.Content>
            <Text style={styles.statTitle}>Total Customers</Text>
            <Text style={styles.statValue}>{stats.totalCustomers}</Text>
          </Card.Content>
        </Card>
      </View>
      
      <Text style={styles.sectionTitle}>Recent Services</Text>
      
      <FlatList
        data={stats.recentServices}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Card style={styles.serviceCard}>
            <Card.Content>
              <Text style={styles.serviceName}>{item.name}</Text>
              <Text style={styles.servicePrice}>{formatPrice(item.price)} đ</Text>
              <Text style={styles.serviceCreator}>Created by {item.creator || 'Unknown'}</Text>
              <Text style={styles.serviceDate}>{formatDate(item.createdAt)}</Text>
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
    marginBottom: 20,
    color: '#333',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 5,
    elevation: 3,
  },
  statTitle: {
    fontSize: 14,
    color: '#666',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#694fad',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  list: {
    paddingBottom: 20,
  },
  serviceCard: {
    marginBottom: 12,
    elevation: 2,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '500',
  },
  servicePrice: {
    fontSize: 14,
    color: '#694fad',
    marginTop: 4,
  },
  serviceCreator: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  serviceDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
});

export default Admin;