import Layout from "@/components/layout";
import { getItem } from "@/lib/db";
import { NextPageContext } from "next";
import { useRouter } from "next/router";

interface ItemProps {
  item: ItemWithID
}

Item.getInitialProps = async (ctx: NextPageContext): Promise<ItemProps> => {
  const { itemId } = ctx.query
  const item = await getItem(itemId as string) as ItemWithID
  return {
    item
  }
}

export default function Item(props: ItemProps) {
  return (<Layout>
    <div className="text-2xl">{props.item.name}</div>
    <div className="text-xl">価格 : {props.item.price}</div>
    <div className="text-xl">個数 : {props.item.count}</div>
    以下に購入者と購入数を表にする
  </Layout>)
}
