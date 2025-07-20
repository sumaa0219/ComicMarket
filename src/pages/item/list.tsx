import CircleFilterForm from "@/components/circleFilterForm";
import Layout from "@/components/layout";
import Priority from "@/components/priority";
import { getAllCircles, getAllItems, getAllUsers } from "@/lib/db";
import { CircleWithID, ItemWithID, UserdataWithID } from "@/lib/types";
import { circleToDatePlaceString, filterItemsByCircles, sortItemByDP } from "@/lib/utils";
import { NextPageContext } from "next";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";

interface ItemListProps {
  circles: CircleWithID[];
  items: ItemWithID[];
  users: UserdataWithID[];
}

ItemList.getInitialProps = async (ctx: NextPageContext): Promise<ItemListProps> => {
  return {
    circles: await getAllCircles(),
    items: await getAllItems(),
    users: await getAllUsers(),
  }
}

export default function ItemList(props: ItemListProps) {
  const completeItems = filterItemsByCircles(props.items, props.circles)
  const initialItems = sortItemByDP(completeItems, props.circles)
  const [items, setItems] = useState<ItemWithID[]>(initialItems)

  return (
    <Layout title="購入物一覧">
      <Head>
        <title>購入物一覧</title>
      </Head>

      <CircleFilterForm
        circles={props.circles}
        onChange={circles => setItems(
          filterItemsByCircles(initialItems, circles)
        )}
      />

      {/* <div className="overflow-x-auto"> */}
      <table className="table">
        <thead>
          <tr>
            <th>サークル名</th>
            <th>場所</th>
            <th>購入物名</th>
            <th>単価</th>
            <th>購入者</th>
            <th>最高優先度</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => {
            const circle = props.circles.find(c => c.id === item.circleId)
            const highestPriority = item.users.map(u => u.priority).sort((a, b) => b - a)[0]
            if (circle == null) return <tr key={`${item.id}-${i}`}>
              <td>サークルが見つかりません</td>
            </tr>
            return (
              <tr className="" key={i}>
                <td className="">
                  <Link href={`/circle/${circle.id}`}>
                    {circle.name}
                  </Link>
                </td>
                <td>
                  {circleToDatePlaceString(circle)}
                </td>
                <td className="">
                  <Link href={`/item/${item.id}`}>
                    {item.name}
                  </Link>
                </td>
                <td className="">
                  {item.price}円
                </td>
                <td className="">
                  {item.users.map((user, index) => (
                    <Link href={`/user/${user.uid}`} key={index} className={`${item.users.length - 1 !== index && `after:content-[',']`} mr-2`}>
                      {props.users.find(u => u.id === user.uid)?.name}
                    </Link>
                  ))}
                </td>
                <td>
                  {highestPriority && <Priority
                    priority={highestPriority}
                    name={`${item.id}-${i}`}
                    readOnly disabled
                  />}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <p className="text-xs mt-4 ml-4 text-gray-500">サークルによる絞り込みは出店日・出店場所を無視します。</p>
      {/* </div> */}
    </Layout>
  )
}
