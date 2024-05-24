import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { db, auth } from '../firebase/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';


export default function WordListScreen({navigation}) {
  const [userWords, setUserWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserWords = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userId = user.uid;
          const wordsCollection = collection(db, 'users', userId, 'words');
          const wordsSnapshot = await getDocs(wordsCollection);

          const wordsArray = wordsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
        
          setUserWords(wordsArray);
        } else {
          setError(new Error("User not logged in"));
        }
      } catch (error) {
        console.error("Error fetching user words: ", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserWords();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Error: {error.message}</Text>
      </View>
    );
  }

  if (userWords.length === 0) {
    return (
      <View style={styles.ANY}>
        <Text>You don't have any word.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{flex:1,backgroundColor:"white"}}>
           
      <View style={styles.container}>
      <Ionicons 
          name="arrow-back"
          size={24} 
          color="black" 
          style={styles.backIcon} 
          onPress={() => navigation.goBack()} 
        />

        {userWords.map((word) => (
          <View key={word.id} style={styles.wordContainer}>
              <Text style={styles.word}>İngilizce: {word.englishWord}</Text>
              <Text style={styles.word}>Türkçe: {word.turkishWord}</Text>
              <Text style={{fontSize: 18,
        marginBottom: 5,}}>Örnek Cümleler:</Text>
            {word.exampleSentences.map((sentence, index) => (
              <Text key={index} style={styles.sentence}>{sentence}</Text>
            ))}
            {word.imageUrl && <Image source={{ uri: word.imageUrl }} style={styles.image} />}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    margin:15,
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  ANY: {
    flex:1,
    justifyContent:"center",
    alignItems:"center",
    backgroundColor: '#fff',
  },
  wordContainer: {
    
    marginBottom: 20,
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  word: {
    fontSize: 18,
    marginBottom: 5,
    borderBottomWidth: 1,
  borderBottomColor: '#ccc',
  marginBottom: 10,
  },
  sentence: {
    borderBottomWidth: 1,
  borderBottomColor: '#ccc',
  marginBottom: 10,
    fontSize: 16,
    marginLeft: 10,
    marginBottom: 5,
  },
  image: {
    alignItems:'center',
    width: 200,
    height: 200,
    marginTop: 10,
    borderRadius: 10,
  },
  backIcon: {
    
    bottom:5,
    right: 15,
  },
});