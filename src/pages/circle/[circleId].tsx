import Layout from "@/components/layout";
import { getAllItems, getAllUsers, getCircle, getItem } from "@/lib/db";
import { CircleWithID, ItemWithID, UserdataWithID } from "@/lib/types";
import { circleWingToString } from "@/lib/utils";
import { NextPageContext } from "next";
import Link from "next/link";

interface ItemProps {
  circle: CircleWithID;
  users: UserdataWithID[];
  items: ItemWithID[];
}

Circle.getInitialProps = async (ctx: NextPageContext): Promise<ItemProps> => {
  const { circleId } = ctx.query as { circleId: string }
  const items = (await getAllItems()).filter(item => item.circleId === circleId)
  return {
    circle: await getCircle(circleId) as CircleWithID,
    users: await getAllUsers(),
    items,
  }
}

export default function Circle(props: ItemProps) {
  return (<Layout title="サークル詳細">
    <div className="text-2xl">{props.circle.name}</div>
    <div className="text-xl">{props.circle.day}日目</div>
    <div className="text-xl">{circleWingToString(props.circle.wing)}{props.circle.place}</div>

    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th>購入者</th>
            <th>購入物</th>
            <th>個数</th>
          </tr>
        </thead>
        <tbody>
          { props.items.length === 0 
            ? "No data found"
            :props.items.map((item, i) => item.users.map((user, j) => (
            <tr key={`${i}-${j}`}>
              <td>
                <Link href={`/user/${user.uid}`}>
                  {props.users.find(u => u.id === user.uid)?.name}
                </Link>
              </td>
              <td>
                <Link href={`/item/${item.id}`}>
                  {item.name}
                </Link>
              </td>
              <td>{user.count}</td>
            </tr>
          ))) }
        </tbody>
      </table>
    </div>
  </Layout>)
}
