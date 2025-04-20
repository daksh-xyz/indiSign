import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  useColorScheme,
  Alert,
  TextInput,
  Platform
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { auth, db } from '@/db/firebaseConfig';
import {
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  User,
} from 'firebase/auth';
import { useRouter } from 'expo-router';
import { Mail, Key, LogOut, MessageSquareText } from 'lucide-react-native';
import Modal from "react-native-modal";
import { doc, getDoc, setDoc } from 'firebase/firestore';
import StarRating from 'react-native-star-rating-widget';

export default function AccountScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [feedingback, setFeedingBack] = useState(false);
  const [rating, setRating] = useState(0);
  const [inputText, setInputText] = useState('');
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return unsubscribe;
  }, []);

  const handleSignOut = async () => {
    try {
      setLoading(true);
      await signOut(auth);
      router.replace('/');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmail = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      await sendEmailVerification(user);
      Alert.alert(
        'Success',
        'Verification email sent! Please check your inbox.'
      );
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!user?.email) return;

    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, user.email);
      Alert.alert(
        'Success',
        'Password reset email sent! Please check your inbox.'
      );
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const submitFeedback = async () => {
    if (!user?.email) return;
    try {
      setLoading(true);
      const feedbackDocRef = doc(db, "Feedback", user.uid);
      await Promise.race([
        setDoc(feedbackDocRef, {
          Feedback: inputText,
          rating: rating,
          userID: user.uid,
          time: new Date().toISOString(),
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Timeout")), 10000)
        )
      ]);
    } catch (err) {
      console.error("Error submitting feedback:", err);
      Alert.alert("An error occurred!", "Failed to submit feedback");
    } finally {
      setLoading(false);
    }
  };  

  if (!user) {
    return null;
  }

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&auto=format&fit=crop&q=80' }}
          style={styles.backgroundImage}
        />
        <View style={styles.overlay} />
        <View style={styles.profileInfo}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {user.email?.[0].toUpperCase() || '?'}
            </Text>
          </View>
          <Text style={styles.email}>{user.email}</Text>
          <View style={styles.verificationStatus}>
            <View
              style={[
                styles.statusDot,
                user.emailVerified ? styles.verified : styles.unverified,
              ]}
            />
            <Text style={styles.statusText}>
              {user.emailVerified ? 'Verified' : 'Not Verified'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        {!user.emailVerified && (
          <TouchableOpacity
            style={[styles.button, isDark && styles.buttonDark]}
            onPress={handleVerifyEmail}
            disabled={loading}>
            <Mail size={24} color={isDark ? '#fff' : '#000'} />
            <Text style={[styles.buttonText, isDark && styles.buttonTextDark]}>
              Verify Email
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.button, isDark && styles.buttonDark]}
          onPress={handleResetPassword}
          disabled={loading}>
          <Key size={24} color={isDark ? '#fff' : '#000'} />
          <Text style={[styles.buttonText, isDark && styles.buttonTextDark]}>
            Reset Password
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, isDark && styles.buttonDark]}
          onPress={() => {setFeedingBack(true)}}
          disabled={loading || !user.emailVerified}>
          <MessageSquareText size={24} color={isDark ? user.emailVerified ? '#fff' : '#666666' : user.emailVerified ? '#000' : '#999999'} />
          <Text style={[styles.buttonText, isDark && styles.buttonTextDark, {color: isDark ? !user.emailVerified ? '#666666' : '#fff' : user.emailVerified ? '#000' : '#999999'}]}>
            Feedback
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.signOutButton, isDark && styles.signOutButtonDark]}
          onPress={handleSignOut}
          disabled={loading}>
          <LogOut size={24} color="#fff" />
          <Text style={styles.signOutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      )}
      <Modal isVisible={feedingback} onBackdropPress={() => {Platform.OS === "ios" ? setFeedingBack(false) : ""}} onBackButtonPress={() => setFeedingBack(false)}>
        <View style={isDark ? styles.alertBoxDark : styles.alertBox}>
          <Text style={[styles.alertTitle, isDark && styles.alertTitleDark]}>Send Feedback</Text>
          <StarRating
            rating={rating}
            onChange={setRating}
            style={styles.stars}
          />
          <TextInput style={styles.alertInput}
          placeholder="What's on your mind ?"
          onChangeText={setInputText}
          value={inputText}
          />
          <TouchableOpacity onPress={() => {setFeedingBack(false); inputText !== '' ? submitFeedback() : ""; setInputText('')}}>
            <Text style={styles.closeButton}>{inputText !== '' ? 'Submit Feedback' : 'Cancel'}</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  containerDark: {
    backgroundColor: '#1a1a1a',
  },
  header: {
    height: 200,
    position: 'relative',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  email: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  verificationStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 5,
  },
  verified: {
    backgroundColor: '#4CAF50',
  },
  unverified: {
    backgroundColor: '#FF3B30',
  },
  statusText: {
    color: '#fff',
    fontSize: 14,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  buttonDark: {
    backgroundColor: '#333',
  },
  buttonText: {
    marginLeft: 15,
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  buttonTextDark: {
    color: '#fff',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 12,
    marginTop: 'auto',
  },
  signOutButtonDark: {
    backgroundColor: '#CC2E26',
  },
  signOutButtonText: {
    marginLeft: 15,
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertBoxDark: {
    backgroundColor: '#383434',
    padding: 30,
    borderRadius: 18
  },
  alertBox: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 18
  },
  alertTitleDark: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8
  },
  alertTitle: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8
  },
  stars: {
    marginVertical: 8,
    marginHorizontal: 'auto'
  },
  alertInputDark: {
    backgroundColor: '#fff',
    width: '100%',
    marginVertical: 8,
    borderRadius: 12,
    padding: 15
  },
  alertInput: {
    backgroundColor: '#f0ecec',
    width: '100%',
    marginVertical: 8,
    borderRadius: 12,
    padding: 15
  },
  closeButton: {
    color: '#fff',
    paddingVertical: 15,
    marginVertical: 8,
    textAlign: 'center',
    width: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 12
  }
});