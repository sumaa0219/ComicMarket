import { addUser } from "@/lib/db";
import { Auth, GoogleAuthProvider, User, onAuthStateChanged, signInWithCredential, signInWithPopup, signOut } from "firebase/auth";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import * as Sentry from '@sentry/nextjs';
import { auth as _auth } from "@/lib/firebase";

export const useAuth = (auth: Auth = _auth) => {
  const [state, setState] = useState<'idel' | 'progress' | 'logined' | 'logouted' | 'error'>('idel')
  const [_user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<unknown>('');
  const router = useRouter()
  const login = useCallback(() => {
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
  const logout = useCallback(() => {
    (async () => {
      setState('progress')
      await signOut(auth)
      setUser(null)
      setState('logouted')
      Sentry.setUser(null);
      router.push("/")
    })()
  }, [auth, router])

  useEffect(() => {
    onAuthStateChanged(auth, user => {
      setUser(user)
      // console.debug("onAuthStateChanged", user)
      if (user) {
        setState('logined')
      } else {
        setState('logouted')
      }
    })
  }, [auth, setUser])
  return { state, user: _user, login, logout, error }
}
