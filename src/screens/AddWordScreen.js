import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { db, auth,storage } from '../firebase/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL, uploadBytes } from 'firebase/storage';
import { Ionicons } from '@expo/vector-icons';
export default function AddWordScreen({navigation}) {
  const [englishWord, setEnglishWord] = useState('');
  const [turkishWord, setTurkishWord] = useState('');
  const [exampleSentences, setExampleSentences] = useState(['']);
  const [image, setImage] = useState(null);

  const addExampleSentence = () => {
    setExampleSentences([...exampleSentences, '']);
  };

  const handleExampleChange = (text, index) => {
    const newSentences = [...exampleSentences];
    newSentences[index] = text;
    setExampleSentences(newSentences);
  };

  const handleRemoveExample = (index) => {
    const newSentences = [...exampleSentences];
    newSentences.splice(index, 1);
    setExampleSentences(newSentences);
  };
  

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.assets[0].uri);
    }
  };

  

  const saveWord = async () => {
    try {
      
      const userId = auth.currentUser.uid;
      let imageUrl = null;

      if (image) {
        const response = await fetch(image);
        const blob = await response.blob();
        const imageRef = ref(storage, `images/${userId}/${Date.now()}`);
        await uploadBytes(imageRef, blob);
        imageUrl = await getDownloadURL(imageRef);
      }
      console.log("imagelendi")
      await addDoc(collection(db, 'users', userId, 'words'), {
        englishWord,
        turkishWord,
        exampleSentences,
        imageUrl, // Save image URL to Firestore
      });
      // Clear the form
      setEnglishWord('');
      setTurkishWord('');
      setExampleSentences(['']);
      setImage(null);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={{ 
      flex: 1,
      padding: 20,
      backgroundColor: '#fff', }}>
        <Ionicons 
          name="arrow-back"
          size={24} 
          color="black" 
          style={styles.backIcon} 
          onPress={() => navigation.goBack()} 
        />
      <Text>İngilizce Kelime:</Text>
      <TextInput
        style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
        value={englishWord}
        onChangeText={setEnglishWord}
      />
      <Text>Türkçe Karşılık:</Text>
      <TextInput
        style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
        value={turkishWord}
        onChangeText={setTurkishWord}
      />
      <Text>Örnek Cümleler:</Text>
      {exampleSentences.map((sentence, index) => (
         <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
         <TextInput
           style={{ borderWidth: 1, marginBottom: 10, padding: 5, flex: 1 }}
           value={sentence}
           onChangeText={(text) => handleExampleChange(text, index)}
         />
         <TouchableOpacity onPress={() => handleRemoveExample(index)}>
           <Ionicons name="trash-outline" size={24} color="red" />
         </TouchableOpacity>
       </View>
      ))}

<TouchableOpacity style ={styles.optionButton} onPress={addExampleSentence}> 
        <Text>Cümle Ekle</Text>

      </TouchableOpacity>
      <TouchableOpacity style ={styles.optionButton} onPress={pickImage}> 
        <Text>Resim Yükle</Text>

      </TouchableOpacity>
      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}

      <TouchableOpacity style ={styles.optionButton} onPress={saveWord}> 
        <Text>Kaydet</Text>

      </TouchableOpacity>

      
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    margin:15,
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  backIcon: {
    
    bottom:5,
    right: 15,
  },

  button:{
    margin:10,
    padding:10,

  },
  optionButton: {
    padding: 10,
    margin:10,
    marginBottom: 10,
    backgroundColor: '#ffffff',
    borderColor: '#000000',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor:"#3498db",
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
   
  },
  
})