import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, List, Button, Divider, ActivityIndicator } from 'react-native-paper';
import { useMyContext } from '../store';
import auth from '@react-native-firebase/auth';

const Setting = ({ navigation }) => {
  const [controller, dispatch] = useMyContext();
  const { userLogin } = controller;
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: async () => {
            setLoading(true);
            try {
              await auth().signOut();
              dispatch({ type: 'LOGOUT' });
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to logout');
            } finally {
              setLoading(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#694fad" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileSection}>
        <View style={styles.profileIcon}>
          <Text style={styles.profileInitial}>
            {userLogin?.fullName?.charAt(0).toUpperCase() || 'U'}
          </Text>
        </View>
        <Text style={styles.profileName}>{userLogin?.fullName || 'User'}</Text>
        <Text style={styles.profileEmail}>{userLogin?.email || 'user@example.com'}</Text>
        <Text style={styles.profileRole}>{userLogin?.role === 'admin' ? 'Administrator' : 'Customer'}</Text>
      </View>
      
      <Divider />
      
      <List.Section>
        <List.Subheader>Personal Information</List.Subheader>
        <List.Item
          title="Email"
          description={userLogin?.email || 'N/A'}
          left={props => <List.Icon {...props} icon="email" />}
        />
        <List.Item
          title="Phone"
          description={userLogin?.phone || 'N/A'}
          left={props => <List.Icon {...props} icon="phone" />}
        />
        <List.Item
          title="Address"
          description={userLogin?.address || 'N/A'}
          left={props => <List.Icon {...props} icon="map-marker" />}
        />
      </List.Section>
      
      <Divider />
      
      <List.Section>
        <List.Subheader>App Settings</List.Subheader>
        <List.Item
          title="Account"
          left={props => <List.Icon {...props} icon="account" />}
          onPress={() => {}}
        />
        <List.Item
          title="Notifications"
          left={props => <List.Icon {...props} icon="bell" />}
          onPress={() => {}}
        />
        <List.Item
          title="Privacy"
          left={props => <List.Icon {...props} icon="shield-account" />}
          onPress={() => {}}
        />
        <List.Item
          title="Help & Support"
          left={props => <List.Icon {...props} icon="help-circle" />}
          onPress={() => {}}
        />
        <List.Item
          title="About"
          left={props => <List.Icon {...props} icon="information" />}
          onPress={() => {}}
        />
      </List.Section>
      
      <View style={styles.buttonContainer}>
        <Button 
          mode="contained" 
          onPress={handleLogout}
          style={styles.logoutButton}
        >
          Logout
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#fff',
  },
  profileIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#694fad',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileInitial: {
    fontSize: 36,
    color: '#fff',
    fontWeight: 'bold',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  profileRole: {
    fontSize: 14,
    color: '#694fad',
    fontWeight: '500',
  },
  buttonContainer: {
    padding: 16,
    marginBottom: 30,
  },
  logoutButton: {
    backgroundColor: '#d32f2f',
  },
});

export default Setting;