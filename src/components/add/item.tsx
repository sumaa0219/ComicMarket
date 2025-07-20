import { useAuth } from "@/hooks/auth";
import { addBuyer, addItem } from "@/lib/db";
import { auth } from "@/lib/firebase";
import { CircleWithID, ItemWithID } from "@/lib/types";
import { Fragment, useContext, useRef, useState } from "react";
import ItemSelector from "../itemSelector";
import { CircleItemContext } from "./contexts";

interface AddItemProps {
  // items?: ItemWithID[];
  circle?: CircleWithID | null;
  disabled?: boolean;
  onAdd?: (item: ItemWithID) => void;
}
export default function AddItem(props: AddItemProps) {
  const { user } = useAuth(auth)
  const { items, addNewItem } = useContext(CircleItemContext)
  const [item, setItem] = useState<ItemWithID | null>(null)
  const newItemFormRef = useRef<HTMLFormElement>(null)
  const addFormRef = useRef<HTMLFormElement>(null)
  const [newItem, setNewItem] = useState({
    name: "",
    price: 500
  })

  const [sending, setSending] = useState(false)

  function scrollPrevent(e: React.WheelEvent<HTMLInputElement>) {
    e.currentTarget.blur()
    e.preventDefault()
  }

  return items && props.circle && (
    <Fragment>
      {
        item
          ? <div className="flex flex-col">
            <div className="text-lg flex justify-center">
              {item.name}
            </div>
            <div className="flex justify-center mb-2">
              {item.price}円
            </div>
            <button className="btn mb-2" onClick={() => { setItem(null) }} disabled={sending}>選択解除</button>
          </div>
          : <ItemSelector items={items.filter(item => item.circleId === props.circle?.id)} onChange={item => {
            setItem(item)
          }} />
      }
      {
        !item && <Fragment>
          <div className="divider">または</div>
          <form ref={newItemFormRef} onChange={() => {
            setNewItem({
              name: newItemFormRef.current?.itemName.value,
              price: parseInt(newItemFormRef.current?.itemPrice.value),
            })
          }} className="form-control mb-6" onSubmit={e => e.preventDefault()}>
            <label className="label flex flex-col items-start" htmlFor="itemName">
              <span className="label-text">購入物名</span>
              <span className="label-text">
                表記ゆれがある場合は、一番簡潔かつ判別できる表記を使用してください。<br />
                例 :
                <ul className="list-disc ml-4">
                  <li>C104新刊セット → 新刊セット</li>
                </ul>
                また、入力前に上のボタンから既に登録された購入物がないかご確認ください。
              </span>
            </label>
            <input type="text" id="itemName" placeholder="例 : 新刊セット" className="input input-bordered"
              required
              disabled={sending}
            />

            <label className="label" htmlFor="itemPrice">
              <span className="label-text">価格</span>
            </label>
            <input type="number" id="itemPrice" placeholder="例 : 500" className="input input-bordered"
              min={0}
              defaultValue={500}
              required
              disabled={sending}
              onWheel={scrollPrevent}
            />
          </form>
        </Fragment>
      }

      {
        // 以前に登録していれば警告を表示
        item && item.users.find(u => u.uid === user?.uid) && (
          <Fragment>
            <div className="divider"></div>
            <div className="alert alert-warning">
              以前にこの購入物を登録しています : {item.users.find(u => u.uid === user?.uid)?.count}個<br />
              このまま登録を続ければ、以前の登録は上書きされます。
            </div>
          </Fragment>
        )
      }

      <div className="divider"></div>
      <form className="form-control" onSubmit={e => e.preventDefault()} ref={addFormRef} onChange={() => {
        const buyData = {
          userId: user?.uid,
          count: addFormRef.current?.itemCount.value,
          priority: addFormRef.current?.priority.value,
        }
      }}>
        <label className="label" htmlFor="itemCount">
          <span className="label-text">個数</span>
        </label>
        <input type="number" id="itemCount" placeholder="1" defaultValue={1} className="input input-bordered"
          disabled={sending}
          required
          min={1}
          onWheel={scrollPrevent}
        />

        <label className="label" htmlFor="priority">
          <span className="label-text">優先度</span>
        </label>
        <div className="rating mb-8">
          <input type="radio" name="priority" className="mask bg-primary dark:bg-orange-400 mask-star" value={1} disabled={sending} />
          <input type="radio" name="priority" className="mask bg-primary dark:bg-orange-400 mask-star" value={2} disabled={sending} />
          <input type="radio" name="priority" className="mask bg-primary dark:bg-orange-400 mask-star" value={3} disabled={sending} defaultChecked />
          <input type="radio" name="priority" className="mask bg-primary dark:bg-orange-400 mask-star" value={4} disabled={sending} />
          <input type="radio" name="priority" className="mask bg-primary dark:bg-orange-400 mask-star" value={5} disabled={sending} />
        </div>
      </form>

      <button className="btn btn-primary" disabled={sending} onClick={() => {
        (async () => {
          setSending(true)
          if (props.circle && user) {
            const buyData = {
              uid: user.uid,
              count: parseInt(addFormRef.current?.itemCount.value),
              priority: parseInt(addFormRef.current?.priority.value),
            };
            let addedItem: ItemWithID
            if (item) {
              addedItem = await addBuyer(item.id, buyData)
            } else {
              addedItem = await addItem({
                name: newItem.name,
                price: newItem.price,
                circleId: props.circle.id,
                users: [buyData]
              }) as ItemWithID
              addNewItem(addedItem)
            }
            props.onAdd?.(addedItem)
          }
          setSending(false)
        })()
      }}>追加</button>
    </Fragment>
  )
}
