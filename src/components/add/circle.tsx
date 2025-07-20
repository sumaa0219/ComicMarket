import { addCircle, updateCircle, uploadImage } from "@/lib/db";
import { Circle, CircleWithID } from "@/lib/types";
import { circleWingToString, filterDeleted } from "@/lib/utils";
import { Fragment, useContext, useRef, useState } from "react";
import CircleSelector from "../circleSelector";
import { CircleItemContext } from "./contexts";

interface AddCircleProps {
  // circles: CircleWithID[];
  onSelect?: (circle: CircleWithID) => void;
}

export default function AddCircle(props: AddCircleProps) {
  const [circle, setCircle] = useState<CircleWithID | null>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const [warn, setWarn] = useState<string>("")
  const { circles, addNewCircle } = useContext(CircleItemContext)

  const [sending, setSending] = useState(false)

  async function showWarn(msg: string) {
    setWarn(msg)
    await new Promise(r => setTimeout(r, 5000))
    setWarn("")
  }

  return <Fragment>
    <form className="w-full form-control" onSubmit={e => {
      e.preventDefault()
    }}>
      {
        circle
        && <div className="flex flex-col">
          <div className="flex justify-center">
            {circle.name}
          </div>
          <div className="flex justify-center">
            {circle.day}日目 {circleWingToString(circle.wing)} {circle.place}
          </div>
        </div>
      }
      <CircleSelector circles={circles} onChange={setCircle} className="mt-4" />
    </form>
    {
      !circle && (
        <form className="w-full form-control" onSubmit={e => {
          e.preventDefault()
        }} ref={formRef}>
          <Fragment>
            <div className="divider">または</div>
            <div>
              <label className="label" htmlFor="circleName">
                <span className="label-text">サークル名</span>
              </label>
              <input type="text" id="circleName" placeholder="上海アリス幻樂団" className="input input-bordered w-full" required disabled={!!circle} />

              <label className="label">
                <span className="label-text">出店日</span>
              </label>
              <div className="join w-full">
                <input className="join-item btn w-1/2" type="radio" name="circleDay" aria-label="1日目" value="1" required disabled={!!circle} />
                <input className="join-item btn w-1/2" type="radio" name="circleDay" aria-label="2日目" value="2" required disabled={!!circle} />
              </div>

              <label className="label">
                <span className="label-text">出店棟</span>
              </label>
              <div className="join w-full">
                <input className="join-item btn w-1/3" type="radio" id="circleWing" name="circleWing" aria-label="西" value="west" required disabled={!!circle} />
                <input className="join-item btn w-1/3" type="radio" id="circleWing" name="circleWing" aria-label="東" value="east" required disabled={!!circle} />
                <input className="join-item btn w-1/3" type="radio" id="circleWing" name="circleWing" aria-label="南" value="south" required disabled={!!circle} />
              </div>

              <label className="label" htmlFor="circlePlace">
                <span className="label-text">出店場所</span>
              </label>
              <input type="text" id="circlePlace" placeholder="ま42b" className="input input-bordered w-full" required disabled={!!circle} />

              <label className="label" htmlFor="circleImage">
                <span className="label-text">お品書き</span>
              </label>
              <input type="file" name="circleImage" className="file-input file-input-bordered w-full" />
            </div>
          </Fragment>
        </form>
      )
    }
    <button
      type="submit"
      className="btn btn-primary mt-8"
      disabled={sending}
      onClick={async (e) => {
        setSending(true)
        if (circle) {
          props.onSelect?.(circle)
        } else {
          if (formRef.current) {
            const formData: Circle = {
              name: formRef.current.circleName.value,
              place: formRef.current.circlePlace.value,
              day: formRef.current.circleDay.value,
              wing: formRef.current.circleWing.value,
            };
            const file = (formRef.current.circleImage as HTMLInputElement).files?.[0]

            // 重複するサークルがないか確認
            const duplicateCheck = {
              name: circles.filter(filterDeleted).find(c => c.name === formData.name),
              place: circles.filter(filterDeleted).find(c => c.place === formData.place && c.day === formData.day && c.wing === formData.wing),
            }
            if (duplicateCheck.name) {
              showWarn("同名のサークルが存在")
            } else if (duplicateCheck.place) {
              showWarn("同じ場所にサークルが存在")
            } else {
              const data = await addCircle(formData) as CircleWithID

              // add circle to context
              addNewCircle(data)

              if (file) {
                const fullPath = await uploadImage(file, data.id)
                await updateCircle({
                  ...formData,
                  menuImagePath: fullPath,
                }, data.id)
              }

              props.onSelect?.(data)
            }
          }
        }
        setSending(false)
      }}
    >{sending ? "送信中 ..." : "次へ"}</button>
    {warn && <div className="alert alert-warning mt-8">
      {warn}
    </div>}
  </Fragment>
}
