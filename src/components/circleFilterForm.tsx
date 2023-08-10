import CircleCard from "@/lib/circleCard"
import { CircleCondition, CircleWithID, circle, circleCondition } from "@/lib/types"
import { isMatchCondition } from "@/lib/utils"
import { Fragment, useCallback, useEffect, useRef, useState } from "react"
import CircleSelector from "./circleSelector"

interface CircleFilterFormProps {
  circles: CircleWithID[],
  onChange?: (circles: CircleWithID[]) => void,
  onConditionChange?: (condition: CircleCondition) => void,
  enableCircleSelector?: boolean,
}
export default function CircleFilterForm(props: CircleFilterFormProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const [selectedCircle, setSelectedCircle] = useState<null | CircleWithID>(null)

  const filterCircle = useCallback(() => {
    if (formRef.current) {
      if (selectedCircle) {
        props.onChange?.([selectedCircle])
      } else {
        const condition = circleCondition.parse({
          name: formRef.current.circleName[1].value,
          place: formRef.current.circlePlace[1].value,
          days: Object.fromEntries(Array.from<HTMLInputElement>(formRef.current.circleDay).map(d => [d.value, d.checked])),
          wings: Object.fromEntries(Array.from<HTMLInputElement>(formRef.current.circleWing).map(d => [d.value, d.checked])),
          excludeDeleted: (formRef.current.excludeDeleted as HTMLInputElement).checked
        })
        const newCircles = props.circles.filter(c => isMatchCondition(condition, c))
        props.onConditionChange?.(condition)
        props.onChange?.(newCircles)
      }
    }
  }, [selectedCircle, props])

  // filter circles on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => filterCircle(), [selectedCircle])

  return (
    <form className="flex flex-row mb-4 items-center"
      ref={formRef}
      onChange={() => filterCircle()}
      onSubmit={e => e.preventDefault()}
    >
      <div className="mr-2">絞り込み : </div>

      {
        (props.enableCircleSelector === undefined || props.enableCircleSelector) &&
        <Fragment>
          <div className="flex flex-row">
            {
              selectedCircle
                ? <CircleCard circle={selectedCircle} onUnselect={() => setSelectedCircle(null)} />
                : <CircleSelector circles={props.circles} onChange={c => setSelectedCircle(c)} />
            }
          </div>
          <div className="divider lg:divider-horizontal">または</div>
        </Fragment>
      }

      <div className="ml-2">
        <label className="label" htmlFor="circleName">
          <span className="label-text">サークル名</span>
        </label>
        <input type="text" id="circleName" placeholder="上海アリス幻樂団" className="input input-bordered" />
      </div>

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

      <div className="ml-2">
        <label className="label" htmlFor="circlePlace">
          <span className="label-text">出店場所</span>
        </label>
        <input type="text" id="circlePlace" placeholder="ま42b" className="input input-bordered" />
      </div>

      <div className="ml-2 flex flex-row justify-center my-auto">
        <label className="label" htmlFor="excludeDeleted">
          <input type="checkbox" name="excludeDeleted" className="checkbox" defaultChecked />
          <span className="label-text ml-2">削除済みのサークルを無視する</span>
        </label>
      </div>
    </form>
  )
}
