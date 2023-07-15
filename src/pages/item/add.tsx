import Layout from "@/components/layout"
import { getAllCircles } from "@/lib/db"
import { Metadata } from "next"
import useSWR from "swr"

export const metadata: Metadata = {
  title: "購入物追加",
}

export default function AddCircle() {
  const { data, error, isLoading } = useSWR(getAllCircles)

  return (
    <Layout title="購入物追加">
      <form className="form-control h-screen flex pt-8" onSubmit={e => {
        e.preventDefault()
        const formData: Item = {
          circleId: "1",
          name: (e.target as any).itemName.value,
          price: parseInt((e.target as any).itemPrice.value),
          count: parseInt((e.target as any).itemCount.value),
          priority: parseInt((e.target as any).priority.value),
        }
        console.log("form submit", formData)
      }}
      >

        <div className="flex flex-col w-1/3 border rounded-lg border-gray-500 p-12 mx-auto">

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
            <input type="submit" value="追加" className="btn btn-primary" />
          </div>

        </div>
      </form>
    </Layout>
  )
}
