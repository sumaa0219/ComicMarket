import Layout from "@/components/layout";
import { useAuth } from "@/hooks/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Login() {
  const router = useRouter()
  const { state, login } = useAuth(auth)

  useEffect(() => {
    if (state === "logined") {
      router.push("/")
    }
  }, [router, state])

  return (
    <Layout>
      <div className="w-full min-h-full h-full flex justify-center items-center">
        <button className="btn btn-primary" onClick={login}>Sign in</button>
      </div>
    </Layout>
  )
}
