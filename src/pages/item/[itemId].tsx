import Layout from "@/components/layout";
import { getAllUsers, getItem } from "@/lib/db";
import { ItemWithID, UserdataWithID } from "@/lib/types";
import { NextPageContext } from "next";
import Link from "next/link";

interface ItemProps {
  item: ItemWithID,
  users: UserdataWithID[];
}

Item.getInitialProps = async (ctx: NextPageContext): Promise<ItemProps> => {
  const { itemId } = ctx.query
  return {
    item: await getItem(itemId as string) as ItemWithID,
    users: await getAllUsers(),
  }
}

export default function Item(props: ItemProps) {
  return (<Layout title="購入物詳細">
    <div className="text-2xl">{props.item.name}</div>
    <div className="text-xl">{props.item.price}円</div>

    <div className="w-96 overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th>購入者</th>
            <th>個数</th>
          </tr>
        </thead>
        <tbody>
          {
            props.item.users.map((user, i) => (
              <tr key={i}>
                <td>
                  <Link href={`/user/${user.uid}`}>
                    {props.users.find(u => u.id === user.uid)?.name}
                  </Link>
                </td>
                <td>{user.count}</td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  </Layout>)
}
