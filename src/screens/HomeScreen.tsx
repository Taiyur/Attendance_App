import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar
} from 'react-native';

export default function HomeScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Smart Attendance</Text>
        <Text style={styles.subtitle}>
          Face Recognition Based System
        </Text>
      </View>

      {/* Cards */}
      <View style={styles.cardContainer}>
        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.icon}>👤</Text>
          <Text style={styles.cardTitle}>Register</Text>
          <Text style={styles.cardDesc}>
            Register new employee
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Attendance')}
        >
          <Text style={styles.icon}>📸</Text>
          <Text style={styles.cardTitle}>Attendance</Text>
          <Text style={styles.cardDesc}>
            Mark attendance instantly
          </Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <Text style={styles.footer}>
        Secure • Fast • Intelligent
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    padding: 20,
    justifyContent: 'space-between'
  },

  header: {
    marginTop: 40
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#E5E7EB'
  },

  subtitle: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 5
  },

  cardContainer: {
    marginTop: 40
  },

  card: {
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 25,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#1F2933',
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8
  },

  icon: {
    fontSize: 40,
    marginBottom: 15
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#F8FAFC'
  },

  cardDesc: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 6
  },

  footer: {
    textAlign: 'center',
    color: '#64748B',
    marginBottom: 20,
    fontSize: 12
  }
});
