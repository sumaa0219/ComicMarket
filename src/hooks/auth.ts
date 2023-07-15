import { Auth, UserCredential, signInWithCredential, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from "firebase/auth";
import { useState, useCallback, useEffect } from "react";

export const useAuth = (auth: Auth) => {
  const [state, setState] = useState<'idel' | 'progress' | 'logined' | 'logouted' | 'error'>('idel')
  const [user, setUser] = useState<User | null>(null);
  const login = useCallback(()=>{
    (async () => {
      setState('progress')
      const result = await signInWithPopup(auth, new GoogleAuthProvider())
      setUser(result.user)
      setState('logined')
    })()
  }, [auth])
  const logout = useCallback(()=>{
    (async () => {
      setState('progress')
      await signOut(auth)
      setUser(null)
      setState('logouted')
    })()
  }, [auth])

  useEffect(()=>{
    onAuthStateChanged(auth, user => {
      setUser(user)
      if (user) {
        setState('logined')
      } else {
        setState('logouted')
      }
    })
  }, [auth])
  return { state, user, login, logout }
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
