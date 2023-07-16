import Layout from "@/components/layout";
import { getCircle, getItem } from "@/lib/db";
import { CircleWithID } from "@/lib/types";
import { circleWingToString } from "@/lib/utils";
import { NextPageContext } from "next";

interface ItemProps {
  circle: CircleWithID
}

Circle.getInitialProps = async (ctx: NextPageContext): Promise<ItemProps> => {
  const { circleId } = ctx.query
  const circle = await getCircle(circleId as string) as CircleWithID
  return {
    circle
  }
}

export default function Circle(props: ItemProps) {
  return (<Layout>
    <div className="text-2xl">{props.circle.name}</div>
    <div className="text-xl">{props.circle.day}日目</div>
    <div className="text-xl">{circleWingToString(props.circle.wing)}{props.circle.place}</div>
    以下にサークルに登録されている購入物一覧を作る
  </Layout>)
}
