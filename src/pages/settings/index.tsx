import Layout from "@/components/layout";
import { useAuth } from "@/hooks/auth";
import { getUser, addUser, updateUserName } from "@/lib/db";
import { UserdataWithID } from "@/lib/types";
import Head from "next/head";
import { useEffect, useState } from "react";


export default function Settings() {
  const { user } = useAuth();
  const [userData, setUserData] = useState<UserdataWithID | null>(null)
  const [name, setName] = useState<string>("")
  const [sending, setSending] = useState<boolean>(false)
  const [message, setMessage] = useState<string>("")
  useEffect(() => {
    (async () => {
      if (user && !userData) {
        const data = await getUser(user.uid)
        setUserData(data)
        setName(data.name)
      }
    })()
  }, [message, user, userData])

  return (
    <Layout center>
      <Head>
        <title>設定</title>
      </Head>
      <h1>Settings</h1>
      <form onSubmit={e => {
        e.preventDefault()
        if (user && name && !message) {
          setSending(true)
          updateUserName(user.uid, name)
          setSending(false)
          setMessage("ユーザー名を変更しました。");
          (new Promise(r => setTimeout(r, 5000)))
            .then(() => setMessage(""))
        }
      }}>
        <label className="label" htmlFor="userName">
          <span className="label-text">ユーザー名</span>
        </label>
        <div className="join">
          <input
            type="text"
            id="userName"
            placeholder="ユーザー名"
            value={name}
            className="join-item input input-bordered"
            onChange={e => setName(e.currentTarget.value)}
            disabled={sending}
          />
          <input
            type="submit"
            value="更新"
            className="join-item btn"
            disabled={sending}
          />
        </div>
        {message && <p>{message}</p>}
      </form>
    </Layout>
  );
}
