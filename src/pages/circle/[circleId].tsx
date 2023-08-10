import Layout from "@/components/layout";
import { getAllItems, getAllUsers, getCircle, getURL, removeCircle } from "@/lib/db";
import { CircleWithID, ItemWithID, UserdataWithID } from "@/lib/types";
import { circleWingToString } from "@/lib/utils";
import { NextPageContext } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useRef } from "react";


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
  const router = useRouter()
  const dialogRef = useRef<HTMLDialogElement>(null)

  return (<Layout title="サークル詳細">
    <Head>
      <title>{`${props.circle.name} | サークル詳細`}</title>
    </Head>
    <div className="flex flex-row">
      <div className="w-1/4 flex flex-col justify-center items-center">
        <div className="text-4xl">{props.circle.name}</div>
        <div className="text-2xl">{props.circle.day}日目</div>
        <div className="text-xl">{circleWingToString(props.circle.wing)}{props.circle.place}</div>
      </div>

      {
        props.menuImageURL
        && <Fragment>
          <Link href={props.menuImageURL} target="_blank" onClick={e => {
            e.preventDefault()
            dialogRef.current?.showModal()
          }}>
            <Image src={props.menuImageURL} width={200} height={200} alt={""} />
          </Link>
          <dialog id="my_modal_2" className="modal" ref={dialogRef}>
            <form method="dialog" className="modal-box">
              <Link href={props.menuImageURL} target="_blank">
                <Image src={props.menuImageURL} width={800} height={800} alt={""} />
              </Link>
            </form>
            <form method="dialog" className="modal-backdrop">
              <button>close</button>
            </form>
          </dialog>
        </Fragment>
      }
    </div>

    <button className="btn btn-primary" onClick={e => {
      e.preventDefault()
      removeCircle(props.circle.id)
      router.push(`/circle/list`)
    }}>サークル削除</button>

    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th>購入者</th>
            <th>購入物</th>
            <th>個数</th>
            <th>優先度</th>
          </tr>
        </thead>
        <tbody>
          {props.items.length === 0
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
            )))}
        </tbody>
      </table>
    </div>
  </Layout>)
}
