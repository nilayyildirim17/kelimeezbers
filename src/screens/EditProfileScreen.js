import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { auth, db } from '../firebase/firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';

const EditProfileScreen = ({navigation}) => {
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const handleUpdateProfile = async () => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userId = currentUser.uid;
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
          userName: newName,
          phone: newPhone,
        });

        console.log('Profile updated successfully');
        setUpdateSuccess(true);
        navigation.goBack();
      } else {
        console.log('User not logged in');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>
      <TextInput
        style={styles.input}
        placeholder="New Name"
        value={newName}
        onChangeText={setNewName}
      />
      <TextInput
        style={styles.input}
        placeholder="New Phone"
        value={newPhone}
        onChangeText={setNewPhone}
        keyboardType="phone-pad"
      />
      <TouchableOpacity style={styles.button} onPress={handleUpdateProfile}>
        <Text style={styles.buttonText}>Update Profile</Text>
      </TouchableOpacity>
      {updateSuccess && <Text style={styles.successText}>Profile updated successfully!</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  input: {
    width: 250,
    height: 50,
    borderRadius: 15,
    borderColor: 'black',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
  button: {
    width: 250,
    height: 40,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderColor: 'blue',
    borderWidth: 2,
    marginBottom: 10,
  },
  buttonText: {
    color: 'blue',
    fontSize: 14,
  },
});

export default EditProfileScreen;
