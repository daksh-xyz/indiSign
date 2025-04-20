import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
  useColorScheme,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { auth } from '@/db/firebaseConfig'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { Lock, Mail, LogIn, UserPlus } from 'lucide-react-native';
import { Link } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const isDark = useColorScheme() === 'dark';

  const handleAuth = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      if (err.code === 'auth/user-not-found') {
        setError('User not found. Please sign up.');
      }
      else if (err.code === 'auth/wrong-password') {
        setError('Incorrect password. Please try again.');
      }
      else if (err.code === 'auth/email-already-in-use') {
        setError('Email already in use. Please sign in.');
      }
      else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address. Please try again.');
      }
      else if (err.code === 'auth/weak-password') {  
        setError('Weak password. Please use a stronger password.');
      }
      else if (err.code === 'auth/operation-not-allowed') {
        setError('Operation not allowed. Please contact support.');
      }
      else if (err.code === 'auth/too-many-requests') {
        setError('Too many requests. Please try again later.');
      }
      else if (err.code === 'auth/unknown') {
        setError('An unknown error occurred. Please try again.');
      }
      else if (err.code === 'auth/invalid-credential') {
        setError('Invalid credential. Please try again.');
      }
      else if (err.code === 'auth/invalid-verification-code') {
        setError('Invalid verification code. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.logoContainer}>
        <Image
          source={require('@/assets/indisign.png')}
          style={styles.logoBackground}
        />
        <View style={styles.overlay} />
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>{isSignUp ? "Sign up to continue" : "Sign in to continue"}</Text>
      </View>

      <View style={[styles.formContainer, isDark ? { backgroundColor: '#1a1a1a' } : { backgroundColor: '#fff' }]}>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={[styles.inputContainer, isDark ? { backgroundColor: '#aaaaaa' } : { backgroundColor: '#f0ecec' }]}>
          <Mail size={20} color={isDark ? '#000' : "#666"} style={styles.inputIcon} />
          <TextInput
            style={[styles.input, { color: isDark ? '#000' : "#333" }]}
            placeholder="Email"
            placeholderTextColor={isDark ? '#000' : "#666"}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View style={[styles.inputContainer, isDark ? { backgroundColor: '#aaaaaa' } : { backgroundColor: '#f0ecec' }]}>
          <Lock size={20} color={isDark ? '#000' : "#666"} style={styles.inputIcon} />
          <TextInput
            style={[styles.input, { color: isDark ? '#000' : "#333" }]}
            placeholder="Password"
            placeholderTextColor= {isDark ? "#000" : "#666"}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleAuth}
          disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              {isSignUp ? (
                <UserPlus size={20} color="#fff" style={styles.buttonIcon} />
              ) : (
                <LogIn size={20} color="#fff" style={styles.buttonIcon} />
              )}
              <Text style={styles.buttonText}>
                {isSignUp ? 'Sign Up' : 'Sign In'}
              </Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.switchButton}
          onPress={() => setIsSignUp(!isSignUp)}>
          <Text style={styles.switchButtonText}>
            {isSignUp
              ? 'Already have an account? Sign In'
              : "Don't have an account? Sign Up"}
          </Text>
        </TouchableOpacity>
        <Link
          href="/ForgotPassword"
          style={styles.switchButton}>
          <Text style={styles.switchButtonText}>{isSignUp ? "" : "Forgot Password?"}</Text>
        </Link>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  logoContainer: {
    height: '40%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  logoBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    zIndex: 1,
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    opacity: 0.8,
    zIndex: 1,
  },
  formContainer: {
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    marginTop: -30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    marginBottom: 15,
    marginTop: 10,
    paddingHorizontal: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  switchButton: {
    marginTop: 18,
    alignSelf: 'center',
  },
  switchButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
  errorText: {
    color: '#FF3B30',
    marginBottom: 15,
    textAlign: 'center',
  },
});