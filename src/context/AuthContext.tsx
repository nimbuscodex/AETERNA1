import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, signInWithPopup, signInWithRedirect, signOut as firebaseSignOut, onAuthStateChanged, getRedirectResult } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithGoogle: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        await getRedirectResult(auth);
      } catch (error) {
        console.error('Error in redirect login', error);
      }
    };
    handleRedirect();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      console.error('Error signing in with Google', error);
      if (error.code === 'auth/popup-blocked' || error.code === 'auth/cancelled-popup-request') {
        alert('Si tu navegador bloquea la ventana emergente de inicio de sesión o se cierra, serás redirigido directamente a Google.');
        try {
          await signInWithRedirect(auth, googleProvider);
        } catch (redirectError) {
          console.error("Error redirecting to Google:", redirectError);
        }
      }
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Error signing out', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
