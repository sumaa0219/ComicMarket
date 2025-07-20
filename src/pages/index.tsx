import Layout from "@/components/layout";
import { useAuth } from "@/hooks/auth";
import { auth } from "@/lib/firebase";
import { NextPageContext } from "next";
import Head from "next/head";
import Link from "next/link";

interface HomeProps {
  COMMIT_SHA: string;
}
Home.getInitialProps = async (ctx: NextPageContext): Promise<HomeProps> => {
  return {
    COMMIT_SHA: process.env.VERCEL_GIT_COMMIT_SHA ?? "UNKNOWN_COMMIT_SHA",
  }
}

export default function Home({ COMMIT_SHA }: HomeProps) {
  const { user } = useAuth(auth)
  return (
    <Layout center>
      <Head>
        <title>ホーム</title>
      </Head>
      <div className="flex flex-col">
        <Link className="text-xl mb-2 link" href="/add">サークル/購入物追加</Link>
        <Link className="text-xl mb-2 link" href="/item/list">購入物一覧</Link>
        <Link className="text-xl mb-2 link" href={`/user/${user?.uid}`}>自分の購入物一覧</Link>
      </div>
      <div className="mt-48 text-neutral">
        <Link href={`https://github.com/pycabbage/ComicMarket-fork/tree/${COMMIT_SHA}`} target="_blank">
          COMMIT_SHA: {COMMIT_SHA}
        </Link>
      </div>
    </Layout>
  )
}
