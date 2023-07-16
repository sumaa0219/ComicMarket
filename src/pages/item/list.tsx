import CircleSelector from "@/components/circleSelector";
import Layout from "@/components/layout";
import CircleCard from "@/lib/circleCard";
import { getAllCircles, getAllItems } from "@/lib/db";
import { CircleWithID, ItemWithID, CircleCondition } from "@/lib/types";
import { circleWingToString, isMatchCondition } from "@/lib/utils";
import { NextPageContext } from "next";
import Link from "next/link";
import { useState, useEffect, useRef, Fragment } from "react";

interface ItemListProps {
  circles: CircleWithID[];
  items: ItemWithID[];
}

ItemList.getInitialProps = async (ctx: NextPageContext): Promise<ItemListProps> => {
  return {
    circles: await getAllCircles(),
    items: await getAllItems(),
  }
}

export default function ItemList(props: ItemListProps) {
  const [items, setItems] = useState<ItemWithID[]>(props.items)
  const [circle, setCircle] = useState<null | CircleWithID>(null)
  const [circleID, setCircleID] = useState<string>("")
  const [condition, setCondition] = useState<CircleCondition>({
    name: "",
    place: "",
    days: {
      "1": true,
      "2": true,
    },
    wings: {
      west: true,
      east: true,
      south: true,
    }
  })

  useEffect(()=>{
    if (circle != null) {
      setItems(props.items.filter(i => i.circleId == circle.id))
    } else {
      setItems(props.items.filter(i => isMatchCondition(condition, props.circles.find(c => c.id == i.circleId)!)))
    }
  }, [circle, condition, props.circles, props.items])

  const formRef = useRef<HTMLFormElement>(null)
  return (
    <Layout title="購入物一覧">
      <form
        className="flex flex-row mb-4 items-center"
        ref={formRef}
        onChange={() => {
          if (formRef.current) {
            setCondition({
              name: "",
              place: "",
              days: Object.fromEntries(Array.from<HTMLInputElement>(formRef.current.circleDay).map(d => [d.value, d.checked])),
              wings: Object.fromEntries(Array.from<HTMLInputElement>(formRef.current.circleWing).map(d => [d.value, d.checked])),
            } as CircleCondition)
          }
        }}
        onSubmit={e => e.preventDefault()}
      >
        <div className="flex flex-row">
          {
            circle
              ? <Fragment>
                <CircleCard circle={circle} onUnselect={() => {
                  setCircle(null)
                  setCircleID("")
                }} />
              </Fragment>
              : <Fragment>
                <CircleSelector circles={props.circles} onChange={c => {
                  setCircle(c)
                  setCircleID(c.id)
                }} />
                <input type="hidden" id="circleId" value={circleID} />
              </Fragment>
          }
        </div>

        <div className="divider lg:divider-horizontal">または</div>

        <div className="flex flex-row">
          <div className="ml-2">
            <label className="label">
              <span className="label-text">出店日</span>
            </label>
            <div className="join">
              <input className="join-item btn" type="checkbox" name="circleDay" aria-label="1日目" value="1" defaultChecked />
              <input className="join-item btn" type="checkbox" name="circleDay" aria-label="2日目" value="2" defaultChecked />
            </div>
          </div>

          <div className="ml-2">
            <label className="label">
              <span className="label-text">出店棟</span>
            </label>
            <div className="join">
              <input className="join-item btn" type="checkbox" id="circleWing" name="circleWing" aria-label="西" value="west" defaultChecked />
              <input className="join-item btn" type="checkbox" id="circleWing" name="circleWing" aria-label="東" value="east" defaultChecked />
              <input className="join-item btn" type="checkbox" id="circleWing" name="circleWing" aria-label="南" value="south" defaultChecked />
            </div>
          </div>
        </div>
      </form>

      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>サークル名</th>
              <th>購入物名</th>
              <th>単価</th>
              <th>購入者</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr className="" key={i}>
                <td className="">
                    {(()=>{
                      const circle = props.circles.find(c => c.id === item.circleId)
                      if (circle == null) return "サークルが見つかりません"
                      return (
                        <Link href={`/circle/${circle.id}`}>
                          {circle.name} （{circle.day}日目 {circleWingToString(circle.wing)}{circle.place}）
                        </Link>
                      )
                    })()}
                </td>
                <td className="">
                  <Link href={`/item/${item.id}`}>
                    {item.name}
                  </Link>
                </td>
                <td className="">
                  {item.price}円
                </td>
                <td className="">
                  {item.users.map((user, i) => (`${user.uid}`))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-xs mt-4 ml-4 text-gray-500">サークルによる絞り込みは出店日・出店場所を無視します。</p>
      </div>
    </Layout>
  )
}
