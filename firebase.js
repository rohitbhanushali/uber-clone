import { initializeApp, getApps } from "firebase/app";
import { GoogleAuthProvider, getAuth, connectAuthEmulator } from 'firebase/auth'

// Firebase configuration
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Debug logging
console.log('Firebase Config:', {
    apiKey: firebaseConfig.apiKey ? 'Set' : 'Not Set',
    authDomain: firebaseConfig.authDomain ? 'Set' : 'Not Set',
    projectId: firebaseConfig.projectId ? 'Set' : 'Not Set',
    storageBucket: firebaseConfig.storageBucket ? 'Set' : 'Not Set',
    messagingSenderId: firebaseConfig.messagingSenderId ? 'Set' : 'Not Set',
    appId: firebaseConfig.appId ? 'Set' : 'Not Set',
    measurementId: firebaseConfig.measurementId ? 'Set' : 'Not Set'
});

// Validate Firebase configuration
const validateConfig = () => {
    const requiredFields = [
        'apiKey',
        'authDomain',
        'projectId',
        'storageBucket',
        'messagingSenderId',
        'appId'
    ];

    const missingFields = requiredFields.filter(field => !firebaseConfig[field]);
    
    if (missingFields.length > 0) {
        console.error('Missing Firebase configuration fields:', missingFields);
        return false;
    }
    return true;
};

// Initialize Firebase
let app;
let auth;
let googleProvider;

try {
    if (!validateConfig()) {
        throw new Error('Invalid Firebase configuration');
    }

    // Initialize Firebase only if it hasn't been initialized
    if (!getApps().length) {
        console.log('Initializing Firebase with config:', {
            ...firebaseConfig,
            apiKey: firebaseConfig.apiKey ? '***' : undefined
        });
        
        // Initialize with explicit options
        app = initializeApp(firebaseConfig, {
            name: 'uber-clone',
            automaticDataCollectionEnabled: true
        });
        
        console.log('Firebase initialized successfully');
    } else {
        app = getApps()[0];
        console.log('Using existing Firebase app');
    }

    // Initialize Auth with explicit settings
    auth = getAuth(app);
    
    // Set persistence to LOCAL
    auth.setPersistence('local');
    
    // Configure auth settings
    auth.useDeviceLanguage();
    auth.settings.appVerificationDisabledForTesting = false;
    
    // Set custom auth domain if needed
    if (typeof window !== 'undefined') {
        auth.settings.authDomain = firebaseConfig.authDomain;
    }
    
    console.log('Firebase Auth initialized');

    // Initialize Google Provider with explicit settings
    googleProvider = new GoogleAuthProvider();
    
    // Configure Google Auth Provider
    googleProvider.setCustomParameters({
        prompt: 'select_account'
    });
    
    // Add scopes
    googleProvider.addScope('profile');
    googleProvider.addScope('email');
    
    console.log('Google Auth Provider configured');

} catch (error) {
    console.error('Firebase initialization error:', error);
    console.error('Error details:', {
        name: error.name,
        message: error.message,
        code: error.code,
        stack: error.stack
    });
    throw error;
}

export { app, auth, googleProvider };