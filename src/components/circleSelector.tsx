import type { CircleCondition, CircleWithID } from "@/lib/types";
import { circleWingToString, filterDeleted, isMatchCondition } from "@/lib/utils";
import { createContext, useContext, useState, useRef, useEffect, Fragment, Dispatch, SetStateAction } from "react";

interface CircleSelectorComponentProps {
  circles: CircleWithID[];
  onChange?: (circle: CircleWithID) => void;
}
interface CircleSelectorProps extends CircleSelectorComponentProps, Omit<React.DialogHTMLAttributes<HTMLButtonElement>, "onChange"> { }

const FormDataContext = createContext({
  data: {
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
    },
    excludeDeleted: true,
  },
  setData: () => { }
} as {
  data: CircleCondition;
  setData: Dispatch<SetStateAction<CircleCondition>>;
})

interface CircleSelectorFormProps {
  className?: string;
  onDataChanged?: (data: CircleCondition) => void;
}
export function CircleSelectorForm(props: CircleSelectorFormProps) {
  const { setData } = useContext(FormDataContext);

  return (
    <div className={`flex flex-col ${props.className}`}>
      <div className="mb-2">
        <label className="label" htmlFor="circleName">
          <span className="label-text">サークル名</span>
        </label>
        <input
          type="text"
          id="circleName"
          placeholder="上海アリス幻樂団"
          className="input input-bordered w-[27.5rem]"
          onChange={e => setData((prev) => ({ ...prev, name: e.target.value }))}
        />
      </div>

      <div className="flex flex-row">
        <div className="">
          <label className="label">
            <span className="label-text">出店日</span>
          </label>
          <div
            className="join"
            onChange={e => setData((prev) => ({
              ...prev, days: {
                ...prev.days,
                [(e.target as HTMLInputElement).value]: (e.target as HTMLInputElement).checked
              }
            }))}
          >
            <input className="join-item btn" type="checkbox" name="circleDay" aria-label="1日目" value="1" defaultChecked />
            <input className="join-item btn" type="checkbox" name="circleDay" aria-label="2日目" value="2" defaultChecked />
          </div>
        </div>

        <div className="ml-2">
          <label className="label">
            <span className="label-text">出店棟</span>
          </label>
          <div className="join" onChange={e => setData((prev) => ({
            ...prev, wings: {
              ...prev.wings,
              [(e.target as HTMLInputElement).value]: (e.target as HTMLInputElement).checked
            }
          }))
          }>
            <input className="join-item btn" type="checkbox" id="circleWing" name="circleWing" aria-label="西" value="west" defaultChecked />
            <input className="join-item btn" type="checkbox" id="circleWing" name="circleWing" aria-label="東" value="east" defaultChecked />
            <input className="join-item btn" type="checkbox" id="circleWing" name="circleWing" aria-label="南" value="south" defaultChecked />
          </div>
        </div>

        <div className="ml-2">
          <label className="label" htmlFor="circlePlace">
            <span className="label-text">出店場所</span>
          </label>
          <input
            type="text"
            id="circlePlace"
            placeholder="ま42b"
            className="input input-bordered w-36"
            onChange={e => setData((prev) => ({ ...prev, place: e.target.value }))}
          />
        </div>
      </div>
    </div>
  )
}

export function CircleSelectorComponent(props: CircleSelectorComponentProps) {
  const [formData, setFormData] = useState<CircleCondition>({
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
    },
    excludeDeleted: true,
  })
  const initialCircleData = props.circles
  const [circles, setCircles] = useState<CircleWithID[]>(filterDeleted(initialCircleData))
  useEffect(() => {
    setCircles(initialCircleData.filter(c => isMatchCondition(formData, c)))
  }, [formData, initialCircleData])
  return (
    <FormDataContext.Provider value={{ data: formData, setData: setFormData }}>
      <CircleSelectorForm className="m-8 mb-0" />
      <ul className="flex flex-col text-lg w-[28rem] max-h-[50vh] m-8 overflow-scroll">
        <li className="flex flex-row text-gray-500 border-b border-b-gray-500 sticky top-0 bg-base-100 ">
          <div className="w-2/5 flex justify-center">サークル名</div>
          <div className="w-1/5 flex justify-center">出店日</div>
          <div className="w-1/5 flex justify-center">出店棟</div>
          <div className="w-1/5 flex justify-center">出店場所</div>
        </li>

        {circles.length > 0 ? circles.map((c, i) => (
          <li
            className="flex flex-row mt-2 rounded-lg hover:bg-neutral-focus active:bg-neutral transition-[background-color] p-2 cursor-pointer select-none"
            onClick={() => {
              props.onChange?.(c)
            }}
            key={i}
          >
            <div className="w-2/5 max-w-[40%] pl-2 overflow-hidden whitespace-nowrap overflow-ellipsis">{c.name}</div>
            <div className="w-1/5 flex justify-center">{c.day}日目</div>
            <div className="w-1/5 flex justify-center">
              {circleWingToString(c.wing)}
            </div>
            <div className="w-1/5 flex justify-center">{c.place}</div>
          </li>
        )) : <div className="flex justify-center my-6">No Data</div>}
      </ul>
    </FormDataContext.Provider>
  )
}

export default function CircleSelector({
  onChange,
  circles,
  ...props
}: CircleSelectorProps) {
  const modalRef = useRef<HTMLDialogElement>(null)
  return (
    <Fragment>
      <button {...props} className={`btn w-full ${props.className}`} onClick={() => modalRef.current?.showModal()}>サークルを選択</button>
      <dialog id="my_modal_2" className="modal" ref={modalRef}>
        <div className="modal-box p-0 h-4/5">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onPointerDown={() => modalRef.current?.close()}>✕</button>
          <CircleSelectorComponent {...props} circles={circles} onChange={c => {
            modalRef.current?.close()
            onChange?.(c)
          }} />
        </div>
        <div className="modal-backdrop" onPointerDown={() => modalRef.current?.close()}></div>
      </dialog>
    </Fragment>
  )
}
