import CircleSelector from "@/components/circleSelector"
import Layout from "@/components/layout"
import { addCircle, addItem, getAllCircles, getAllItems } from "@/lib/db"
import { Metadata, NextPageContext } from "next"
import { useEffect, useState } from "react"

export const metadata: Metadata = {
  title: "購入物追加",
}

interface AddItemProps {
  circles: CircleWithID[];
  items?: Item[];
}

AddItem.getInitialProps = async (ctx: NextPageContext): Promise<AddItemProps> => {
  return {
    circles: await getAllCircles(),
    items: await getAllItems(),
  }
}

export default function AddItem(props: AddItemProps) {
  const [item, setItem] = useState<null | Item>(null)
  const [itemAddMessage, setItemAddMessage] = useState<string>("")
  const [circle, setCircle] = useState<null | CircleWithID>(null)
  const [circleID, setCircleID] = useState<string>("")

  useEffect(() => {
    (async () => {
      if (item !== null) {
        // const matches = {
        //   name: props.circles.some(c => c.name === circle.name),
        //   place: props.circles.some(c => c.place === circle.place)
        // }
        // あとで購入物の重複登録チェックを実装する
        if (false) {
          
        } else {
          await addItem(item)
          setItem(null)
          setItemAddMessage("購入物が追加されました")
          await new Promise(resolve => setTimeout(resolve, 3000))
          setItemAddMessage("")
        }
      }
    })()
  }, [item, props.circles])

  return (
    <Layout title="購入物追加">
      <form className="form-control h-screen flex pt-8" onSubmit={e => {
        e.preventDefault()
        const itemData: Item = {
          circleId: (e.target as any).circleId.value,
          name: (e.target as any).itemName.value,
          price: parseInt((e.target as any).itemPrice.value),
          count: parseInt((e.target as any).itemCount.value),
          priority: parseInt((e.target as any).priority.value),
        }
        setItem(itemData)
      }}
      >

        <div className="flex flex-col w-1/3 border rounded-lg border-gray-500 p-12 mx-auto">
          <label className="label" htmlFor="itemName">
            <span className="label-text">サークル</span>
          </label>
          <CircleSelector circles={props.circles} onChange={c => {
            setCircle(c)
            setCircleID(c.id)
          }} />
          {circle && <p>選択中 : {circle.name} （{circle.day}日目 {({
            west: "西",
            east: "東",
            south: "南",
          })[circle.wing]}{circle.place}）</p>}
          <input type="hidden" id="circleId" value={circleID} />

          <label className="label" htmlFor="itemName">
            <span className="label-text">購入物名</span>
          </label>
          <input type="text" id="itemName" placeholder="新刊セット" className="input input-bordered" required />

          <label className="label" htmlFor="itemPrice">
            <span className="label-text">価格</span>
          </label>
          <input type="number" id="itemPrice" placeholder="500" className="input input-bordered" required />

          <label className="label" htmlFor="itemCount">
            <span className="label-text">個数</span>
          </label>
          <input type="number" id="itemCount" placeholder="1" className="input input-bordered" required />

          <label className="label" htmlFor="priority">
            <span className="label-text">優先度</span>
          </label>
          <div className="rating">
            <input type="radio" name="priority" className="mask mask-star" value={1} />
            <input type="radio" name="priority" className="mask mask-star" value={2} />
            <input type="radio" name="priority" className="mask mask-star" value={3} defaultChecked />
            <input type="radio" name="priority" className="mask mask-star" value={4} />
            <input type="radio" name="priority" className="mask mask-star" value={5} />
          </div>

          <div className="mt-4">
            <input type="submit" value={item === null ? "追加" : "送信中..."} className={`btn btn-primary ${item && "btn-disabled"}`} />
          </div>

          <div>
            {itemAddMessage}
          </div>
        </div>
      </form>
    </Layout>
  )
}
