"use client";
import useAuthStore from '@/app/store/useAuthStore';
import { GoogleLogin } from '@react-oauth/google';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const OAuthLogin = () => {
  const { isLoggedIn, login} = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const token = sessionStorage.getItem('googleIdToken');
    if (token) {
      login(JSON.parse(sessionStorage.getItem('user') || '{}'));
      router.push('/dashboard');
    }
  }, []);


  const handleSuccess = async (response: any) => {
    const { credential } = response; 
    if (!credential) {
      console.error('OAuth error: No credential received');
      return;
    }
    sessionStorage.setItem('googleIdToken', credential);  
    const res = await fetch('/api/auth/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: credential }),
    });

    const data = await res.json();

    if (data.success) {
      login(data.user);
      sessionStorage.setItem('user', JSON.stringify(data.user));
      router.push('/dashboard');
      console.log('User created or logged in:', data.user);
    } else {
      console.error('OAuth error:', data.message);
    }
  };

  const handleFailure = () => {
    console.error('OAuth error: Failed to authenticate');
  };

  return (
    <>
      {!isLoggedIn ? (
        <>
          <GoogleLogin onSuccess={handleSuccess} onError={handleFailure} />
          {process.env.NEXT_PUBLIC_DEV_BYPASS_GOOGLE === 'true' && (
            <button
              onClick={async () => {
                const res = await fetch('/api/auth', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ token: 'dev', email: 'dev@example.com', name: 'Dev User' }),
                });
                const data = await res.json();
                if (data.success) {
                  login(data.user);
                  sessionStorage.setItem('user', JSON.stringify(data.user));
                }
              }}
              className='ml-3 cursor-pointer bg-gray-800 text-white px-3 py-2 rounded-md'
            >
              Dev Login
            </button>
          )}
        </>
      ) : (
        <>
          <span className='text-green-600 font-semibold'>Logged in! Redirecting...</span>
        </>
      )}
    </>
  );
};

export default OAuthLogin;
