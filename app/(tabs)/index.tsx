import { Canvas } from '@react-three/fiber/native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { BottomUI } from '@/components/BottomUI';
import { Suspense, useEffect, useState } from 'react';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei/native';
import { Model } from '@/components/Model';
import * as THREE from 'three';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/db/firebaseConfig';
import LoginScreen from '@/components/LoginScreen';
import { useRouter } from 'expo-router';

// Create a custom error handler to suppress R3F initialization warnings
const onCreated = (state: any) => {
  // Suppress UNPACK_FLIP_Y_WEBGL warnings
  if (state.gl) {
    const _gl = state.gl.getContext();
    const pixelStorei = _gl.pixelStorei.bind(_gl);
    _gl.pixelStorei = function(...args: any[]) {
      const [parameter] = args;
      if (parameter === _gl.UNPACK_FLIP_Y_WEBGL) {
        return pixelStorei(...args);
      }
    };
  }
};

export default function App() {
  const [inputText, setInputText] = useState('');
  const [submittedText, setSubmittedText] = useState('');
  const [modelKey, setModelKey] = useState(0);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false);
      if (user) {
        router.replace('/(tabs)');
      }
    });

    return unsubscribe;
  }, []);

  const handleSubmit = () => {
    setSubmittedText(inputText);
  };

  const reloadModel = () => {
    setModelKey(prevKey => prevKey + 1);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <View style={styles.container}>
      <Canvas
        shadows
        onCreated={onCreated}
        style={{ flex: 1 }}
        gl={{ preserveDrawingBuffer: true }}>
        <color attach="background" args={["#303030"]} />
        <Suspense fallback={null}>
          <PerspectiveCamera
            position={[0, 0, 10]}
            fov={50}
            near={0.1}
            far={1000}
            makeDefault
          />
          <directionalLight position={[0, 0, 10]} intensity={1} />
          <Model key={modelKey} position={[0, -7, 0]} submittedText={submittedText} />
          <Environment preset="city" />
          <OrbitControls
            minDistance={1}
            maxDistance={20}
            enablePan={false}
            enableZoom={false}
            enableRotate={true}
            enableDamping={true}
            dampingFactor={0.1}
            mouseButtons={{
              LEFT: THREE.MOUSE.ROTATE,
            }}
            touches={{
              ONE: THREE.TOUCH.ROTATE,
            }}
          />
        </Suspense>
      </Canvas>
      <BottomUI
        inputText={inputText}
        setInputText={setInputText}
        onSubmit={handleSubmit}
      />
      <TouchableOpacity style={styles.floatingButton} onPress={reloadModel}>
        <Text style={styles.buttonText}>↺</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#242424",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#242424',
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 18,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 150,
    left: 5,
    alignSelf: 'center',
    backgroundColor: '#224499',
    borderRadius: 10,
    padding: 20,
    paddingHorizontal: 22,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
    textAlign: "center",
  },
});