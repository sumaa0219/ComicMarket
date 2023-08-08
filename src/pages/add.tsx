import AddCircle from "@/components/add/circle";
import AddItem from "@/components/add/item";
import Layout from "@/components/layout";
import { useAuth } from "@/hooks/auth";
import { getAllCircles, getAllItems } from "@/lib/db";
import { auth } from "@/lib/firebase";
import { CircleWithID, ItemWithID } from "@/lib/types";
import { NextPageContext } from "next";
import Link from "next/link";
import { useState } from "react";

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
  const { user } = useAuth(auth)
  return (<Layout title="購入物追加" center>
    <div className="flex flex-col border rounded-lg border-gray-500 xl:w-1/3 p-12 mx-auto">
      {
        [
          null,
          <AddCircle circles={props.circles} onSelect={c => {
            setCircle(c)
            setStep(s => s + 1)
          }} key={null} />,
          <AddItem
            items={props.items}
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
  </Layout>)
}
