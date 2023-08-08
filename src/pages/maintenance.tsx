import Layout from '@/components/layout'
import { useRouter } from 'next/router'

export default function Maintenance() {
  const { reload } = useRouter()

  return (
    <Layout>
      <section className="flex flex-col gap-6">
        <p className="title">メンテナンス中</p>
        <p>
          ちょっとまってて
        </p>
        <button onClick={reload}>再読み込み</button>
      </section>
    </Layout>
  )
}
