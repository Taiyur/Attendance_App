import React, { useLayoutEffect, useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { registerFace } from '../api/faceApi';

export default function RegisterScreen({ navigation }: any) {
  const cameraRef = useRef<Camera>(null);
  const capturedImages = useRef<string[]>([]);

  const [employeeId, setEmployeeId] = useState('');
  const [captures, setCaptures] = useState(0);
  const [hasPermission, setHasPermission] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);

  const devices = useCameraDevices();
  const device = devices.find(d => d.position === 'front');

  const isRegistered = captures === 5;

  /* 🔐 Camera permission */
  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'granted');
    })();
  }, []);

  /* 🧭 Header (single source of truth) */
  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Register',
      headerStyle: { backgroundColor: '#020617' },
      headerTintColor: '#7DF9FF',
      headerLeft: () => (
        <Text style={styles.headerBtn} onPress={() => navigation.goBack()}>
          ⬅
        </Text>
      ),
      headerRight: () => (
        <TouchableOpacity
          disabled={!registrationComplete}
          onPress={() => navigation.navigate('Attendance')}
          style={{ marginRight: 15, opacity: registrationComplete ? 1 : 0.4 }}
        >
          <Text style={{ color: '#00FFE0', fontWeight: '600' }}>
            Attendance
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, registrationComplete]);

  /* 📸 Capture photo */
  const handleCapture = async () => {
    if (!cameraRef.current) return;
    if (captures >= 5) return;
    if (!employeeId) return;

    try {
      const photo = await cameraRef.current.takePhoto();
      console.log('📸 PHOTO:', photo.path);

      capturedImages.current.push(photo.path);
      setCaptures(prev => prev + 1);

      if (captures + 1 === 5) {
        console.log('✅ Sending 5 images to backend');

        const result = await registerFace(
          employeeId,
          capturedImages.current
        );

        console.log('🧠 EMBEDDINGS RESPONSE:', result);
        setRegistrationComplete(true);
      }
    } catch (error) {
      console.error('❌ Camera/Register error:', error);
    }
  };

  /* ⏳ Permission / device guard */
  if (!device || !hasPermission) {
    return (
      <View style={styles.container}>
        <Text style={{ color: '#fff' }}>
          Waiting for camera permission...
        </Text>
      </View>
    );
  }

  /* 🖼️ UI */
  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={styles.camera}
        device={device}
        isActive={true}
        photo={true}
        enableLocation={false}
      />

      <Text style={styles.label}>Employee ID</Text>
      <TextInput
        placeholder="Enter Employee ID"
        placeholderTextColor="#6B7280"
        value={employeeId}
        onChangeText={setEmployeeId}
        style={styles.input}
      />

      <View style={styles.captureBox}>
        <Text style={styles.captureText}>
          Face Captures: {captures} / 5
        </Text>

        <TouchableOpacity
          style={[
            styles.captureBtn,
            { opacity: employeeId ? 1 : 0.5 },
          ]}
          disabled={!employeeId}
          onPress={handleCapture}
        >
          <Text style={styles.captureBtnText}>CAPTURE FACE</Text>
        </TouchableOpacity>
      </View>

      {isRegistered && (
        <Text style={styles.successText}>
          ✔ Registration Completed
        </Text>
      )}
    </View>
  );
}

/* 🎨 Styles (UNCHANGED) */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
    padding: 20,
  },
  camera: {
    height: 260,
    borderRadius: 20,
    marginBottom: 20,
  },
  label: {
    color: '#7DF9FF',
    marginBottom: 8,
    fontSize: 14,
    letterSpacing: 1,
  },
  input: {
    backgroundColor: '#020617',
    borderRadius: 14,
    padding: 15,
    color: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
    marginBottom: 25,
  },
  captureBox: {
    backgroundColor: '#020617',
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: '#38BDF8',
  },
  captureText: {
    color: '#E5E7EB',
    marginBottom: 15,
    fontSize: 16,
  },
  captureBtn: {
    backgroundColor: '#38BDF8',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
  },
  captureBtnText: {
    color: '#020617',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  successText: {
    color: '#22C55E',
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center',
  },
  headerBtn: {
    fontSize: 20,
    paddingHorizontal: 12,
    color: '#7DF9FF',
  },
});
