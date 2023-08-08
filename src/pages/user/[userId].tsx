import Layout from "@/components/layout";
import { getAllCircles, getAllItems, getAllUsers, getCircle, getItem, getUser, removeBuyer } from "@/lib/db";
import { CircleWithID, ItemWithID, UserdataWithID } from "@/lib/types";
import { circleWingToString } from "@/lib/utils";
import { NextPageContext } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface ItemProps {
  circles: CircleWithID[];
  user: UserdataWithID;
  items: ItemWithID[];
}

Circle.getInitialProps = async (ctx: NextPageContext): Promise<ItemProps> => {
  const { userId } = ctx.query as { userId: string }
  /**
   * このユーザーが購入した購入物のみを取得する
   */
  const items: ItemWithID[] = (await getAllItems()).filter(item => item.users.find(u => u.uid === userId))
  return {
    circles: await getAllCircles(),
    user: await getUser(userId),
    items,
  }
}

export default function Circle(props: ItemProps) {
  const [processing, setProcessing] = useState(false)
  const [items, setItems] = useState<ItemWithID[]>(props.items)

  let totalPrice = 0
  if (items.length === 0) {
    totalPrice = 0
  }
  else {
    let price = 0
    items.map((item, i) => item.users.map((user, j) => (
      price += Number(item.price) * Number(user.count)
    )))
    totalPrice = price
  }

  return (<Layout title="ユーザー詳細">
    <Head>
      <title>{props.user.name} | ユーザー詳細</title>
    </Head>
    <div className="flex flex-row">
      <div className="avatar">
        <div className="w-24 rounded-xl">
          <Image className="rounded-xl" src={props.user.photoURL!} alt={props.user.name} width={200} height={200} />
        </div>
      </div>

      <div className="flex flex-col min-h-full">
        <div className="text-2xl my-auto ml-4">{props.user.name}</div>
      </div>
    </div>

    <div className="mt-12">
      合計金額:{totalPrice}円
    </div>

    <div className="mt-12">
      購入物一覧
    </div>
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th>サークル名</th>
            <th>購入物</th>
            <th>個数</th>
            <th>削除</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0
            ? <tr>
              <td>
                データなし
              </td>
            </tr>
            : items.map((item, i) => item.users.map((user, j) => (
              <tr key={`${i}-${j}`}>
                <td>
                  <Link href={`/circle/${item.circleId}`}>
                    {((): string =>{
                      const circle = props.circles.find(c => c.id === item.circleId)
                      if (circle) {
                        let circleName = circle.name
                        if (circle.deleted) {
                          circleName += "(削除済み)"
                        }
                        return circleName
                      } else {
                        return "サークルが見つかりません"
                      }
                    })()}
                  </Link>
                </td>
                <td>
                  <Link href={`/item/${item.id}`}>
                    {item.name}
                  </Link>
                </td>
                <td>{user.count}</td>
                <td>
                  <button className="btn btn-outline btn-sm btn-square btn-ghost" onClick={e => {
                    e.preventDefault()
                    setProcessing(true)
                    removeBuyer(item.id, user.uid).then(() => {
                      setProcessing(false)
                      setItems(prev => prev.map(p => p.id === item.id ? {
                        ...p,
                        users: p.users.filter(u => u.uid !== user.uid)
                      } : p))
                    })
                  }} disabled={processing}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-trash" width="20" height="20" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#ff0000" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" />
                      <line x1="4" y1="7" x2="20" y2="7" />
                      <line x1="10" y1="11" x2="10" y2="17" />
                      <line x1="14" y1="11" x2="14" y2="17" />
                      <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                      <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                    </svg>
                  </button>
                </td>
              </tr>
            )))}
        </tbody>
      </table>
    </div>
  </Layout>)
}
