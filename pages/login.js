import React, { useEffect, useState } from 'react';
import tw from "tailwind-styled-components"
import { useRouter } from "next/router";
import { signInWithPopup, onAuthStateChanged, GoogleAuthProvider } from 'firebase/auth'
import { auth, googleProvider } from '../firebase'

export default function Login() {
    const router = useRouter()
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                router.push('/');
            }
        });

        // Cleanup subscription
        return () => unsubscribe();
    }, [router])

    const handleGoogleSignIn = async () => {
        try {
            setLoading(true)
            setError(null)
            
            // Check if Firebase config is properly set
            if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
                throw new Error('Firebase configuration is missing. Please check your environment variables.')
            }

            const result = await signInWithPopup(auth, googleProvider)
            const credential = GoogleAuthProvider.credentialFromResult(result)
            const token = credential.accessToken
            const user = result.user

            // Store user info in localStorage for persistence
            localStorage.setItem('user', JSON.stringify({
                name: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                uid: user.uid
            }))

            router.push('/')
        } catch (error) {
            console.error('Login error:', error)
            setError(getErrorMessage(error))
        } finally {
            setLoading(false)
        }
    }

    const getErrorMessage = (error) => {
        switch (error.code) {
            case 'auth/popup-closed-by-user':
                return 'Login popup was closed. Please try again.'
            case 'auth/cancelled-popup-request':
                return 'Login was cancelled. Please try again.'
            case 'auth/popup-blocked':
                return 'Popup was blocked by your browser. Please allow popups for this site.'
            case 'auth/network-request-failed':
                return 'Network error. Please check your internet connection.'
            default:
                return 'An error occurred during login. Please try again.'
        }
    }

    return (
        <Wrapper>
            <UberLogo src="https://i.ibb.co/n6LWQM4/Post.png"/>
            <Title>Log in to access your account</Title>
            <HeadImage src="https://i.ibb.co/CsV9RYZ/login-image.png"/>
            
            {error && <ErrorMessage>{error}</ErrorMessage>}
            
            <SignInButton 
                onClick={handleGoogleSignIn}
                disabled={loading}
            >
                {loading ? 'Signing in...' : 'Sign in with Google'}
            </SignInButton>
        </Wrapper>
    );
}

const Wrapper = tw.div`
    flex flex-col h-screen w-screen bg-gray-200 p-4
`

const SignInButton = tw.button`
    bg-black text-white text-center py-4 mt-8 self-center w-full
    ${props => props.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'}
    transition-colors duration-200
`

const UberLogo = tw.img`
    h-20 w-auto object-contain self-start
`

const Title = tw.div`
    text-5xl pt-4 text-gray-500
`

const HeadImage = tw.img`
    w-auto object-contain
`

const ErrorMessage = tw.div`
    text-red-500 text-center mt-4 p-2 bg-red-100 rounded
`