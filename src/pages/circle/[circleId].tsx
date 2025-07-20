import Layout from "@/components/layout";
import Priority from "@/components/priority";
import { getAllItems, getAllUsers, getCircle, getURL, removeCircle, updateCircle, updatePriority, uploadImage } from "@/lib/db";
import { CircleWithID, ItemWithID, UserdataWithID, circleWithID } from "@/lib/types";
import { circleWingToString } from "@/lib/utils";
import { NextPageContext } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useRef, useState } from "react";

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
  const [circle, setCircle] = useState(props.circle)
  const router = useRouter()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [items, setItems] = useState<ItemWithID[]>(props.items)
  const [sending, setSending] = useState(false)
  const circleEditDialogRef = useRef<HTMLDialogElement>(null)

  const [fileUploading, setFileUploading] = useState(false)

  return (<Layout title="サークル詳細">
    <Head>
      <title>{`${circle.name} | サークル詳細`}</title>
    </Head>
    <div className="flex flex-row gap-4">
      <div className="w-1/4 flex flex-col justify-center items-center">
        <input
          type="text"
          className="input text-4xl text-center"
          aria-label="サークル名"
          defaultValue={circle.name}
          onChange={e => {
            const { value } = e.currentTarget
            const newCircle = { ...circle, name: value }
            setCircle(newCircle)
            updateCircle(newCircle, circle.id)
          }}
        />
        <button className="text-2xl" onClick={() => circleEditDialogRef?.current?.showModal()}>
          {circle.day}日目
        </button>
        <button className="text-xl" onClick={() => circleEditDialogRef?.current?.showModal()}>
          {circleWingToString(circle.wing)}{circle.place}
        </button>
        <dialog id="circleEditDialogRef" className="modal" ref={circleEditDialogRef}>
          <form method="dialog" className="modal-box flex flex-col gap-4">
            <h3 className="font-bold text-lg">サークル編集</h3>
            {/* <p className="py-4">Press ESC key or click the button below to close</p> */}
            <div className="join">
              {
                [
                  ["1", "1日目"],
                  ["2", "2日目"],
                ].map(([value, label]) => (
                  <input
                    key={value}
                    className="join-item btn"
                    type="radio"
                    name="circleDayChangeForm"
                    aria-label={label}
                    value={value}
                    required
                    defaultChecked={circle.day === value}
                    onClick={e => {
                      const { value } = e.currentTarget
                      const newCircle = circleWithID.parse({ ...circle, day: value })
                      setCircle(newCircle)
                      updateCircle(newCircle, circle.id)
                    }}
                  />
                ))
              }
            </div>
            <div className="join">
              {
                [
                  ["west", "西"],
                  ["east", "東"],
                  ["south", "南"],
                ].map(([value, label]) => (
                  <input
                    key={value}
                    className="join-item btn"
                    type="radio"
                    name="circleWingChangeForm"
                    aria-label={label}
                    value={value}
                    required
                    defaultChecked={circle.wing === value}
                    onClick={e => {
                      const { value } = e.currentTarget
                      const newCircle = circleWithID.parse({ ...circle, wing: value })
                      setCircle(newCircle)
                      updateCircle(newCircle, circle.id)
                    }}
                  />
                ))
              }
            </div>
            <div className="modal-action">
              <button className="btn">閉じる</button>
            </div>
          </form>
        </dialog>
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
      removeCircle(circle.id)
      router.push(`/circle/list`)
    }}>サークル削除</button>

    {
      true
        ? <form action="" className="mt-2">
          <label htmlFor="file">{fileUploading ? "お品書きアップロード中" : "お品書き追加/更新"}</label>
          <input
            type="file"
            name="circleImage"
            accept="image/*"
            className="file-input file-input-bordered ml-2"
            aria-label={fileUploading ? "お品書きアップロード中" : "お品書き追加"}
            disabled={fileUploading}
            onChange={async e => {
              console.log("onChange")
              if (e.target.files && e.target.files?.length > 0) {
                const file = e.target.files[0]
                setFileUploading(true)
                const fullPath = await uploadImage(file, props.circle.id)
                const { id: _id, ...circleWithoutId } = props.circle
                const updatedCircle = await updateCircle({
                  ...circleWithoutId,
                  menuImagePath: fullPath,
                }, props.circle.id)
                setFileUploading(false)
                router.push(`/circle/${updatedCircle.id}`)
              }
            }}
          />
        </form>
        : null
    }

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
          {items.length === 0
            ? <tr>
              <td>
                No data found
              </td>
            </tr>
            : items.map(
              (item, i) => item.users.map(
                (user, j) => (
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
                    <td>
                      <Priority
                        name={`item-${i}_user-${j}`}
                        priority={user.priority}
                        onChange={async (priority) => {
                          setSending(true)
                          await updatePriority(item.id, user.uid, priority)
                          setItems(prevItems => {
                            prevItems[i].users[j].priority = priority
                            return prevItems
                          })
                          setSending(false)
                        }}
                      />
                    </td>
                  </tr>
                )
              )
            )
          }
        </tbody>
      </table>
    </div>
  </Layout>)
}
