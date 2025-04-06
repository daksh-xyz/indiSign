import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../../db/firebaseConfig';
import { FontAwesome5, MaterialCommunityIcons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { User as UserIcon } from 'lucide-react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return unsubscribe;
  }, []);
  
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#ffffff',
          display: user ? 'flex' : 'none', // Hide tab bar when not authenticated
        },
        tabBarActiveTintColor: colorScheme === 'dark' ? '#ffffff' : '#000000',
        tabBarInactiveTintColor: colorScheme === 'dark' ? '#666666' : '#999999',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Translate',
          tabBarIcon: ({ color }) => <MaterialIcons size={24} name="translate" color={color} />,
        }}
      />
      <Tabs.Screen
        name="recognize"
        options={{
          title: 'Vision',
          tabBarIcon: ({ color }) => <MaterialIcons size={24} name="remove-red-eye" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Learn',
          tabBarIcon: ({ color }) => <FontAwesome5 size={24} name="user-graduate" color={color} />,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: ({ size, color }) => (
            <FontAwesome name="user" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}