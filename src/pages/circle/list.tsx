import CircleFilterForm from "@/components/circleFilterForm"
import Layout from "@/components/layout"
import { getAllCircles } from "@/lib/db"
import { CircleWithID, CircleCondition, circleCondition } from "@/lib/types"
import { circleWingToString, filterDeleted, isMatchCondition, sortCircleByDP } from "@/lib/utils"
import { Metadata, NextPageContext } from "next"
import Head from "next/head"
import Link from "next/link"
import { useCallback, useEffect, useRef, useState } from "react"

export const metadata: Metadata = {
  title: "購入物追加",
}

interface ListCircleProps {
  circles: CircleWithID[]
}

ListCircle.getInitialProps = async (ctx: NextPageContext): Promise<ListCircleProps> => {
  const circles = await getAllCircles()
  return {
    circles
  }
}

export default function ListCircle(props: ListCircleProps) {
  const initialCircles = sortCircleByDP(props.circles)
  const [circles, setCircles] = useState<CircleWithID[]>(initialCircles)

  return (
    <Layout title="サークル一覧">
      <Head>
        <title>サークル一覧</title>
      </Head>

      <CircleFilterForm
        circles={props.circles}
        onChange={(c) => setCircles(c)}
        enableCircleSelector={false}
      />

      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>サークル名</th>
              <th>出店日</th>
              <th>出店棟</th>
              <th>出店場所</th>
            </tr>
          </thead>
          <tbody>
            {
            circles.map((c, i) => (
              <tr className="" key={i}>
                <td className="">
                  <Link href={`/circle/${c.id}`} className={`w-full ${c.deleted && "text-neutral-500"}`}>
                    { c.deleted ? `${c.name} (削除済み)` : c.name}
                  </Link>
                </td>
                <td>{c.day}日目</td>
                <td>{circleWingToString(c.wing)}</td>
                <td>{c.place}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  )
}
