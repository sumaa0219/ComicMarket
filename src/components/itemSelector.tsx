import { ItemWithID } from "@/lib/types";
import { For } from "million/react";
import { Fragment, useEffect, useRef, useState } from "react";

interface ItemSelectorComponentProps {
  items: ItemWithID[];
  className?: string;
  onChange?: (item: ItemWithID) => void;
}

function ItemSelectorComponent(props: ItemSelectorComponentProps) {
  const [items, setItems] = useState(props.items)
  const [searchQuery, setSeaeachQuery] = useState<string>("")
  useEffect(() => {
    setItems(props.items.filter(item => item.name.includes(searchQuery)))
  }, [props.items, searchQuery])

  return (
    <ul className="flex flex-col text-lg w-[28rem] max-h-[50vh] m-8 overflow-scroll">
      <ul className="w-full mb-4 sticky" >
        <input className="input input-bordered w-full" placeholder="Search..." value={searchQuery} onChange={e => setSeaeachQuery(e.currentTarget.value)} />
      </ul>
      <li className="flex flex-row text-gray-500 border-b border-b-gray-500 sticky top-0 bg-base-100">
        <div className="w-2/5 flex justify-center">商品名</div>
        <div className="w-3/5 flex justify-center">価格</div>
      </li>

      {items.length > 0 ? items.map((item, i) => (
        <li
          className="flex flex-row mt-2 rounded-lg hover:bg-neutral-focus active:bg-neutral transition-[background-color] p-2 cursor-pointer select-none"
          onPointerDown={() => {
            props.onChange?.(item)
          }}
          key={i}
        >
          <div className="w-3/5 max-w-[40%] pl-2 overflow-hidden whitespace-nowrap overflow-ellipsis justify-center">{item.name}</div>
          <div className="w-3/5 flex justify-center">{item.price}円</div>
        </li>
      )) : <div className="flex justify-center my-6">No Data</div>}
    </ul>
  )
}

interface ItemSelectorProps extends ItemSelectorComponentProps {
}
export default function ItemSelector({ items, onChange, ...props }: ItemSelectorProps) {
  const modalRef = useRef<HTMLDialogElement>(null)
  return (
    <Fragment>
      <button {...props} className={`btn ${props.className}`} onClick={() => modalRef.current?.showModal()}>購入物を選択</button>
      <dialog id="my_modal_2" className="modal" ref={modalRef}>
        <div className="modal-box p-0">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onPointerDown={() => modalRef.current?.close()}>✕</button>
          <ItemSelectorComponent {...props} items={items} onChange={c => {
            modalRef.current?.close()
            onChange?.(c)
          }} />
        </div>
        <div className="modal-backdrop" onPointerDown={() => modalRef.current?.close()}></div>
      </dialog>
    </Fragment>
  )
}
