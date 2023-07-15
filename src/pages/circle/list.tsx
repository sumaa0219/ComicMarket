import Layout from "@/components/layout"
import { getAllCircles } from "@/lib/db"
import { Metadata, NextPageContext } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "購入物追加",
}

interface ListCircleProps {
  circles: CircleWithID[]
}

ListCircle.getInitialProps = async (ctx: NextPageContext): Promise<ListCircleProps> => {
  const circles = await getAllCircles()
  return {
    circles
  }
}

export default function ListCircle(props: ListCircleProps) {
  return (
    <Layout>
      <form className="flex flex-row mb-4 items-center">
        <div>絞り込み : </div>
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
      </form>

      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>サークル名</th>
              <th>出店日</th>
              <th>出店棟</th>
              <th>出店場所</th>
            </tr>
          </thead>
          <tbody>
            {props.circles.map((c, i) => (
              <tr className="" key={i}>
                <td className="">
                  <Link href={`/circle/${c.id}`} className="w-full">
                    {c.name}
                  </Link>
                </td>
                <td>{c.day}日目</td>
                <td>{({
                  west: "西",
                  east: "東",
                  south: "南",
                })[c.wing]}</td>
                <td>{c.place}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  )
}