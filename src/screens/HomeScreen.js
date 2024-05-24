import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { db, auth } from '../firebase/firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref } from 'firebase/storage';

const HomeScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [imageURL, setImageURL] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const userId = currentUser.uid;
          const userRef = doc(db, 'users', userId);
          const userData = await getDoc(userRef);
          if (userData.exists()) {
            setUser(userData.data());
            // Resmi getir
            if (userData.data().imageURL) {
              const storageRef = ref(storage, userData.data().imageURL);
              const url = await getDownloadURL(storageRef);
              setImageURL(url);
            }
          } else {
            console.log('User data not found');
          }
        } else {
          console.log('User not logged in');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <View style={styles.container}>
       {user ? (
      <View style={{ flex: 1, alignItems: 'center' }}>
        <Image 
          source={{ uri: "https://www.pngkey.com/png/full/73-730477_first-name-profile-image-placeholder-png.png" }} 
          style={styles.image} 
        />          
        <Text style={styles.welcomeText}>Welcome, {user.userName}!</Text>
        
        <Text style={styles.userInfo}>Email: <Text style={styles.userDetail}>{user.email}</Text></Text>
        <Text style={styles.userInfo}>UserName: <Text style={styles.userDetail}>{user.userName}</Text></Text>
        <Text style={styles.userInfo}>Phone: <Text style={styles.userDetail}>{user.phone}</Text></Text>
        {/* İlgili işlevlere yönlendiren butonlar */}
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('EditProfile')}>
          <Text style={styles.buttonText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Logout')}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>

        <View style={styles.appInfo}>
      <Text style={styles.infoText}>
        This is an awesome app that helps you learn new words and improve your vocabulary. 
        With features like quizzes, word lists, and customizable settings, you'll have fun 
        while expanding your knowledge. Get started now and embark on a journey of learning!
      </Text>
    </View>
      </View>
    ) : (
      <Text>Loading user data...</Text>
    )}
      
    {/* Navbar */}
    <View style={styles.navbar}></View>
      <View style={styles.navbar}>
        <TouchableOpacity style={styles.navbarItem} onPress={() => navigation.navigate('Quiz')}>
          <Text style={styles.navbarText}>Quiz</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navbarItem} onPress={() => navigation.navigate('Settings')}>
          <Text style={styles.navbarText}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navbarItem} onPress={() => navigation.navigate('Report')}>
          <Text style={styles.navbarText}>Report</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navbarItem} onPress={() => navigation.navigate('AddWord')}>
          <Text style={styles.navbarText}>AddWord</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navbarItem} onPress={() => navigation.navigate('ListWord')}>
          <Text style={styles.navbarText}>ListWord</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 10,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  userInfo: {
    fontSize: 16,
    marginBottom: 5,
  },
  userDetail: {
    fontWeight: 'bold',
    color: 'blue', // Eğer isterseniz kullanıcı bilgilerinin detaylarına farklı bir renk de verebilirsiniz
  },
  button: {
    width: 250,
    height: 40,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3498db', // Buton rengi
    marginVertical: 10,
  },
  buttonText: {
    color: 'white', // Buton metin rengi
    fontSize: 16,
    fontWeight: 'bold',
  },
  appInfo: {
    marginTop:40,
    alignItems: 'center',
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  infoText: {
    fontSize: 17,
    textAlign: 'center',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: '#3498db', // Navbar arka plan rengi
    paddingVertical: 20, // Navbar'ın yüksekliği
    position: 'absolute',
    bottom: 0,
  },
});

export default HomeScreen;
