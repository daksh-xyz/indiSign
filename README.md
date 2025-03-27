# Welcome to indiSign 👋

This is a react-native app made for deaf people enabling them to learn to communicate using 3d-animated models and gamified assignments.

## Get started

1. Install dependencies

   ```bash
   npm install
   ```
   ```bash
   npm install three @react-three/fiber
   ```
   ```bash
   npx expo install expo-gl
   ```

2. Create custom metro.config.js

   ```bash
   npx expo customize metro.config.js
   ```

3. Update metro.config.js
   ```
   // Learn more https://docs.expo.io/guides/customizing-metro
   const { getDefaultConfig } = require('expo/metro-config');

   const defaultConfig = getDefaultConfig(__dirname);

   defaultConfig.resolver.assetExts.push('glb');


   [("js", "jsx", "json", "ts", "tsx", "cjs", "mjs")].forEach((ext) => {
   if (defaultConfig.resolver.sourceExts.indexOf(ext) === -1) {
      defaultConfig.resolver.sourceExts.push(ext);
   }
   });

   ["glb", "gltf", "png", "jpg"].forEach((ext) => {
   if (defaultConfig.resolver.assetExts.indexOf(ext) === -1) {
      defaultConfig.resolver.assetExts.push(ext);
   }
   });

   module.exports = defaultConfig;
   ```

3. Add your own firebaseConfig.ts file
    ```
    // Import the functions you need from the SDKs you need
    import { initializeApp } from "firebase/app";
    import { getFirestore } from "firebase/firestore";
    import { getAuth } from 'firebase/auth';


    // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);

    export const db = getFirestore(app);
    export const auth = getAuth(app);
    ```

    you can get this file by creating an app on https://console.firebase.google.com


3. Start the app

   ```bash
    npx expo start -c
   ``` 


# Guides
1. https://threejs.org/docs/index.html#manual/en/introduction/Creating-a-scene
1. https://docs.expo.dev/tutorial/create-your-first-app/
1. https://docs.expo.dev/guides/using-firebase/
1. https://firebase.google.com/docs/web/setup#register-app