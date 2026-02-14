import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { verifyFace } from '../api/faceApi';
import { TextInput } from 'react-native';

export default function AttendanceScreen() {
  const cameraRef = useRef<Camera>(null);
  const devices = useCameraDevices();
  const device = devices.find(d => d.position === 'front');
  const [employeeId, setEmployeeId] = useState('');
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<null | {
  matched: boolean;
  employeeId?: string | null;
  score?: number;
  notRegistered?: boolean;
   }>(null);


  if (!device) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>Loading camera...</Text>
      </View>
    );
  }

 const handleCapture = async () => {
  if (!cameraRef.current || processing) return;

  if (!employeeId.trim()) {
    Alert.alert('⚠️ Missing Employee ID', 'Please enter Employee ID');
    return;
  }

  try {
    setProcessing(true);

    const photo = await cameraRef.current.takePhoto();
    console.log('📸 Attendance photo:', photo.path);

    const response = await verifyFace(photo.path, employeeId);
    console.log('🧠 VERIFY RESPONSE:', response);

    // 🔴 EMPLOYEE NOT REGISTERED
    if (response.message === 'Employee not registered') {
      setResult({
        matched: false,
        notRegistered: true,
      });
      return;
    }

    // ❌ FACE NOT MATCHED
    if (response.matched === false || response.verified === false) {
      setResult({
        matched: false,
        score: response.score ?? response.similarity,
      });
      return;
    }

    // ✅ SUCCESS
    setResult({
      matched: true,
      employeeId: response.employeeId ?? employeeId,
      score: response.score ?? response.similarity,
    });

  } catch (err) {
    console.error(err);
  } finally {
    setProcessing(false);
  }
};


  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        photo
      />
      {result && (
  <View style={styles.resultBox}>
    <Text
      style={[
        styles.resultText,
        { color: result.matched
        ? '#00FF88'
        : result.notRegistered
        ? '#FFA500'
        : '#FF4444',
        },
      ]}
    >
     {
      result.notRegistered
    ? '⚠️ Employee Not Registered'
    : result.matched
    ? `✅ Attendance Marked\nEmployee: ${result.employeeId}\nScore: ${result.score?.toFixed(3)}`
    : '❌ Face Not Recognized'
     }
    </Text>
  </View>
)}

<View style={styles.inputBox}>
  <Text style={styles.label}>Employee ID</Text>
  <TextInput
    value={employeeId}
    onChangeText={setEmployeeId}
    placeholder="Enter Employee ID"
    placeholderTextColor="#888"
    style={styles.input}
  />
</View>


      <View style={styles.bottom}>
        <TouchableOpacity
          onPress={handleCapture}
          style={styles.captureBtn}
        >
          <Text style={styles.btnText}>
            {processing ? 'Processing...' : 'MARK ATTENDANCE'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  bottom: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
  },
  captureBtn: {
    backgroundColor: '#00FFE0',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 30,
  },
  btnText: {
    color: '#000',
    fontWeight: '700',
    fontSize: 16,
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { color: '#00FFE0' },
  resultBox: {
  position: 'absolute',
  top: 60,
  alignSelf: 'center',
  backgroundColor: 'rgba(0,0,0,0.7)',
  padding: 16,
  borderRadius: 12,
},
resultText: {
  fontSize: 16,
  fontWeight: '700',
  textAlign: 'center',
},
inputBox: {
  position: 'absolute',
  bottom: 120,
  width: '80%',
  alignSelf: 'center',
},
label: {
  color: '#00FFE0',
  marginBottom: 6,
},
input: {
  backgroundColor: '#000',
  borderColor: '#00FFE0',
  borderWidth: 1,
  borderRadius: 12,
  padding: 12,
  color: '#fff',
},
});  