import Layout from "@/components/layout";
import { getAllUsers, getCircle, getItem, removeBuyer } from "@/lib/db";
import { CircleWithID, ItemWithID, UserdataWithID } from "@/lib/types";
import { circleWingToString } from "@/lib/utils";
import { NextPageContext } from "next";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";

interface ItemProps {
  item: ItemWithID,
  circle: CircleWithID,
  users: UserdataWithID[];
}

Item.getInitialProps = async (ctx: NextPageContext): Promise<ItemProps> => {
  const { itemId } = ctx.query
  const item = await getItem(itemId as string)
  return {
    item: item,
    circle: await getCircle(item.circleId),
    users: await getAllUsers(),
  }
}

export default function Item(props: ItemProps) {
  const [processing, setProcessing] = useState(false)
  const [item, setItem] = useState<ItemWithID>(props.item)
  return (<Layout title="購入物詳細">
    <Head>
      <title>{`${item.name} | 購入物詳細`}</title>
    </Head>
    <div className="flex flex-col">
      <div className="flex flex-row">
        <div className="text-3xl">{item.name}</div>
        <div className="text-2xl ml-4 flex items-end">{item.price}円</div>
      </div>
      <Link className="flex flex-row mt-4" href={`/circle/${props.circle.id}`}>
        <div className="text-xl">{props.circle.name}</div>
        <div className="text-xl ml-4">{props.circle.day}日目 {circleWingToString(props.circle.wing)} {props.circle.place}</div>
      </Link>
    </div>

    <div className="w-96 overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th>購入者</th>
            <th>個数</th>
            <th>削除</th>
          </tr>
        </thead>
        <tbody>
          {
            item.users.map((user, i) => (
              <tr key={i}>
                <td>
                  <Link href={`/user/${user.uid}`}>
                    {props.users.find(u => u.id === user.uid)?.name}
                  </Link>
                </td>
                <td>{user.count}</td>
                <td>
                  <button className="btn btn-outline btn-sm btn-square btn-ghost" onClick={e=>{
                    e.preventDefault()
                    setProcessing(true)
                    removeBuyer(item.id, user.uid).then(()=>{
                      setProcessing(false)
                      setItem(prev => ({
                        ...prev,
                        users: prev.users.filter(u => u.uid !== user.uid)
                      }))
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
            ))
          }
        </tbody>
      </table>
    </div>
  </Layout>)
}
