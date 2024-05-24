import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { auth, db } from '../../src/firebase/firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
const SettingsScreen = ({navigation}) => {
  const [newWordCount, setNewWordCount] = useState('10');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const fetchUserId = async () => {
      const user = auth.currentUser;
      if (user) {
        setUserId(user.uid);
        fetchSettings(user.uid);
      }
    };

    fetchUserId();
  }, []);

  const fetchSettings = async (userId) => {
    const userSettingsRef = doc(db, 'userSettings', userId);
    const userSettingsDoc = await getDoc(userSettingsRef);
    if (userSettingsDoc.exists()) {
      setNewWordCount(userSettingsDoc.data().newWordCount.toString());
    }
  };

  const saveSettings = async () => {
    if (!userId) return;

    const userSettingsRef = doc(db, 'userSettings', userId);
    await setDoc(userSettingsRef, {
      newWordCount: parseInt(newWordCount, 10),
    });
    Alert.alert('Ayarlar Kaydedildi', 'Yeni kelime sayısı başarıyla kaydedildi.');
  };

  return (
    <View style={styles.container}>
      <Ionicons 
          name="arrow-back"
          size={24} 
          color="black" 
          style={styles.backIcon} 
          onPress={() => navigation.goBack()} 
        />
      <Text style={styles.label}>Yeni Kelime Sayısı</Text>
      <TextInput
        style={styles.input}
        value={newWordCount}
        onChangeText={setNewWordCount}
        keyboardType="number-pad"
      />
      <Button title="Ayarları Kaydet" onPress={saveSettings} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    width: '80%',
    paddingHorizontal: 10,
  },
  backIcon: {
    
    bottom:5,
    right: 15,
  },
});

export default SettingsScreen;
