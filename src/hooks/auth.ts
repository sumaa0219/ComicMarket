import { addUser } from "@/lib/db";
import { Auth, GoogleAuthProvider, User, UserCredential, onAuthStateChanged, signInWithCredential, signInWithPopup, signOut } from "firebase/auth";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import * as Sentry from '@sentry/nextjs';
import { auth as _auth } from "@/lib/firebase";

export const useLogin = (auth: Auth = _auth) => {
  const [state, setState] = useState<'idel' | 'progress' | 'logined' | 'logouted' | 'error'>('idel')
  const [error, setError] = useState<unknown>('');
  const login = useCallback(()=>{
    (async ()=>{
      try {
        setState('progress')
        await signInWithPopup(auth, new GoogleAuthProvider())
        setState('logined')
      } catch (e) {
        setState('error')
        setError(e)
      }
    })()
  }, [auth])
  return { state, login, error }
}

export const useUser = (auth: Auth = _auth) => {
  const [state, setState] = useState<'idel' | 'progress' | 'logined' | 'logouted' | 'error'>('idel')
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    onAuthStateChanged(auth, u => {
      setUser(u)
      if (u) {
        setState('logined')
      } else {
        setState('logouted')
      }
    })
  }, [auth, setUser])
  return { state, user }
}

export const useAuth = (auth: Auth = _auth) => {
  const [state, setState] = useState<'idel' | 'progress' | 'logined' | 'logouted' | 'error'>('idel')
  const [_user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<unknown>('');
  const router = useRouter()
  const login = useCallback(()=>{
    (async () => {
      setState('progress')
      try {
        const result = await signInWithPopup(auth, new GoogleAuthProvider())
        setError('')
        setUser(result.user)
        setState('logined')
        await addUser(result.user)
        Sentry.setUser({
          email: result.user.email ?? undefined,
          id: result.user.uid,
          username: result.user.displayName ?? undefined,
        })
      } catch (e) {
        setError(e)
        setState('error')
      }
    })()
  }, [auth, setUser])
  const logout = useCallback(()=>{
    (async () => {
      setState('progress')
      await signOut(auth)
      setUser(null)
      setState('logouted')
      Sentry.setUser(null);
      router.push("/")
    })()
  }, [auth, router])

  useEffect(()=>{
    onAuthStateChanged(auth, user => {
      setUser(user)
      if (user) {
        setState('logined')
      } else {
        setState('logouted')
      }
    })
  }, [auth, setUser])
  return { state, user: _user, login, logout, error }
}

export const useAuth_ = (auth: Auth) => {
  const [state, setState] = useState<'idel' | 'progress' | 'logined' | 'logouted' | 'error'>(
    'idel'
  );
  const [error, setError] = useState<unknown>('');
  const [credential, setCredential] = useState<UserCredential>();
  const dispatch = useCallback(
    (action: { type: 'login'; payload?: { token: string } } | { type: 'logout' }) => {
      setError('');
      switch (action.type) {
        case 'login':
          setState('progress');
          const token = action.payload?.token;
          if (token) {
            signInWithCredential(auth, GoogleAuthProvider.credential(token))
              .then((result) => {
                setCredential(result);
                setState('logined');
              })
              .catch((e) => {
                setError(e);
                setState('error');
              });
          } else {
            signInWithPopup(auth, new GoogleAuthProvider())
              .then((result) => {
                setCredential(result);
                setState('logined');
              })
              .catch((e) => {
                setError(e);
                setState('error');
              });
          }
          break;
        case 'logout':
          setState('progress');
          signOut(auth)
            .then(() => {
              setCredential(undefined);
              setState('logouted');
            })
            .catch((e) => {
              setError(e);
              setState('error');
            });
          break;
      }
    },
    [auth]
  );
  return { state, error, credential, dispatch };
};
