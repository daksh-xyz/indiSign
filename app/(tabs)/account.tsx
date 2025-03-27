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
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { auth } from '@/db/firebaseConfig';
import {
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  User,
} from 'firebase/auth';
import { useRouter } from 'expo-router';
import { Mail, Key, LogOut } from 'lucide-react-native';

export default function AccountScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
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
});