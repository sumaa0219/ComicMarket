import Layout from "@/components/layout";
import { getAllCircles, getAllItems, getAllUsers, getCircle, getItem, getUser } from "@/lib/db";
import { CircleWithID, ItemWithID, UserdataWithID } from "@/lib/types";
import { circleWingToString } from "@/lib/utils";
import { NextPageContext } from "next";
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
  const items = (await getAllItems()).filter(item => item.users.find(u => u.uid === userId))
  return {
    circles: await getAllCircles(),
    user: await getUser(userId),
    items,
  }
}

export default function Circle(props: ItemProps) {
  let totalPrice = 0
  console.log(props.items)
  if (props.items.length === 0) {
    totalPrice = 0
  }
  else {
    let price = 0
    props.items.map((item, i) => item.users.map((user, j) => (
      price += Number(item.price) * Number(user.count)
    )))
    totalPrice = price
  }




  return (<Layout title="ユーザー詳細">
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
          </tr>
        </thead>
        <tbody>
          {props.items.length === 0
            ? <tr>
              <td>
                データなし
              </td>
            </tr>
            : props.items.map((item, i) => item.users.map((user, j) => (
              <tr key={`${i}-${j}`}>
                <td>
                  <Link href={`/circle/${item.circleId}`}>
                    {props.circles.find(c => c.id === item.circleId)?.name}
                  </Link>
                </td>
                <td>
                  <Link href={`/item/${item.id}`}>
                    {item.name}
                  </Link>
                </td>
                <td>{user.count}</td>
              </tr>
            )))}
        </tbody>
      </table>
    </div>
  </Layout>)
}
