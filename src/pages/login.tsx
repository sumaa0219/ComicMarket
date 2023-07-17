import Layout from "@/components/layout";
import { useAuth } from "@/hooks/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";

export default function Login() {
  const router = useRouter()
  const { state, login, error } = useAuth(auth)
  const dialogRef = useRef<HTMLDialogElement|null>(null)

  useEffect(() => {
    if (state === "logined") {
      router.push("/")
    } else if (state === "error") {
      console.error(error)
      dialogRef.current?.showModal()
    }
  }, [error, router, state])

  return (
    <Layout>
      <div className="w-full min-h-full h-full flex justify-center items-center">
        <button className="btn btn-primary" onClick={login}>Sign in</button>
      </div>
      <dialog id="errorModal" className="modal" ref={dialogRef}>
        <form method="dialog" className="modal-box">
          <h3 className="font-bold text-lg">ログインエラー</h3>
          <p className="py-4">{JSON.stringify(error)}</p>
          <p className="py-4">このページをスクショしてキャベツに送れ</p>
          <div className="modal-action">
            <button className="btn">閉じる</button>
          </div>
        </form>
      </dialog>
    </Layout>
  )
}
