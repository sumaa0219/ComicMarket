import { addUser } from "@/lib/db";
import { Auth, GoogleAuthProvider, User, UserCredential, onAuthStateChanged, signInWithCredential, signInWithPopup, signOut } from "firebase/auth";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

export const useAuth = (auth: Auth) => {
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
