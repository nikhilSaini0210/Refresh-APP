import {useState, useEffect} from 'react';
import authService, {UserData} from '@service/auth.service';
import {resetAndNavigate} from '@utils/NavigationUtils';
import {ROUTES} from '@navigation/Routes';

export const useAuth = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const userData = await authService.getUserData();
        setUser(userData);
      } catch (err) {
        setError('Failed to get user data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const signInWithGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      const userData = await authService.signInWithGoogle();
      setUser(userData);
      return userData;
    } catch (err: any) {
      if (
        err?.nativeErrorCode === 'auth/account-exists-with-different-credential'
      ) {
        const emailMatch = err.message.match(/email address (.*?)\./);
        if (emailMatch && emailMatch[1]) {
          const email = emailMatch[1];
          const methods = await authService.getSignInMethodsForEmail(email);
          if (methods.length > 0) {
            const errorMessage = `This email is already associated with ${methods.join(
              ', ',
            )}. Please sign in with ${methods[0]}.`;
            setError(errorMessage);
            return null;
          }
        }
      }

      const errorMessage =
        err instanceof Error ? err.message : 'Failed to sign in with Google';
      setError(errorMessage);
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const signInWithFacebook = async () => {
    setLoading(true);
    setError(null);
    try {
      const userData = await authService.signInWithFacebook();
      setUser(userData);
      return userData;
    } catch (err: any) {
      if (err.errorCode === 'auth/account-exists-with-different-credential') {
        setError(
          'This email is already associated with another account. The app will attempt to handle this automatically.',
        );
        return null;
      }

      const errorMessage =
        err instanceof Error ? err.message : 'Failed to sign in with Facebook';
      setError(errorMessage);
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async (provider: 'facebook.com' | 'google.com') => {
    setLoading(true);
    setError(null);
    try {
      await authService.signOut(provider);
      setUser(null);
      resetAndNavigate(ROUTES.ONBOARD_A);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to sign out';
      setError(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    signInWithGoogle,
    signInWithFacebook,
    signOut,
    isAuthenticated: !!user,
  };
};
