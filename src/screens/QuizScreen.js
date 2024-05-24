import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth, db } from '../../src/firebase/firebaseConfig';
import { collection, getDocs, addDoc, doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';

const OptionButton = ({ title, onPress, isSelected }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.optionButton,
        isSelected ? styles.selectedOption : null,
      ]}
    >
      <Text style={[styles.optionText, isSelected ? styles.selectedText : null]}>{title}</Text>
    </TouchableOpacity>
  );
};

const QuizScreen = ({ navigation }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [userId, setUserId] = useState('');
  const [newWordCount, setNewWordCount] = useState(10); // Default value
  const [settingsWordCount, setSettingsWordCount] = useState(8); // Default value

  useEffect(() => {
    const fetchUserIdAndSettings = async () => {
      const user = auth.currentUser;
      if (user) {
        setUserId(user.uid);
        await fetchSettings(user.uid);
        await fetchQuestions();
      }
    };
    fetchUserIdAndSettings();
    
  }, []);

  useEffect(() => {
    if (settingsWordCount !== newWordCount) {
      setNewWordCount(settingsWordCount);
      fetchQuestions();
    }
    
  }, [settingsWordCount]);

  const fetchSettings = async (userId) => {
    const userSettingsRef = doc(db, 'userSettings', userId);
    const userSettingsDoc = await getDoc(userSettingsRef);
  
    if (userSettingsDoc.exists()) {
      const wordCount = userSettingsDoc.data().newWordCount;
      console.log("Fetched word count:", wordCount);
      setSettingsWordCount(wordCount);
    }
  };

  console.log("Settings word count:", settingsWordCount);
  
  

  const fetchQuestions = async () => {
  const querySnapshot = await getDocs(collection(db, 'words'));
  let shuffledQuestions = shuffleArray(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  shuffledQuestions = shuffledQuestions.slice(0, newWordCount); // Limit questions based on newWordCount
  setQuestions(shuffledQuestions);
  setCurrentQuestion(shuffledQuestions[0]);

  // Check if currentIndex is greater than or equal to settingsWordCount

  
};

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleAnswer = async () => {
    const correctAnswer = currentQuestion.turkish.toLowerCase();
    
    if (selectedOption.toLowerCase() === correctAnswer) {
      const userProgressRef = doc(db, 'userProgress', userId);
      const userProgressDoc = await getDoc(userProgressRef);
  
      if (userProgressDoc.exists()) {
        const knownWords = userProgressDoc.data().knownWords || {};
        if (knownWords[currentQuestion.id]) {
          if (knownWords[currentQuestion.id].attempts < 6) {
            await updateDoc(userProgressRef, {
              [`knownWords.${currentQuestion.id}.attempts`]: knownWords[currentQuestion.id].attempts + 1
            });
          } else {
            // Move the word to another collection
            await moveWordToAnotherCollection(knownWords[currentQuestion.id]);
            // Remove the word from userProgress collection
            delete knownWords[currentQuestion.id];
            await setDoc(userProgressRef, { knownWords });
            nextQuestion();
            return;
          }
        } else {
          knownWords[currentQuestion.id] = {
            ...currentQuestion,
            attempts: 1
          };
          await setDoc(userProgressRef, { knownWords }, { merge: true });
        }
      } else {
        const knownWords = {
          [currentQuestion.id]: {
            ...currentQuestion,
            attempts: 1
          }
        };
        await setDoc(userProgressRef, { knownWords });
      }
  
      Alert.alert("Doğru!", "Cevabınız doğru.", [
        {
          text: "Sonraki Soru",
          onPress: nextQuestion
        }
      ]);
    } else {
      Alert.alert("Yanlış!", `Cevabınız yanlış. Doğru cevap: ${correctAnswer}`);
    }
    setSelectedOption('');
  };
  
  const moveWordToAnotherCollection = async (word) => {
    const userWordsRef = collection(db, 'userWords');
    await addDoc(userWordsRef, word);
  };
  

  const nextQuestion = () => {
    let nextIndex = currentIndex + 1;

    if (currentIndex >= settingsWordCount) {
      Alert.alert("Quiz Bitti", "Tüm soruları cevapladınız.", [
        {
          text: "Ana Ekrana Dön",
          onPress: () => navigation.navigate('Home')
        }
      ]);
    }
    if (nextIndex >= questions.length) {
      Alert.alert("Quiz Bitti", "Tüm soruları cevapladınız.", [
        {
          text: "Ana Ekrana Dön",
          onPress: () =>{{ navigation.navigate('Home')
            {setCurrentIndex(0)}
          }}
          
        }
      ]);
      return;
    }
    setCurrentIndex(nextIndex);
    setCurrentQuestion(questions[nextIndex]);
    
  };

  const shuffleArray = (array) => {
    let currentIndex = array.length, randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    return array;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} color="black" onPress={() => navigation.goBack()} />
        <Text style={styles.questionNumber}>Soru {currentIndex + 1}</Text>
      </View>
      {currentQuestion && (
        <>
          <Text style={styles.questionText}>{currentQuestion.english}</Text>
          <View style={styles.optionContainer}>
            {currentQuestion.options.map((option, index) => (
              <OptionButton
                key={index}
                title={option}
                onPress={() => handleOptionSelect(option)}
                isSelected={selectedOption === option}
              />
            ))}
          </View>
          <Button
            title="Cevabı Gönder"
            onPress={handleAnswer}
            disabled={selectedOption === ''}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%'
  },
  questionNumber: {
    fontSize: 16
  },
  questionText: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center'
  },
  optionContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginBottom: 20,
    width: '80%'
  },
 
    optionButton: {
      padding: 10,
      marginBottom: 10,
      backgroundColor: '#ffffff',
      borderColor: '#000000',
      borderWidth: 1,
      borderRadius: 10,
      shadowColor: '#000000',
      shadowOffset: {
        width: 0,
        height: 3
      },
      shadowOpacity: 0.27,
      shadowRadius: 4.65,
      elevation: 6
    },
    selectedOption: {
      backgroundColor: '#90EE90' // Light green color for selected option
    },
    optionText: {
      fontSize: 16
    },
    selectedText: {
      color: 'white'
    }
  });

  export default QuizScreen;
