import Layout from "@/components/layout"
import { addCircle, getAllCircles } from "@/lib/db"
import { NextPageContext } from "next"
import { useEffect, useState } from "react"

interface AddCircleProps {
  circles: CircleWithID[]
}

AddCircle.getInitialProps = async (ctx: NextPageContext): Promise<AddCircleProps> => {
  return {
    circles: await getAllCircles()
  }
}

export default function AddCircle(props: AddCircleProps) {
  const [circle, setCircle] = useState<null | Circle>(null)
  const [circleAddMessage, setCircleAddMessage] = useState<string>("")

  useEffect(()=>{
    (async ()=>{
      if (circle !== null) {
        console.log("circle", circle)
        const matches = {
          name: props.circles.some(c => c.name === circle.name),
          place: props.circles.some(c => c.place === circle.place)
        }
        if (matches.name) {
          setCircle(null)
          setCircleAddMessage("同名のサークルが既に登録されています")
          await new Promise(resolve => setTimeout(resolve, 3000))
          setCircleAddMessage("")
        } else if (matches.place) {
          setCircle(null)
          setCircleAddMessage("同じ場所にサークルが既に登録されています")
          await new Promise(resolve => setTimeout(resolve, 3000))
          setCircleAddMessage("")
        } else {
          await addCircle(circle)
          setCircle(null)
          setCircleAddMessage("サークルが追加されました")
          await new Promise(resolve => setTimeout(resolve, 3000))
          setCircleAddMessage("")
        }
      }
    })()
  }, [circle, props.circles])

  return (
    <Layout title="サークル追加">
      <form className="form-control h-screen flex pt-8" onSubmit={e=>{
        e.preventDefault()
        const formData: Circle = {
          name: (e.target as any).circleName.value,
          day: (e.target as any).circleDay.value,
          wing: (e.target as any).circleWing.value,
          place: (e.target as any).circlePlace.value,
        }
        setCircle(formData)
      }}
      >

        <div className="flex flex-col w-1/3 border rounded-lg border-gray-500 p-12 mx-auto">

          <label className="label" htmlFor="circleName">
            <span className="label-text">サークル名</span>
          </label>
          <input type="text" id="circleName" placeholder="上海アリス幻樂団" className="input input-bordered" required disabled={!!circle} />


          <label className="label">
            <span className="label-text">出店日</span>
          </label>
          <div className="join">
            <input className="join-item btn" type="radio" name="circleDay" aria-label="1日目" value="1" required disabled={!!circle} />
            <input className="join-item btn" type="radio" name="circleDay" aria-label="2日目" value="2" required disabled={!!circle} />
          </div>

          <label className="label">
            <span className="label-text">出店棟</span>
          </label>
          <div className="join">
            <input className="join-item btn" type="radio" id="circleWing" name="circleWing" aria-label="西" value="west" required disabled={!!circle} />
            <input className="join-item btn" type="radio" id="circleWing" name="circleWing" aria-label="東" value="east" required disabled={!!circle} />
            <input className="join-item btn" type="radio" id="circleWing" name="circleWing" aria-label="南" value="south" required disabled={!!circle} />
          </div>

          <label className="label" htmlFor="circlePlace">
            <span className="label-text">出店場所</span>
          </label>
          <input type="text" id="circlePlace" placeholder="ま42b" className="input input-bordered" required disabled={!!circle} />

          <div className="mt-4">
            <input type="submit" value={circle === null ? "追加" : "送信中..."} className={`btn btn-primary ${circle && "btn-disabled"}`} />
          </div>

          <div>
            {circleAddMessage}
          </div>
        </div>
      </form>
    </Layout>
  )
}
