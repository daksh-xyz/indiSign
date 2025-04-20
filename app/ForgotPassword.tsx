import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { auth } from '@/db/firebaseConfig';
import { sendPasswordResetEmail, User } from 'firebase/auth';
import { useColorScheme } from '@/hooks/useColorScheme.web';
import { Mail } from 'lucide-react-native';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const isDark = useColorScheme() === 'dark';

    const handleResetPassword = async () => {
        if (!email) {
            Alert.alert('Error', 'Please enter your email address.');
            return;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            Alert.alert('Error', 'Please enter a valid email address.');
            return;
        } else if (email.length < 6) {
            Alert.alert('Error', 'Email address must be at least 6 characters long.');
            return;
        } else if (email.length > 50) {
            Alert.alert('Error', 'Email address must be less than 50 characters long.');
            return;
        } else if (!email.includes('@')) {
            Alert.alert('Error', 'Email address must contain an "@" symbol.');
            return;
        }

        try {
            await sendPasswordResetEmail(auth, email);
            Alert.alert('Success', 'Password reset email sent. Check your inbox.');
            setEmail('');
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Something went wrong.';
            Alert.alert('Error', errorMessage);
        }
    };

    return (
        <View style={[styles.container, isDark ? {backgroundColor: '#1a1a1a'} : { backgroundColor: '#fff' }]}>
            <Text style={[styles.title, isDark ? {color: '#fff'} : {color: '#000' }]}>Forgot Password</Text>
            <View style={[styles.inputContainer, isDark ? {backgroundColor: '#aaaaaa'} : { backgroundColor: '#f0ecec' }]}>
                <Mail size={20} color={isDark ? '#000' : '#666'} style={styles.inputIcon} />
                <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    placeholderTextColor={isDark ? '#000' : '#666'}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
            </View>
            <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
                <Text style={styles.buttonText}>Reset Password</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1a1a',
        alignContent: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        marginBottom: 15,
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
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
});

export default ForgotPassword;