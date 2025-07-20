import AddCircle from "@/components/add/circle";
import { CircleItemContext } from "@/components/add/contexts";
import AddItem from "@/components/add/item";
import Layout from "@/components/layout";
import { useAuth } from "@/hooks/auth";
import { getAllCircles, getAllItems } from "@/lib/db";
import { auth } from "@/lib/firebase";
import { CircleWithID, ItemWithID } from "@/lib/types";
import { NextPageContext } from "next";
import Head from "next/head";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

interface AddProps {
  circles: CircleWithID[];
  items: ItemWithID[];
}
Add.getInitialProps = async (ctx: NextPageContext): Promise<AddProps> => {
  return {
    circles: await getAllCircles(),
    items: await getAllItems(),
  }
}

export default function Add(props: AddProps) {
  const [step, setStep] = useState<number>(1)
  const [circle, setCircle] = useState<CircleWithID | null>(null)
  const [item, setItem] = useState<ItemWithID | null>(null)

  // all
  const [circles, setAllCircles] = useState<CircleWithID[]>(props.circles)
  const [items, setAllItems] = useState<ItemWithID[]>(props.items)

  // interface CreatedFlags {
  //   circle: boolean;
  //   item: boolean;
  // }
  // const [createdFlags, setCreatedFlags] = useState<CreatedFlags>({
  //   circle: false,
  //   item: false
  // })

  useEffect(() => {
    console.log({ circle, item })
  }, [circle, item])

  const { user } = useAuth(auth)
  return (<Layout title="購入物追加" center>
    <CircleItemContext.Provider value={{
      circles,
      items,
      addNewCircle(circle) {
        setAllCircles(c => [...c, circle])
      },
      addNewItem(item) {
        setAllItems(i => [...i, item])
      },
    }}>
      <Head>
        <title>
          {
            step === 1
              ? "サークル | 購入物追加"
              : step === 2
                ? "購入物 | 購入物追加"
                : step === 3
                  ? "完了 | 購入物追加"
                  : " | 購入物追加"
          }
        </title>
      </Head>
      <div className="flex flex-col border rounded-lg border-gray-500 xl:w-1/3 p-12 mx-auto">
        {
          [
            null,
            <AddCircle onSelect={c => {
              setCircle(c)
              setStep(s => s + 1)
            }} key={null} />,
            <AddItem
              circle={circle}
              key={null}
              onAdd={item => {
                setItem(item)
                setStep(s => s + 1)
              }}
            />,
            circle && item && user && <div key={step} className="flex flex-col">
              <div>
                以下の購入物が追加されました
              </div>
              <div className="flex justify-center text-xl">
                サークル : {circle.name}
              </div>
              <div className="flex justify-center text-xl">
                購入物 : {item.name}
              </div>
              <div className="flex justify-center">
                {item?.price ?? "??"}円
              </div>
              <div className="flex justify-center">
                {item.users.find(u => u.uid === user.uid)?.count ?? "??"}個
              </div>
              <Link href={`/item/${item.id}`}>
                <button className="btn w-full mt-4">購入物の詳細</button>
              </Link>
              <button className="btn w-full mt-4" onClick={() => setStep(2)}>同じサークルで登録を続ける</button>
              <button className="btn w-full mt-4" onClick={() => setStep(1)}>別のサークルで登録を続ける</button>
            </div>
          ][step]
        }
      </div>
    </CircleItemContext.Provider>
  </Layout>)
}
