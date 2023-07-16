import Layout from "@/components/layout";
import { useAuth } from "@/hooks/auth";
import { auth } from "@/lib/firebase";

export default function Dashboard() {
  const { user } = useAuth(auth)
  return (<Layout>
    ここにダッシュボードを作る
  </Layout>)
}
