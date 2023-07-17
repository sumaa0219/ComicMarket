import Layout from "@/components/layout";
import { getAllItems, getAllUsers, getCircle, getURL } from "@/lib/db";
import { CircleWithID, ItemWithID, UserdataWithID } from "@/lib/types";
import { circleWingToString } from "@/lib/utils";
import { NextPageContext } from "next";
import Image from "next/image";
import Link from "next/link";

interface ItemProps {
  circle: CircleWithID;
  users: UserdataWithID[];
  items: ItemWithID[];
  menuImageURL?: string;
}

Circle.getInitialProps = async (ctx: NextPageContext): Promise<ItemProps> => {
  const { circleId } = ctx.query as { circleId: string }
  const data: ItemProps = {
    circle: await getCircle(circleId),
    users: await getAllUsers(),
    items: (await getAllItems()).filter(item => item.circleId === circleId),
  }
  if (data.circle.menuImagePath) {
    data.menuImageURL = await getURL(data.circle.menuImagePath)
  }
  return data
}

export default function Circle(props: ItemProps) {
  return (<Layout title="サークル詳細">
    <div className="text-2xl">{props.circle.name}</div>
    <div className="text-xl">{props.circle.day}日目</div>
    <div className="text-xl">{circleWingToString(props.circle.wing)}{props.circle.place}</div>

    {
      props.menuImageURL
      && <Link href={props.menuImageURL} target="_blank" className="">
        <Image src={props.menuImageURL} width={500} height={500} alt={""} className="m-8 ml-20" />
      </Link>
    }

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
            ? <tr>
              <td>
                No data found
              </td>
            </tr>
            : props.items.map((item, i) => item.users.map((user, j) => (
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
